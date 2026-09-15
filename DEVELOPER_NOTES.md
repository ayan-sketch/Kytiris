# Chrome Web Store Developer Review Notes for Kytiris

## Overview
Kytiris is a client-side performance acceleration utility designed specifically for taxpayers and tax professionals filing returns on `https://iris.fbr.gov.pk`.

---

## Technical Architecture & Justification

### 1. Main World Execution Context (`"world": "MAIN"`)
- **Purpose:** The IRIS web application uses Webpack chunk loading (`window.webpackChunkweb_ui`) and client-side CryptoJS AES decryption (module `13788`) to process UI labels and form data during typing and tab switching.
- **Implementation:** The extension script runs in the main page scope (`"world": "MAIN"` in `manifest.json` with an inline DOM script injection fallback) to hook into `webpackChunkweb_ui.push` and memoize identical decryption calls in local browser RAM.
- **Privacy & Safety:** This memoization is 100% read-only and local to browser RAM. No payloads are modified, and zero data is stored on disk or transmitted across network interfaces.

### 2. Event Listener Override (DevTools & Inspection Tools)
- **Justification:** Custom page event listeners on `iris.fbr.gov.pk` trap standard keyboard shortcuts (`F12`, `Ctrl+Shift+I/J/C`) and right-click context menus.
- **Implementation:** The extension overrides custom window event listeners (`keydown` / `contextmenu`) to restore standard browser accessibility and developer inspection tools for debugging.
- **Manifest Description Note:** *"Overrides custom window event listeners blocking standard browser accessibility/inspection tools."*

---

## Permissions Breakdown
- `storage`: Used to remember user feature toggles (e.g. enabling/disabling animation overrides).
- `activeTab`: Used by the popup interface to communicate toggle updates to the active IRIS tab.
- `host_permissions` (`https://iris.fbr.gov.pk/*`): Strictly limited to the target FBR IRIS domain.
