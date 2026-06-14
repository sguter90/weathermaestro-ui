/**
 * PullToRefreshManager
 *
 * Central service that attaches a pull-to-refresh gesture to the
 * `.body-wrapper` scroll container.  Views register their reload
 * callback via `setReloadCallback()` on every route change, so the
 * manager always knows which function to call when the user pulls down.
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

        /** @type {HTMLElement|null} The scrollable container (.body-wrapper) */
        this.scrollContainer = null;

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
     * Attaches to `.body-wrapper`, creates the indicator and binds touch events.
     */
    init() {
        // Bug 4 fix: guard against duplicate init() calls
        if (this._initialized) return;
        this._initialized = true;

        this.scrollContainer = document.querySelector('.body-wrapper');

        if (!this.scrollContainer) {
            console.warn('PullToRefreshManager: .body-wrapper not found, skipping init');
            return;
        }

        // Create and prepend the visual indicator
        this.indicator = document.createElement('div');
        this.indicator.className = 'ptr-indicator';
        this.indicator.innerHTML = `
            <div class="ptr-spinner"></div>
            <div class="ptr-arrow">↓</div>
        `;
        this.scrollContainer.prepend(this.indicator);

        // Bind touch events
        this.scrollContainer.addEventListener('touchstart', this._onTouchStart, { passive: true });
        this.scrollContainer.addEventListener('touchmove', this._onTouchMove, { passive: false });
        this.scrollContainer.addEventListener('touchend', this._onTouchEnd, { passive: true });
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
        // Only begin pulling when the container is scrolled to the very top
        // and no refresh is currently in progress.
        if (this.scrollContainer.scrollTop !== 0 || this.isRefreshing) {
            return;
        }

        this._startY = e.touches[0].clientY;
        this._currentDelta = 0;
        this.isPulling = true;
    }

    _onTouchMove(e) {
        if (!this.isPulling) return;

        // Bug 2 fix: call preventDefault() at the top, before any early returns,
        // to prevent the browser from committing a native scroll while pulling.
        if (this.scrollContainer.scrollTop === 0) {
            e.preventDefault();
        }

        const currentY = e.touches[0].clientY;
        const delta = currentY - this._startY;

        // Bug 1 fix: when delta <= 0 (finger moved up), just hide the indicator
        // and return early but do NOT set isPulling = false — the gesture is still
        // active and may resume downward at any moment.
        if (delta <= 0 || this.scrollContainer.scrollTop !== 0) {
            this._currentDelta = 0;
            this.indicator.style.transform = '';
            this.indicator.style.opacity = '0';
            this.indicator.classList.remove('ptr-indicator--ready');
            return;
        }

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
     */
    _resetIndicator() {
        this.indicator.style.transform = '';
        this.indicator.style.opacity = '0';
        this.indicator.classList.remove('ptr-indicator--ready', 'ptr-indicator--loading');
    }
}

export const pullToRefreshManager = new PullToRefreshManager();
