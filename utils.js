// Utility functions for alerts, confirms, and prompts
function showAlert(message, callback) {
    const alertModal = document.getElementById('customAlert');
    const alertMessage = document.getElementById('alertMessage');
    const alertOk = document.getElementById('alertOk');
  
    alertMessage.textContent = message;
    alertModal.style.display = 'block';
  
    alertOk.onclick = function() {
      alertModal.style.display = 'none';
      if (callback) callback();
    };
}
  
function showConfirm(message, yesCallback, noCallback) {
    const confirmModal = document.getElementById('customConfirm');
    const confirmMessage = document.getElementById('confirmMessage');
    const confirmYes = document.getElementById('confirmYes');
    const confirmNo = document.getElementById('confirmNo');
  
    confirmMessage.textContent = message;
    confirmModal.style.display = 'block';
  
    confirmYes.onclick = function() {
      confirmModal.style.display = 'none';
      if (yesCallback) yesCallback();
    };
  
    confirmNo.onclick = function() {
      confirmModal.style.display = 'none';
      if (noCallback) noCallback();
    };
}
  
function showPrompt(message) {
    return new Promise((resolve) => {
      const promptModal = document.getElementById('customPrompt');
      const promptMessage = document.getElementById('promptMessage');
      const promptInput = document.getElementById('promptInput');
      const promptOk = document.getElementById('promptOk');
      const promptCancel = document.getElementById('promptCancel');
  
      promptMessage.textContent = message;
      promptInput.value = '';
      promptModal.style.display = 'block';
      promptInput.focus();
  
      promptOk.onclick = function() {
        const value = promptInput.value.trim();
        promptModal.style.display = 'none';
        resolve(value);
      };
  
      promptCancel.onclick = function() {
        promptModal.style.display = 'none';
        resolve(null);
      };
  
      promptInput.onkeyup = function(event) {
        if (event.key === 'Enter') {
          promptOk.click();
        } else if (event.key === 'Escape') {
          promptCancel.click();
        }
      };
    });
}
  
// Function to sort categories
function sortCategories(categories) {
    return categories
      .filter(category => typeof category === 'string')
      .sort((a, b) => a.localeCompare(b));
}