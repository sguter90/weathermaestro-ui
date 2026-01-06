export class Tabs {
    constructor(containerSelector = '.tabs-container') {
        this.container = document.querySelector(containerSelector);
        this.radios = this.container?.querySelectorAll('input[role="tab"]') || [];
        this.init();
    }

    init() {
        if (this.radios.length === 0) return;

        this.activateTabFromUrl();
        this.attachChangeListeners();
        this.attachKeyboardNavigation();
    }

    attachChangeListeners() {
        this.radios.forEach(radio => {
            radio.addEventListener('change', (e) => this.handleTabChange(e));
        });
    }

    handleTabChange(event) {
        // Update aria-selected
        this.radios.forEach(r => r.setAttribute('aria-selected', 'false'));
        event.target.setAttribute('aria-selected', 'true');

        // Hide/show panels
        document.querySelectorAll('[role="tabpanel"]').forEach(panel => {
            panel.hidden = true;
        });

        const activePanel = document.getElementById(event.target.getAttribute('aria-controls'));
        if (activePanel) activePanel.hidden = false;

        const tabName = event.target.id.replace('tab-', '');
        const currentHash = window.location.hash.split('?')[0];
        window.location.hash = `${currentHash}?tab=${tabName}`;
    }

    activateTabFromUrl() {
        // Hole Tab-Parameter aus URL
        const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
        const tabName = params.get('tab');

        if (tabName) {
            const tabId = `tab-${tabName}`;
            const tab = this.container?.querySelector(`#${tabId}`);

            if (tab) {
                tab.checked = true;
                tab.dispatchEvent(new Event('change', {bubbles: true}));
                return;
            }
        }

        // Fallback: activate first tab
        if (this.radios.length > 0) {
            this.radios[0].checked = true;
            this.radios[0].dispatchEvent(new Event('change', {bubbles: true}));
        }
    }

    attachKeyboardNavigation() {
        this.radios.forEach((radio, index) => {
            radio.addEventListener('keydown', (e) => this.handleKeyDown(e, index));
        });
    }

    handleKeyDown(event, currentIndex) {
        let nextIndex = currentIndex;

        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
            nextIndex = (currentIndex + 1) % this.radios.length;
            event.preventDefault();
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
            nextIndex = (currentIndex - 1 + this.radios.length) % this.radios.length;
            event.preventDefault();
        } else {
            return;
        }

        this.selectTab(nextIndex);
    }

    selectTab(index) {
        const radio = this.radios[index];
        if (radio) {
            radio.focus();
            radio.checked = true;
            radio.dispatchEvent(new Event('change', {bubbles: true}));
        }
    }

    destroy() {
        this.radios.forEach(radio => {
            radio.removeEventListener('change', this.handleTabChange);
            radio.removeEventListener('keydown', this.handleKeyDown);
        });
    }
}
