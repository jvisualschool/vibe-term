document.getElementById('openWeb').addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://jvibeschool.org/VIBETERM' });
});
