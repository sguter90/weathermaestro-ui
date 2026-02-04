import { LitElement, html, css } from 'lit';

export class OffCanvas extends LitElement {
    static properties = {
        isOpen: { type: Boolean, reflect: true },
        position: { type: String }, // 'left', 'right', 'top', 'bottom'
        title: { type: String },
        width: { type: String },
        showCloseButton: { type: Boolean },
        triggeredBy: { type: String } // CSS selector for trigger element
    };

    static styles = css`
        :host {
            display: none;
            position: fixed;
            inset: 0;
            z-index: 50;
        }

        :host([isOpen]) {
            display: block;
        }

        .backdrop {
            position: fixed;
            inset: 0;
            background-color: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(4px);
            animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .offcanvas-container {
            position: fixed;
            background-color: rgb(30, 41, 59);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            display: flex;
            flex-direction: column;
            max-height: 100vh;
            overflow: hidden;
        }

        /* Position variants */
        :host([position="right"]) .offcanvas-container {
            top: 0;
            right: 0;
            bottom: 0;
            width: var(--offcanvas-width, 32rem);
            max-width: 90vw;
            animation: slideInRight 0.3s ease-out;
        }

        :host([position="left"]) .offcanvas-container {
            top: 0;
            left: 0;
            bottom: 0;
            width: var(--offcanvas-width, 32rem);
            max-width: 90vw;
            animation: slideInLeft 0.3s ease-out;
        }

        :host([position="top"]) .offcanvas-container {
            top: 0;
            left: 0;
            right: 0;
            height: var(--offcanvas-height, 50vh);
            animation: slideInTop 0.3s ease-out;
        }

        :host([position="bottom"]) .offcanvas-container {
            bottom: 0;
            left: 0;
            right: 0;
            height: var(--offcanvas-height, 50vh);
            animation: slideInBottom 0.3s ease-out;
        }

        @keyframes slideInRight {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
        }

        @keyframes slideInLeft {
            from { transform: translateX(-100%); }
            to { transform: translateX(0); }
        }

        @keyframes slideInTop {
            from { transform: translateY(-100%); }
            to { transform: translateY(0); }
        }

        @keyframes slideInBottom {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
        }

        .offcanvas-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1.5rem;
            border-bottom: 1px solid rgb(51, 65, 85);
            flex-shrink: 0;
        }

        .header-content {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }

        .header-icon {
            width: 2.5rem;
            height: 2.5rem;
            border-radius: 0.75rem;
            background: linear-gradient(135deg, rgb(59, 130, 246), rgb(34, 211, 238));
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .header-icon ::slotted(svg) {
            width: 1.5rem;
            height: 1.5rem;
            color: white;
        }

        .title {
            font-size: 1.5rem;
            font-weight: 700;
            color: white;
            margin: 0;
        }

        .close-button {
            width: 2.5rem;
            height: 2.5rem;
            border-radius: 0.5rem;
            background-color: rgb(51, 65, 85);
            display: flex;
            align-items: center;
            justify-content: center;
            color: rgb(148, 163, 184);
            border: none;
            cursor: pointer;
            transition: all 0.2s;
        }

        .close-button:hover {
            background-color: rgb(71, 85, 105);
            color: white;
        }

        .close-button svg {
            width: 1.25rem;
            height: 1.25rem;
        }

        .offcanvas-body {
            flex: 1;
            overflow-y: auto;
            padding: 1.5rem;
        }

        .offcanvas-body::-webkit-scrollbar {
            width: 8px;
        }

        .offcanvas-body::-webkit-scrollbar-track {
            background: rgb(30, 41, 59);
        }

        .offcanvas-body::-webkit-scrollbar-thumb {
            background: rgb(71, 85, 105);
            border-radius: 4px;
        }

        .offcanvas-footer {
            padding: 1.5rem;
            border-top: 1px solid rgb(51, 65, 85);
            background-color: rgba(30, 41, 59, 0.5);
            flex-shrink: 0;
        }
    `;

    constructor() {
        super();
        this.isOpen = false;
        this.position = 'right';
        this.title = '';
        this.width = '32rem';
        this.showCloseButton = true;
        this.triggeredBy = null;
        this._triggerElement = null;
        this._boundHandleTriggerClick = this._handleTriggerClick.bind(this);
    }

    connectedCallback() {
        super.connectedCallback();
        this._setupTrigger();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this._cleanupTrigger();
    }

    updated(changedProperties) {
        if (changedProperties.has('width')) {
            this.style.setProperty('--offcanvas-width', this.width);
        }

        if (changedProperties.has('triggeredBy')) {
            this._cleanupTrigger();
            this._setupTrigger();
        }
    }

    _setupTrigger() {
        if (!this.triggeredBy) return;

        // Wait for DOM to be ready
        setTimeout(() => {
            // Look in document (not shadow DOM)
            this._triggerElement = document.querySelector(this.triggeredBy);

            if (this._triggerElement) {
                this._triggerElement.addEventListener('click', this._boundHandleTriggerClick);
            } else {
                console.warn(`OffCanvas: Trigger element "${this.triggeredBy}" not found`);
            }
        }, 10);
    }

    _cleanupTrigger() {
        if (this._triggerElement) {
            this._triggerElement.removeEventListener('click', this._boundHandleTriggerClick);
            this._triggerElement = null;
        }
    }

    _handleTriggerClick(e) {
        e.preventDefault();
        this.open();
    }

    open() {
        this.isOpen = true;
        document.body.style.overflow = 'hidden';
        this.dispatchEvent(new CustomEvent('offcanvas-opened', { bubbles: true, composed: true }));
    }

    close() {
        this.isOpen = false;
        document.body.style.overflow = '';
        this.dispatchEvent(new CustomEvent('offcanvas-closed', { bubbles: true, composed: true }));
    }

    handleBackdropClick(e) {
        if (e.target === e.currentTarget) {
            this.close();
        }
    }

    render() {
        return html`
            <div class="backdrop" @click=${this.handleBackdropClick}>
                <div class="offcanvas-container" @click=${(e) => e.stopPropagation()}>
                    <div class="offcanvas-header">
                        <div class="header-content">
                            <div class="header-icon">
                                <slot name="icon"></slot>
                            </div>
                            ${this.title ? html`<h2 class="title">${this.title}</h2>` : html`<slot name="title"></slot>`}
                        </div>
                        ${this.showCloseButton ? html`
                            <button class="close-button" @click=${this.close} aria-label="Close">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                        ` : ''}
                    </div>
                    <div class="offcanvas-body">
                        <slot name="body"></slot>
                    </div>
                    <div class="offcanvas-footer">
                        <slot name="footer"></slot>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('wm-offcanvas', OffCanvas);