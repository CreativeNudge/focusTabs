document.addEventListener('DOMContentLoaded', () => {
    loadSavedTabs();

    // Add event listener for the "Add Category" button
    const addCategoryBtn = document.createElement('button');
    addCategoryBtn.textContent = 'Add Category';
    addCategoryBtn.addEventListener('click', addCategory);
    document.body.insertBefore(addCategoryBtn, document.getElementById('tabsList'));
});
  
function loadSavedTabs() {
    console.log('Loading saved tabs');
    chrome.storage.sync.get({ savedTabs: [], categories: ['Main'] }, (data) => {
      console.log('Retrieved saved tabs:', data.savedTabs);
      displayTabs(data.savedTabs, data.categories);
    });
}
  
function displayTabs(savedTabs, categories) {
    const tabsList = document.getElementById('tabsList');
    tabsList.innerHTML = ''; // Clear existing content
    
    console.log('Displaying tabs, savedTabs:', savedTabs);
  
    sortCategories(categories).forEach(category => {
      const tabsInCategory = savedTabs.filter(tab => tab.category === category);
      displayCategory(category, tabsInCategory, tabsList);
    });
}
  
function displayCategory(category, tabs, tabsList) {
    console.log(`Processing category: ${category}`);
  
    const categoryContainer = document.createElement('div');
    categoryContainer.className = 'category-container';
  
    const categoryHeader = document.createElement('div');
    categoryHeader.className = 'category-header';
  
    const categoryTitle = document.createElement('h2');
    categoryTitle.textContent = category;
  
    const deleteCategoryBtn = document.createElement('button');
    deleteCategoryBtn.textContent = 'Delete Category';
    deleteCategoryBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent the click from bubbling up to the header
      deleteCategory(category);
    });
  
    categoryHeader.appendChild(categoryTitle);
    categoryHeader.appendChild(deleteCategoryBtn);
  
    const categoryContent = document.createElement('div');
    categoryContent.className = 'category-content';
    categoryContent.style.display = 'none';
  
    // Make the entire header clickable
    categoryHeader.addEventListener('click', () => {
      categoryContent.style.display = categoryContent.style.display === 'none' ? 'block' : 'none';
    });
  
    if (tabs.length === 0) {
      const emptyMessage = document.createElement('p');
      emptyMessage.textContent = 'No tabs saved in this category yet.';
      categoryContent.appendChild(emptyMessage);
    } else {
      tabs.forEach((tab, index) => {
        console.log(`Processing tab ${index} in ${category}:`, tab);
  
        const tabElement = document.createElement('div');
        tabElement.className = 'tab-entry';
        
        const linkWrapper = document.createElement('a');
        linkWrapper.href = tab.url;
        linkWrapper.className = 'tab-link';
        linkWrapper.target = '_blank';
        linkWrapper.rel = 'noopener noreferrer';
  
        const faviconImg = document.createElement('img');
        faviconImg.className = 'tab-favicon';
        faviconImg.src = tab.favicon || 'default-favicon.png';
        faviconImg.width = 16;
        faviconImg.height = 16;
  
        const titleSpan = document.createElement('span');
        titleSpan.className = 'tab-title';
        titleSpan.textContent = tab.title;
  
        linkWrapper.appendChild(faviconImg);
        linkWrapper.appendChild(titleSpan);
  
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-btn';
        removeBtn.textContent = 'Remove';
        removeBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation(); // Prevent the click from bubbling up to the header
          removeTab(tab);
        });
  
        tabElement.appendChild(linkWrapper);
        tabElement.appendChild(removeBtn);
  
        categoryContent.appendChild(tabElement);
  
        console.log(`Added tab element to DOM for ${tab.title}`);
      });
    }
  
    categoryContainer.appendChild(categoryHeader);
    categoryContainer.appendChild(categoryContent);
    tabsList.appendChild(categoryContainer);
}
  
function removeTab(tabToRemove) {
    chrome.storage.sync.get({ savedTabs: [] }, (data) => {
      let savedTabs = data.savedTabs;
      savedTabs = savedTabs.filter(tab => tab.url !== tabToRemove.url);
      chrome.storage.sync.set({ savedTabs }, () => {
        console.log('Tab removed:', savedTabs);
        loadSavedTabs();
      });
    });
}
  
function deleteCategory(category) {
    chrome.storage.sync.get({ savedTabs: [], categories: [] }, (data) => {
      let savedTabs = data.savedTabs;
      let categories = data.categories;
  
      const tabsInCategory = savedTabs.filter(tab => tab.category === category);
  
      if (tabsInCategory.length > 0) {
        showConfirm(`Are you sure you want to delete the category "${category}" and all its tabs?`, () => {
          savedTabs = savedTabs.filter(tab => tab.category !== category);
          categories = categories.filter(c => c !== category);
  
          chrome.storage.sync.set({ savedTabs, categories }, () => {
            console.log('Category deleted:', category);
            loadSavedTabs();
          });
        });
      } else {
        categories = categories.filter(c => c !== category);
        chrome.storage.sync.set({ categories }, () => {
          console.log('Empty category deleted:', category);
          loadSavedTabs();
        });
      }
    });
}