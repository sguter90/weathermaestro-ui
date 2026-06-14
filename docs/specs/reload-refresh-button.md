# Technical Specification: Dashboard Reload/Refresh Button

## Summary

This spec defines adding a reload/refresh button to the top-right corner of both the dashboard detail view and the dashboard list view. The button will appear alongside existing action buttons (Add Section / New Dashboard) for authenticated users only. On click, it shows an inline loading spinner, re-fetches data from the API, re-renders the view, and restores the button. The implementation follows existing project patterns: `btn-secondary` styling, inline SVG icon, `page-header`/`page-actions` layout, `authManager.isAuthenticated()` gating, and the i18n translation system.

---

## Affected Files

| File | Description of Changes |
|---|---|
| `src/i18n/locales/en.js` | Add i18n keys: `RELOAD_DASHBOARD` and `RELOAD_DASHBOARDS` with English translations. |
| `src/i18n/locales/de.js` | Add i18n keys: `RELOAD_DASHBOARD` and `RELOAD_DASHBOARDS` with German translations. |
| `src/views/DashboardDetailView.js` | Add a reload/refresh button in the `page-actions` div (when authenticated), alongside the existing "Add Section" button. Wire up click handler to re-fetch dashboard data and re-render. |
| `src/views/DashboardListView.js` | Add a reload/refresh button in the `page-actions` div (when authenticated), alongside the existing "New Dashboard" button. Wire up click handler to re-fetch dashboards list and re-render. |
| `src/styles/_button.css` | Add a `.btn-secondary.loading` modifier class (or `.btn-secondary[disabled]` state) with a CSS spinner animation for the button's loading state. |

---

## Implementation Steps

### Step 1: Add i18n translation keys

**File: `src/i18n/locales/en.js`**

Add the following keys to the exported `en` object:

```js
RELOAD_DASHBOARD: 'Reload dashboard',
RELOAD_DASHBOARDS: 'Reload dashboards',
```

**File: `src/i18n/locales/de.js`**

Add the following keys to the exported `de` object:

```js
RELOAD_DASHBOARD: 'Dashboard neu laden',
RELOAD_DASHBOARDS: 'Dashboards neu laden',
```

### Step 2: Add CSS spinner class for the loading state

**File: `src/styles/_button.css`**

Add a CSS spinner keyframe and a `.btn-secondary.loading` modifier. The spinner should rotate in place, replacing the button's icon while keeping the button visually intact:

```css
/* Spinner animation for loading state */
@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.btn-secondary.loading .btn-icon {
    animation: spin 1s linear infinite;
}

.btn-secondary.loading {
    opacity: 0.7;
    cursor: wait;
}
```

**Design rationale**: Instead of hiding the icon and showing a separate spinner element, we animate the existing SVG icon in place. This keeps the button's dimensions stable and avoids layout shift. The `opacity: 0.7` and `cursor: wait` provide visual feedback that the button is active.

### Step 3: Add reload button to DashboardDetailView.js

**File: `src/views/DashboardDetailView.js`**

In the `renderDashboardDetailView()` function, locate the `page-actions` div construction (inside the `if (isAuthenticated)` block). Add the reload button **before** the existing "Add Section" button so it appears to the left.

The button should be created using the existing `document.createElement` pattern:

```js
// Create reload button
const reloadBtn = document.createElement('button');
reloadBtn.className = 'btn-secondary';
reloadBtn.id = 'reload-dashboard-btn';
reloadBtn.title = i18n.t('RELOAD_DASHBOARD', '', 'Reload dashboard');
reloadBtn.innerHTML = `
    <svg class="icon-medium btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
    </svg>
    <span>${i18n.t('RELOAD_DASHBOARD', '', 'Reload dashboard')}</span>
`;
reloadBtn.addEventListener('click', handleReloadDashboard);
actions.appendChild(reloadBtn);
```

Add the `handleReloadDashboard` function (see Step 5 for the shared implementation):

```js
/**
 * Reload the current dashboard by re-fetching from the API and re-rendering.
 */
async function handleReloadDashboard() {
    const reloadBtn = document.getElementById('reload-dashboard-btn');
    if (!reloadBtn) return;

    // Show loading state
    reloadBtn.classList.add('loading');
    reloadBtn.disabled = true;

    try {
        // Re-fetch dashboard data
        const dashboard = await apiClient.getDashboard(currentDashboardId);
        // Re-render the view with fresh data
        renderDashboardDetailView(dashboard);
    } catch (error) {
        console.error('Failed to reload dashboard:', error);
        // Optionally show an error toast/notification here
    } finally {
        // Restore button state
        reloadBtn.classList.remove('loading');
        reloadBtn.disabled = false;
    }
}
```

**Placement note**: The reload button must be inserted into the `actions` div (the `page-actions` element) before the "Add Section" button. This ensures correct left-to-right visual order.

### Step 4: Add reload button to DashboardListView.js

**File: `src/views/DashboardListView.js`**

In the `renderDashboardListView()` function, locate the `page-actions` div construction (inside the `if (isAuthenticated)` block). Add the reload button **before** the existing "New Dashboard" button.

