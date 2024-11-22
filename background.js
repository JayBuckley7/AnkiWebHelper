// Handle messages from the content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "openOrReloadJpdb") {
      const jpdbUrl = message.url;
  
      // Check if a tab with jpdb.io is already open
      chrome.tabs.query({}, (tabs) => {
        const existingTab = tabs.find((tab) => tab.url && tab.url.startsWith("https://jpdb.io/"));
  
        if (existingTab) {
          // Reload the existing tab with the new URL
          chrome.tabs.update(existingTab.id, { url: jpdbUrl, active: true });
        } else {
          // Open a new tab if no existing tab is found
          chrome.tabs.create({ url: jpdbUrl });
        }
      });
  
      sendResponse({ success: true });
    }
  });
  