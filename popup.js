document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('addCategory').addEventListener('click', async () => {
      await addCategory();
      loadCategories();
    });
  
    document.getElementById('saveTab').addEventListener('click', () => {
      console.log('Save button clicked');
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        console.log('Current tab:', tabs[0]);
        const currentTab = tabs[0];
        const category = document.getElementById('category').value;
        console.log('Selected category:', category);
        chrome.storage.sync.get({ savedTabs: [] }, (data) => {
          console.log('Existing saved tabs:', data.savedTabs);
          let savedTabs = data.savedTabs;
          if (!Array.isArray(savedTabs)) {
            savedTabs = [];
          }
          savedTabs.push({
            title: currentTab.title,
            url: currentTab.url,
            category: category,
            favicon: currentTab.favIconUrl || null
          });
          chrome.storage.sync.set({ savedTabs }, () => {
            console.log('Updated saved tabs:', savedTabs);
            showAlert('Tab saved!');
          });
        });
      });
    });    
  
    document.getElementById('showTabs').addEventListener('click', () => {
      chrome.tabs.create({ url: chrome.runtime.getURL('tabs.html') });
    });
  
    // Load categories
    loadCategories();
  });
  
  // Shared function for adding a category
  async function addCategory() {
    const category = await showPrompt('Enter new category name:');
    if (category) {
      chrome.storage.sync.get({ categories: ['Main'] }, (data) => {
        let categories = data.categories;
        if (!categories.includes(category)) {
          categories.push(category);
          categories = sortCategories(categories);
          chrome.storage.sync.set({ categories }, () => {
            showAlert('Category added successfully!');
            loadCategories();
          });
        } else {
          showAlert('Category already exists.');
        }
      });
    }
  }
  
  // Load categories
  function loadCategories() {
    console.log('Loading categories');
    chrome.storage.sync.get({ categories: ['Main'], savedTabs: [] }, (data) => {
      console.log('Retrieved categories:', data.categories);
      console.log('Retrieved saved tabs:', data.savedTabs);
  
      const categorySelect = document.getElementById('category');
      categorySelect.innerHTML = ''; // Clear existing options
  
      // Get unique categories from both saved categories and tabs
      const tabCategories = [...new Set(data.savedTabs.map(tab => tab.category))];
      const allCategories = [...new Set([...data.categories, ...tabCategories])];
  
      // Sort and filter categories
      const sortedCategories = sortCategories(allCategories);
  
      sortedCategories.forEach((category) => {
        const option = document.createElement('option');
        option.value = category;
        option.text = category;
        categorySelect.add(option);
      });
  
      console.log('Categories loaded:', sortedCategories);
    });
}

document.getElementById('logo-link').addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: "https://creativenudge.github.io/activefocus-youtube-filter/" });
});