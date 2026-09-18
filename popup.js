// ⚡ Kytiris — Extension Popup Controller

document.addEventListener('DOMContentLoaded', () => {
  const ids = {
    memoizationEnabled: 'toggle-memoization',
    unblockDevTools: 'toggle-devtools',
    killAnimations: 'toggle-animations',
    showBadge: 'toggle-badge'
  };

  const defaultSettings = {
    memoizationEnabled: true,
    unblockDevTools: true,
    killAnimations: true,
    showBadge: true
  };

  // Load saved settings
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    chrome.storage.local.get(defaultSettings, (settings) => {
      applyToUI(settings || defaultSettings);
    });
  } else {
    try {
      const saved = localStorage.getItem('__KYTIRIS_SETTINGS__');
      applyToUI(saved ? JSON.parse(saved) : defaultSettings);
    } catch (e) {
      applyToUI(defaultSettings);
    }
  }

  function applyToUI(settings) {
    for (const [key, elId] of Object.entries(ids)) {
      const el = document.getElementById(elId);
      if (el) {
        el.checked = settings[key] !== false;
        el.addEventListener('change', saveAndSync);
      }
    }
  }

  function saveAndSync() {
    const current = {};
    for (const [key, elId] of Object.entries(ids)) {
      const el = document.getElementById(elId);
      if (el) current[key] = el.checked;
    }

    // Save to storage
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set(current);
    }
    try {
      localStorage.setItem('__KYTIRIS_SETTINGS__', JSON.stringify(current));
    } catch (e) {}

    // Send update message to active IRIS tabs
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.query({ url: "*://iris.fbr.gov.pk/*" }, (tabs) => {
        if (!tabs || !tabs.length) return;
        tabs.forEach(tab => {
          if (chrome.scripting && chrome.scripting.executeScript) {
            try {
              chrome.scripting.executeScript({
                target: { tabId: tab.id },
                world: 'MAIN',
                func: (settings) => {
                  window.postMessage({
                    type: '__KYTIRIS_UPDATE_SETTINGS__',
                    settings
                  }, '*');
                },
                args: [current]
              });
            } catch (e) {}
          }
        });
      });
    }
  }
});