Because `DashboardListView.js` uses `container.innerHTML` for the header (unlike `DashboardDetailView.js` which uses `document.createElement`), we need to:

1. Create the button with `document.createElement` (same pattern as Step 3).
2. Attach the click handler.
3. Insert the button into the page-actions div **after** the `innerHTML` render but **before** the "New Dashboard" button.

```js
// Create reload button
const reloadBtn = document.createElement('button');
reloadBtn.className = 'btn-secondary';
reloadBtn.id = 'reload-dashboards-btn';
reloadBtn.title = i18n.t('RELOAD_DASHBOARDS', '', 'Reload dashboards');
reloadBtn.innerHTML = `
    <svg class="icon-medium btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
    </svg>
    <span>${i18n.t('RELOAD_DASHBOARDS', '', 'Reload dashboards')}</span>
`;
reloadBtn.addEventListener('click', handleReloadDashboards);
// Insert before the "New Dashboard" button
const createBtn = document.getElementById('create-dashboard-btn');
pageActions.insertBefore(reloadBtn, createBtn);
```

Add the `handleReloadDashboards` function (see Step 5 for the shared implementation):

```js
/**
 * Reload the dashboard list by re-fetching from the API and re-rendering.
 */
async function handleReloadDashboards() {
    const reloadBtn = document.getElementById('reload-dashboards-btn');
    if (!reloadBtn) return;

    // Show loading state
    reloadBtn.classList.add('loading');
    reloadBtn.disabled = true;

    try {
        // Re-fetch dashboards list
        const dashboards = await apiClient.getDashboards();
        // Re-render the view with fresh data
        renderDashboardListView(dashboards);
    } catch (error) {
        console.error('Failed to reload dashboards:', error);
        // Optionally show an error toast/notification here
    } finally {
        // Restore button state
        reloadBtn.classList.remove('loading');
        reloadBtn.disabled = false;
    }
}
```

### Step 5: Shared reload logic (optional refactoring)

If the project structure supports it, consider extracting the common reload pattern into a utility function in `src/lib/UiUtils.js` (or a new `src/lib/ReloadHelper.js`) to avoid code duplication:

```js
/**
 * Execute a reload operation with loading state feedback on the given button.
 * @param {string} buttonId - The DOM id of the reload button.
 * @param {Function} fetchFn - Async function that fetches fresh data.
 * @param {Function} renderFn - Function to call with the fresh data.
 */
export async function executeWithLoading(buttonId, fetchFn, renderFn) {
    const btn = document.getElementById(buttonId);
    if (!btn) return;

    btn.classList.add('loading');
    btn.disabled = true;

    try {
        const data = await fetchFn();
        renderFn(data);
    } catch (error) {
        console.error('Reload failed:', error);
    } finally {
        btn.classList.remove('loading');
        btn.disabled = false;
    }
}
```

---

## Reload Icon SVG

The icon uses the standard reload/refresh glyph (`M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15`), consistent with the `fill="none"`, `stroke="currentColor"`, `viewBox="0 0 24 24"`, `stroke-width="2"` pattern used throughout the project.

---

## Acceptance Criteria

| # | Criterion | How to Verify |
|---|-----------|---------------|
| 1 | Reload button appears in the dashboard detail view header, to the left of "Add Section" | Open a dashboard detail page as an authenticated user. Verify the reload button (with refresh icon + "Reload dashboard" label) is visible in the page-actions area, positioned before the "Add Section" button. |
| 2 | Reload button appears in the dashboard list view header, to the left of "New Dashboard" | Open the dashboards list page as an authenticated user. Verify the reload button (with refresh icon + "Reload dashboards" label) is visible in the page-actions area, positioned before the "New Dashboard" button. |
| 3 | Reload button is hidden for unauthenticated users | Open either page while logged out (or with no valid token). Verify neither reload button is rendered. |
| 4 | Clicking the button shows a loading spinner | Click the reload button. Verify the SVG icon rotates (CSS animation) and the button becomes semi-transparent with a `wait` cursor. |
| 5 | Clicking the button re-fetches data | Click the reload button. Verify the corresponding API call (`GET /api/v1/dashboards/:id` for detail view, `GET /api/v1/dashboards` for list view) is made. Verify the view updates with fresh data. |
| 6 | Button state is restored after reload completes | After the reload finishes (success or error), verify the spinner stops, opacity returns to normal, cursor returns to default, and the button is re-enabled. |
| 7 | i18n keys exist for both locales | Verify `en.js` contains `RELOAD_DASHBOARD` and `RELOAD_DASHBOARDS` keys with English values. Verify `de.js` contains the same keys with German translations. |
| 8 | Button uses `btn-secondary` styling | Verify the button has the `btn-secondary` class and matches the existing secondary button appearance (semi-transparent dark slate background, gray text, border). |
| 9 | No layout shift when button appears/disappears | Verify the page-actions area maintains consistent width/positioning. The animated spinner should not cause the button to change size. |
| 10 | Error handling is present | Simulate a failed API call (e.g., disconnect network). Verify the button state still restores (spinner stops, button re-enabled) and no unhandled exception is thrown. |
