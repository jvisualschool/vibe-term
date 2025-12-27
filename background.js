chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "add_to_vibeterm",
    title: "VIBETERM에 추가",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "add_to_vibeterm") {
    const selectedText = info.selectionText;
    const sourceUrl = tab.url;

    if (selectedText) {
      addTermToServer(selectedText, sourceUrl);
    }
  }
});

async function addTermToServer(term, sourceUrl) {
  const apiUrl = 'https://jvibeschool.org/VIBETERM/api/add_term.php';
  
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        term: term,
        source_url: sourceUrl
      })
    });

    const result = await response.json();

    if (result.status === 'success') {
      showNotification("성공!", "용어가 VIBETERM에 저장되었습니다.");
    } else {
      showNotification("오류", "용어 저장 중 문제가 발생했습니다: " + result.message);
    }
  } catch (error) {
    console.error('Error:', error);
    showNotification("오류", "서버와 통신할 수 없습니다.");
  }
}

function showNotification(title, message) {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icon.png',
    title: title,
    message: message,
    priority: 2
  });
}
