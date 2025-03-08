document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("schedule-container");
  const saveBtn = document.getElementById("save-btn");

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  function loadSchedule() {
      chrome.storage.local.get("schedule", (data) => {
          const schedule = data.schedule || {};
          container.innerHTML = ""; // Clear previous content

          daysOfWeek.forEach((day, index) => {
              const dayDiv = document.createElement("div");
              dayDiv.className = "day";
              dayDiv.innerHTML = `<strong>${day}</strong> <button class="add-slot" data-day="${index}">+</button>`;

              const slotsDiv = document.createElement("div");
              slotsDiv.id = `slots-${index}`;

              (schedule[index] || []).forEach((slot) => {
                  const slotElem = createSlotElement(slot.start, slot.end);
                  slotsDiv.appendChild(slotElem);
              });

              dayDiv.appendChild(slotsDiv);
              container.appendChild(dayDiv);
          });

          // Attach event listeners for each "+” button dynamically
          document.querySelectorAll(".add-slot").forEach(button => {
              button.addEventListener("click", (event) => {
                  const dayIndex = event.target.getAttribute("data-day");
                  const slotsDiv = document.getElementById(`slots-${dayIndex}`);
                  const slotElem = createSlotElement("09:00", "17:00");
                  slotsDiv.appendChild(slotElem);
              });
          });
      });
  }

  function createSlotElement(start, end) {
      const div = document.createElement("div");
      div.className = "slot";
      div.innerHTML = `
          <input type="time" value="${start}" class="start-time">
          to
          <input type="time" value="${end}" class="end-time">
          <button class="remove-slot">x</button>
      `;

      div.querySelector(".remove-slot").addEventListener("click", () => {
          div.remove();
      });

      return div;
  }

  saveBtn.addEventListener("click", () => {
    const newSchedule = {};

    daysOfWeek.forEach((_, dayIndex) => {
        const slotsDiv = document.getElementById(`slots-${dayIndex}`);
        const slots = [];

        slotsDiv.querySelectorAll(".slot").forEach((slotDiv) => {
            const start = slotDiv.querySelector(".start-time").value;
            const end = slotDiv.querySelector(".end-time").value;
            if (start && end) slots.push({ start, end });
        });

        if (slots.length > 0) newSchedule[dayIndex] = slots;
    });

    chrome.storage.local.set({ schedule: newSchedule }, () => {
        alert("Schedule saved!");
        chrome.runtime.sendMessage({ action: "recheckTabs" }); // 🔥 Triggers tab recheck
    });
});


  loadSchedule();
});
