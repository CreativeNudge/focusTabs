chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed');
  });
  
  chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      chrome.storage.sync.get({ savedTabs: [] }, (data) => {
        const newTabs = data.savedTabs.concat(currentTab);
        chrome.storage.sync.set({ savedTabs: newTabs });
      });
    });
  });
  
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'showTabs') {
      chrome.tabs.create({ url: chrome.runtime.getURL('tabs.html') });
    }
  });