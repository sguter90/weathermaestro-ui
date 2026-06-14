/**
 * PullToRefreshManager
 *
 * Central service that attaches a pull-to-refresh gesture to the persistent
 * `#app` container (static in index.html, never replaced).  The inner
 * `.body-wrapper` scroll container is rendered dynamically into `#app` on
 * every route change, so it is looked up fresh at touch-start time instead
 * of being cached.  Views register their reload callback via
 * `setReloadCallback()` on every route change, so the manager always knows
 * which function to call when the user pulls down.
 */
class PullToRefreshManager {
    constructor() {
        /** Minimum pull distance in px required to trigger a refresh */
        this.threshold = 80;

        /** Maximum translate distance in px for the indicator */
        this.maxPull = 120;

        this.isPulling = false;
        this.isRefreshing = false;

        /** Current pull distance in px (tracked separately from isPulling) */
        this._currentDelta = 0;

        /** Guard to prevent duplicate init() calls */
        this._initialized = false;

        /** @type {Function|null} Current reload callback set by the active view */
        this.reloadCallback = null;

        /** @type {HTMLElement|null} The visual pull-to-refresh indicator element */
        this.indicator = null;

        /** @type {HTMLElement|null} The persistent #app container (touch target) */
        this.appContainer = null;

        /** @type {HTMLElement|null} The scroll container active for the current gesture */
        this._activeScroll = null;

        /** Y-coordinate where the touch started */
        this._startY = 0;

        // Bound event handlers so we can remove them later if needed
        this._onTouchStart = this._onTouchStart.bind(this);
        this._onTouchMove = this._onTouchMove.bind(this);
        this._onTouchEnd = this._onTouchEnd.bind(this);
    }

    /**
     * Initialise the manager.
     * Must be called once after the DOM is ready.
     * Attaches to the persistent `#app` container, creates the indicator and
     * binds touch events.  The inner `.body-wrapper` scroll container is NOT
     * cached here — it is looked up dynamically at touch time (see
     * `_getScrollContainer`) because it is replaced on every view render.
     */
    init() {
        this.appContainer = document.getElementById('app');

        if (!this.appContainer) {
            // Early return — _initialized stays false so init() can be retried
            return;
        }

        // Guard against duplicate init() calls (after a successful #app lookup)
        if (this._initialized) return;

        // Only mark as initialized after successful DOM lookup
        this._initialized = true;

        // Create and append the visual indicator to the persistent #app
        // container so it survives view re-renders of .body-wrapper.
        this.indicator = document.createElement('div');
        this.indicator.className = 'ptr-indicator';
        this.indicator.innerHTML = `
            <div class="ptr-spinner"></div>
            <div class="ptr-arrow">↓</div>
        `;
        this.appContainer.appendChild(this.indicator);

        // Bind touch events to the persistent #app container
        this.appContainer.addEventListener('touchstart', this._onTouchStart, { passive: true });
        this.appContainer.addEventListener('touchmove', this._onTouchMove, { passive: false });
        this.appContainer.addEventListener('touchend', this._onTouchEnd, { passive: true });
    }

    /**
     * Look up the current `.body-wrapper` scroll container fresh.
     * It is rendered dynamically into `#app` on every route change, so it must
     * never be cached.
     * @returns {HTMLElement|null}
     */
    _getScrollContainer() {
        return document.querySelector('.body-wrapper');
    }

    /**
     * Register the reload callback for the currently active view.
     * @param {Function} fn - Async function to call when a refresh is triggered
     */
    setReloadCallback(fn) {
        this.reloadCallback = fn;
    }

    /**
     * Remove the reload callback.
     * Call this for views that should not support pull-to-refresh
     * (e.g. login, logout, widget showcase).
     */
    clearReloadCallback() {
        this.reloadCallback = null;
    }

    // -------------------------------------------------------------------------
    // Touch event handlers
    // -------------------------------------------------------------------------

    _onTouchStart(e) {
        // Look up the scroll container fresh — it is re-rendered on every view
        // change, so it must never be cached.  Only begin pulling when it
        // exists, is scrolled to the very top, and no refresh is in progress.
        const sc = this._getScrollContainer();
        if (!sc || sc.scrollTop !== 0 || this.isRefreshing) {
            return;
        }

        // Store the active scroll container for the duration of this gesture.
        this._activeScroll = sc;
        this._startY = e.touches[0].clientY;
        this._currentDelta = 0;
        this.isPulling = true;
    }

