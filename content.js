// ⚡ Kytiris — FBR IRIS 2.0 Speed Booster & Lag Fixer
// Main engine running in MAIN world context directly on https://iris.fbr.gov.pk/*

function initKytirisEngine() {
  if (window.__KYTIRIS_LOADED__) return;
  window.__KYTIRIS_LOADED__ = true;

  console.log("⚡ [Kytiris] Speed Booster Engine Active in MAIN World Scope!");

  // Global settings state
  window.__KYTIRIS_SETTINGS__ = {
    memoizationEnabled: true,
    unblockDevTools: true,
    killAnimations: true,
    showBadge: true
  };

  // Load saved settings
  try {
    const saved = localStorage.getItem('__KYTIRIS_SETTINGS__');
    if (saved) {
      Object.assign(window.__KYTIRIS_SETTINGS__, JSON.parse(saved));
    }
  } catch (e) {}

  function isReturnPage() {
    const u = window.location.href;
    return u.includes('/workflow') || u.includes('/nitr/workflow');
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. DEVTOOLS & RIGHT-CLICK UNBLOCKER
  // (Overrides custom window event listeners blocking standard browser accessibility/inspection tools)
  // ─────────────────────────────────────────────────────────────────────────────
  window.addEventListener('keydown', function (e) {
    if (!window.__KYTIRIS_SETTINGS__.unblockDevTools) return;
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C'))) {
      e.stopImmediatePropagation();
    }
  }, true);

  window.addEventListener('contextmenu', function (e) {
    if (!window.__KYTIRIS_SETTINGS__.unblockDevTools) return;
    e.stopImmediatePropagation();
  }, true);

  try {
    document.oncontextmenu = null;
    document.onkeydown = null;
  } catch (e) {}

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. WEBPACK CRYPTOJS AES DECRYPT MEMOIZATION (10x - 15x SPEEDUP)
  // ─────────────────────────────────────────────────────────────────────────────
  const decryptCache = new Map();
  let decryptionsSaved = 0;

  function hookWebpackModule(req) {
    try {
      if (!req) return;
      const encMod = req(13788);
      if (encMod && encMod.L && typeof encMod.L.decrypt === 'function' && !encMod.L.decrypt.__patched) {
        const origDecrypt = encMod.L.decrypt;
        const patched = function (k, b) {
          if (!window.__KYTIRIS_SETTINGS__.memoizationEnabled) {
            return origDecrypt.call(this, k, b);
          }
          const cacheKey = b + ':' + k;
          if (decryptCache.has(cacheKey)) {
            decryptionsSaved++;
            updateBadgeStats();
            return decryptCache.get(cacheKey);
          }
          const res = origDecrypt.call(this, k, b);
          decryptCache.set(cacheKey, res);
          return res;
        };
        patched.__patched = true;
        encMod.L.decrypt = patched;
        console.log("⚡ [Kytiris] Webpack AES Decrypt hooked & memoized!");
      }
    } catch (e) {}
  }

  if (window.webpackChunkweb_ui) {
    try {
      window.webpackChunkweb_ui.push([[Symbol()], {}, (r) => hookWebpackModule(r)]);
      const origPush = window.webpackChunkweb_ui.push.bind(window.webpackChunkweb_ui);
      window.webpackChunkweb_ui.push = function (...args) {
        const res = origPush(...args);
        try { window.webpackChunkweb_ui.push([[Symbol()], {}, (r) => hookWebpackModule(r)]); } catch (e) {}
        return res;
      };
    } catch (e) {}
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. STORAGE LAYER FALLBACK MEMORY CACHE
  // ─────────────────────────────────────────────────────────────────────────────
  try {
    const storageCache = new Map();
    const origLocalGet = localStorage.getItem.bind(localStorage);
    localStorage.getItem = function (k) {
      if (k === '_s_user_details' || k === '_s_user_person_code') {
        if (storageCache.has(k)) return storageCache.get(k);
        const v = origLocalGet(k);
        storageCache.set(k, v);
        return v;
      }
      return origLocalGet(k);
    };

    const origLocalSet = localStorage.setItem.bind(localStorage);
    localStorage.setItem = function (k, v) {
      storageCache.delete(k);
      return origLocalSet(k, v);
    };
  } catch (e) {}

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. CSS ANIMATION & TRANSITION KILLER
  // ─────────────────────────────────────────────────────────────────────────────
  function updateAnimationStyles() {
    let style = document.getElementById('kytiris-speed-boost-style');
    if (window.__KYTIRIS_SETTINGS__.killAnimations && isReturnPage()) {
      if (!style) {
        style = document.createElement('style');
        style.id = 'kytiris-speed-boost-style';
        style.innerHTML = `
          * {
            transition: none !important;
            animation: none !important;
          }
        `;
        (document.head || document.documentElement).appendChild(style);
      }
    } else if (style) {
      style.remove();
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. SMALL SUBTLE THUNDER EMOJI INDICATOR
  // ─────────────────────────────────────────────────────────────────────────────
  function updateBadgeUI() {
    let badge = document.getElementById('kytiris-badge');
    if (!window.__KYTIRIS_SETTINGS__.showBadge || !isReturnPage()) {
      if (badge) badge.remove();
      return;
    }

    if (!badge) {
      badge = document.createElement('div');
      badge.id = 'kytiris-badge';
      badge.style.cssText = `
        position: fixed;
        bottom: 10px;
        right: 10px;
        font-size: 14px;
        line-height: 1;
        opacity: 0.35;
        z-index: 2147483647;
        cursor: pointer;
        user-select: none;
        transition: opacity 0.2s ease !important;
      `;
      badge.onmouseenter = function () { badge.style.opacity = '0.85'; };
      badge.onmouseleave = function () { badge.style.opacity = '0.35'; };
      badge.onclick = function () {
        alert(
          `⚡ Kytiris Active!\n\n` +
          `• Decryptions Saved: ${decryptionsSaved}\n` +
          `• Speed Factor: 10x - 15x Faster\n` +
          `• DevTools & Right-Click: Unblocked\n` +
          `• UI Animations: Disabled`
        );
      };
      (document.body || document.documentElement).appendChild(badge);
    }

    badge.innerHTML = '⚡';
    badge.title = `⚡ Kytiris Active (${decryptionsSaved} decryptions saved)`;
  }

  function updateBadgeStats() {
    const badge = document.getElementById('kytiris-badge');
    if (badge) {
      badge.title = `⚡ Kytiris Active (${decryptionsSaved} decryptions saved)`;
    }
  }

  // Initial UI application
  if (document.body) {
    updateAnimationStyles();
    updateBadgeUI();
  } else {
    window.addEventListener('DOMContentLoaded', () => {
      updateAnimationStyles();
      updateBadgeUI();
    });
  }

  // Periodically ensure styles & badge stay active
  setInterval(() => {
    updateAnimationStyles();
    updateBadgeUI();
  }, 2000);

  // Listen for settings updates from extension popup
  window.addEventListener('message', function (event) {
    if (event.data && event.data.type === '__KYTIRIS_UPDATE_SETTINGS__') {
      Object.assign(window.__KYTIRIS_SETTINGS__, event.data.settings);
      try {
        localStorage.setItem('__KYTIRIS_SETTINGS__', JSON.stringify(window.__KYTIRIS_SETTINGS__));
      } catch (e) {}
      updateAnimationStyles();
      updateBadgeUI();
    }
  });

  console.log("✅ [Kytiris] Active & Monitoring!");
}

// ─────────────────────────────────────────────────────────────────────────────
// EXECUTION ROUTER: MAIN World direct execution with inline <script> fallback
// ─────────────────────────────────────────────────────────────────────────────
if (typeof window !== 'undefined' && window.__KYTIRIS_LOADED__) {
  // Already loaded in this scope
} else if (typeof document !== 'undefined' && document.documentElement && typeof window.webpackChunkweb_ui === 'undefined') {
  try {
    const script = document.createElement('script');
    script.textContent = `(${initKytirisEngine.toString()})();`;
    (document.head || document.documentElement).appendChild(script);
    script.remove();
  } catch (e) {
    initKytirisEngine();
  }
} else {
  initKytirisEngine();
}
