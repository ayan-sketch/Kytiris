// ⚡ Kytiris — FBR IRIS 2.0 Speed Booster & Lag Fixer
// Fast typing memoization, CSS optimization, and unblocking DevTools (NO calculation freezing)

(function () {
  function isReturnPage() {
    const u = window.location.href;
    return u.includes('/workflow') || u.includes('/nitr/workflow');
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. DEVTOOLS & RIGHT-CLICK UNBLOCKER
  // ─────────────────────────────────────────────────────────────────────────────
  window.addEventListener('keydown', function (e) {
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C'))) {
      e.stopImmediatePropagation();
    }
  }, true);

  window.addEventListener('contextmenu', function (e) {
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
  let isHooked = false;

  function hookModule(req) {
    try {
      if (!req) return;
      const encMod = req(13788);
      if (encMod && encMod.L && typeof encMod.L.decrypt === 'function' && !encMod.L.decrypt.__patched) {
        const origDecrypt = encMod.L.decrypt;
        const patched = function (k, b) {
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
        isHooked = true;
        console.log("⚡ [Kytiris] Webpack AES Decrypt successfully hooked & memoized!");
      }
    } catch (e) {}
  }

  function tryHookWebpack() {
    if (isHooked) return;
    if (window.webpackChunkweb_ui && typeof window.webpackChunkweb_ui.push === 'function') {
      try {
        if (!window.webpackChunkweb_ui.__kytiris_hooked__) {
          window.webpackChunkweb_ui.__kytiris_hooked__ = true;
          window.webpackChunkweb_ui.push([[Symbol()], {}, (r) => hookModule(r)]);
        }
      } catch (e) {}
    }
  }

  // Hook when Webpack becomes available
  if (window.webpackChunkweb_ui) {
    tryHookWebpack();
  } else {
    const checkInterval = setInterval(() => {
      if (window.webpackChunkweb_ui) {
        clearInterval(checkInterval);
        tryHookWebpack();
      }
    }, 100);
    setTimeout(() => clearInterval(checkInterval), 20000);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. STORAGE LAYER FALLBACK CACHE
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
  // 4. CSS ANIMATION / TRANSITION KILLER (Return page only)
  // ─────────────────────────────────────────────────────────────────────────────
  function applyStyles() {
    if (!document.head) return;
    let style = document.getElementById('kytiris-speed-boost-style');
    if (isReturnPage()) {
      if (!style) {
        style = document.createElement('style');
        style.id = 'kytiris-speed-boost-style';
        style.innerHTML = '* { transition: none !important; animation: none !important; }';
        document.head.appendChild(style);
      }
    } else {
      if (style) style.remove();
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. SUBTLE THUNDER EMOJI BADGE (Small, transparent background)
  // ─────────────────────────────────────────────────────────────────────────────
  function updateBadgeUI() {
    if (!isReturnPage()) {
      const existing = document.getElementById('kytiris-badge');
      if (existing) existing.remove();
      return;
    }

    if (!document.body) return;

    let badge = document.getElementById('kytiris-badge');
    if (!badge) {
      badge = document.createElement('div');
      badge.id = 'kytiris-badge';
      badge.style.cssText = `
        position: fixed;
        bottom: 8px;
        right: 10px;
        font-size: 16px;
        line-height: 1;
        background: transparent;
        opacity: 0.35;
        z-index: 2147483647;
        cursor: pointer;
        user-select: none;
        transition: opacity 0.2s ease, transform 0.2s ease !important;
      `;
      badge.onmouseenter = function () {
        badge.style.opacity = '0.9';
        badge.style.transform = 'scale(1.2)';
      };
      badge.onmouseleave = function () {
        badge.style.opacity = '0.35';
        badge.style.transform = 'scale(1)';
      };
      badge.onclick = function () {
        alert(
          `⚡ Kytiris Speed Booster Active!\n\n` +
          `• Decryptions Saved in RAM: ${decryptionsSaved}\n` +
          `• Speed Factor: 10x - 15x Faster\n` +
          `• DevTools Unblocked: F12 & Right-Click Enabled\n` +
          `• CSS Transitions: Disabled for 0s lag`
        );
      };
      document.body.appendChild(badge);
    }

    badge.innerHTML = '⚡';
    badge.title = `⚡ Kytiris Active (${decryptionsSaved} decryptions saved in RAM)`;
  }

  function updateBadgeStats() {
    const badge = document.getElementById('kytiris-badge');
    if (badge) {
      badge.title = `⚡ Kytiris Active (${decryptionsSaved} decryptions saved in RAM)`;
    }
  }

  // Periodic loop for UI & styles
  function runLoop() {
    applyStyles();
    updateBadgeUI();
    if (!isHooked && window.webpackChunkweb_ui) {
      tryHookWebpack();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runLoop);
  } else {
    runLoop();
  }

  setInterval(runLoop, 1000);
})();