    _onTouchMove(e) {
        if (!this.isPulling || !this._activeScroll) return;

        const currentY = e.touches[0].clientY;
        const delta = currentY - this._startY;

        // Only prevent native scroll when actually pulling down from the top.
        // Calling preventDefault() unconditionally blocks downward scrolling
        // whenever scrollTop === 0, which prevents the user from scrolling at all.
        if (delta > 0 && this._activeScroll.scrollTop === 0) {
            e.preventDefault();
        }

        // Bug 1 fix: when delta <= 0 (finger moved up), just hide the indicator
        // and return early but do NOT set isPulling = false — the gesture is still
        // active and may resume downward at any moment.
        if (delta <= 0 || this._activeScroll.scrollTop !== 0) {
            this._currentDelta = 0;
            this.indicator.style.transform = '';
            this.indicator.style.opacity = '0';
            this.indicator.classList.remove('ptr-indicator--ready');
            return;
        }

        // No transition during live drag — remove snap class so updates are instant
        this.indicator.classList.remove('ptr-indicator--snap');

        // Track current pull distance
        this._currentDelta = delta;

        // Clamp the translate value to maxPull
        const translateY = Math.min(delta, this.maxPull);

        // Make the indicator visible and slide it down
        this.indicator.style.transform = `translateY(${translateY}px)`;
        this.indicator.style.opacity = String(Math.min(translateY / this.threshold, 1));

        // Toggle the "ready" class once the threshold is reached
        if (delta >= this.threshold) {
            this.indicator.classList.add('ptr-indicator--ready');
        } else {
            this.indicator.classList.remove('ptr-indicator--ready');
        }
    }

    _onTouchEnd() {
        if (!this.isPulling) return;

        // Bug 1 fix: only set isPulling = false here in touchend
        this.isPulling = false;
        this._currentDelta = 0;

        if (this.indicator.classList.contains('ptr-indicator--ready')) {
            this._startRefreshing();
        } else {
            this._resetIndicator();
        }

        // Release the active scroll container — looked up fresh on next gesture.
        this._activeScroll = null;
    }

    // -------------------------------------------------------------------------
    // Internal helpers
    // -------------------------------------------------------------------------

    /**
     * Show the spinner, invoke the reload callback and reset the indicator
     * once the callback's promise settles.
     */
    _startRefreshing() {
        if (this.isRefreshing) return;

        this.isRefreshing = true;

        // Switch to loading state: keep indicator visible at threshold position
        this.indicator.classList.remove('ptr-indicator--ready');
        this.indicator.classList.add('ptr-indicator--loading');
        this.indicator.style.transform = `translateY(${this.threshold}px)`;
        this.indicator.style.opacity = '1';

        // Bug 3 fix: wrap reloadCallback() in try/catch to handle synchronous
        // throws; otherwise isRefreshing would stay true forever and lock the manager.
        if (!this.reloadCallback) {
            this._stopRefreshing();
            return;
        }

        let result;
        try {
            result = this.reloadCallback();
        } catch (e) {
            this._stopRefreshing();
            return;
        }
        Promise.resolve(result).finally(() => this._stopRefreshing());
    }

    /**
     * Stop the refreshing state and reset the indicator.
     */
    _stopRefreshing() {
        this.isRefreshing = false;
        this._resetIndicator();
    }

    /**
     * Animate the indicator back to its hidden position and remove all state classes.
     * Adds .ptr-indicator--snap so the CSS transition is active only during snap-back,
     * then removes it once the animation completes so drag updates remain instant.
     */
    _resetIndicator() {
        // Enable transition for the snap-back animation
        this.indicator.classList.add('ptr-indicator--snap');
        this.indicator.style.transform = '';
        this.indicator.style.opacity = '0';
        this.indicator.classList.remove('ptr-indicator--ready', 'ptr-indicator--loading');

        // Remove the snap class after the transition finishes (200ms matches CSS duration)
        setTimeout(() => {
            this.indicator.classList.remove('ptr-indicator--snap');
        }, 200);
    }
}

export const pullToRefreshManager = new PullToRefreshManager();
