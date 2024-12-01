chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "focusTab") {
      chrome.windows.update(sender.tab.windowId, { focused: true }, () => {
        chrome.tabs.update(sender.tab.id, { active: true }, () => {
          sendResponse({ success: true, message: "Tab focused" });
        });
      });
      return true; // Indicates async response
    }
  });
  