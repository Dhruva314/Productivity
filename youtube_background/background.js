const allowedYouTubeUrl = "https://www.youtube.com/watch?v=jfKfPfyJRdk";
const blackList = [
  "youtube.com",
  "hurawatchtv.tv",
  "instagram.com/direct"
];

// Checks if a new tab is in the list of permitted websites
function isBlackListed(url) {
  try {
    if (url === allowedYouTubeUrl) {
      return false;
    }
    
    const parsedUrl = new URL(url);
    const href = parsedUrl.href;

    for (let i = 0; i < blackList.length; i++) {
      if (url.includes(blackList[i])) return true;
    }

    return false;
  } catch (e) {
    console.error("Invalid URL:", url);
    return false;
  }
}

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

  if (changeInfo.status === "complete" && tab.url && isBlackListed(tab.url)) {
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
  // const youtubePattern = /^https:\/\/www\.youtube\.com\/watch\?v=jfKfPfyJRdk$/;
  // if (url.includes("youtube.com") && !youtubePattern.test(url)) {
  //     chrome.tabs.remove(tabId);
  // }
  if (isBlackListed(url)) chrome.tabs.remove(tabId);
}


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "recheckTabs") {
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        if (tab.url && isBlackListed(tab.url)) {
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
