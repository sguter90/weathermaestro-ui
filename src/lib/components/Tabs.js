export class Tabs {
  constructor(containerSelector = '.tabs-container') {
    this.container = document.querySelector(containerSelector);
    this.radios = this.container?.querySelectorAll('input[role="tab"]') || [];
    this.init();
  }

  init() {
    if (this.radios.length === 0) return;
    
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
      radio.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  destroy() {
    this.radios.forEach(radio => {
      radio.removeEventListener('change', this.handleTabChange);
      radio.removeEventListener('keydown', this.handleKeyDown);
    });
  }
}
