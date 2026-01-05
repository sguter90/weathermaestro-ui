export class OffCanvasManager {
  constructor() {
    this.overlay = document.getElementById('offcanvas-overlay');
    this.panel = document.getElementById('offcanvas-panel');
    this.toggleBtn = document.getElementById('settings-toggle');
    this.closeBtn = document.getElementById('offcanvas-close');
    
    this.init();
  }

  init() {
    this.toggleBtn?.addEventListener('click', () => this.toggle());
    this.closeBtn?.addEventListener('click', () => this.close());
    this.overlay?.addEventListener('click', () => this.close());
  }

  toggle() {
    if (this.panel?.classList.contains('active')) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.panel?.classList.add('active');
    this.overlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.panel?.classList.remove('active');
    this.overlay?.classList.remove('active');
    document.body.style.overflow = '';
  }
}
