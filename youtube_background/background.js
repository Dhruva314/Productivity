// Checks if the current time is within the allowed schedule
async function isWithinSchedule() {
  const data = await chrome.storage.local.get("schedule");
  const schedule = data.schedule || {};
  const now = new Date();
  const day = now.getDay();
  const currentTime = now.getHours() * 60 + now.getMinutes(); // Convert to minutes for easy comparison

  const slots = schedule[day] || [];
  return slots.some(slot => {
      const [startH, startM] = slot.start.split(":").map(Number);
      const [endH, endM] = slot.end.split(":").map(Number);
      const startMinutes = startH * 60 + startM;
      const endMinutes = endH * 60 + endM;
      
      return currentTime >= startMinutes && currentTime <= endMinutes;
  });
}


// Monitors tab updates and closes unauthorized YouTube tabs
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // console.log(`Tab updated: ${tabId}`, changeInfo, tab.url);

  if (changeInfo.status === "complete" && tab.url && tab.url.includes("youtube.com")) {
    // console.log("Youtube Detected");
    
    isWithinSchedule().then((block) => {  // Use `.then()` to handle async function
      if (block) {
        chrome.tabs.query({}, (tabs) => {
          tabs.forEach((tab) => {
              if (tab.url) checkAndCloseTab(tab.id, tab.url);
          });
        });
      }
    });
  }
});

function checkAndCloseTab(tabId, url) {
  const youtubePattern = /^https:\/\/www\.youtube\.com\/watch\?v=[^&]+&list=PLc2GtNo0-wWeKdod0MIXk-aKSSU1HuYJl&index=\d+$/;
  if (url.includes("youtube.com") && !youtubePattern.test(url)) {
      chrome.tabs.remove(tabId);
  }
}


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "recheckTabs") {
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        if (tab.url && tab.url.includes("youtube.com")) {
          // Check if the current time is within the allowed schedule
          isWithinSchedule().then((block) => {  // Use `.then()` to handle async function
            if (block) {
              checkAndCloseTab(tab.id, tab.url);  // Close the tab if necessary
            }
          }).catch((error) => {
            console.error("Error checking schedule:", error);
          });
        }
      });
    });
  }
});
