import { LitElement, html, css } from 'lit';

export class Select extends LitElement {
    static properties = {
        name: { type: String },
        value: { type: String },
        label: { type: String },
        options: { type: Array },
        placeholder: { type: String },
        disabled: { type: Boolean },
        required: { type: Boolean },
        error: { type: String }
    };

    static styles = css`
        :host {
            display: block;
        }

        .select-container {
            width: 100%;
        }

        .label {
            display: block;
            font-size: 0.875rem;
            font-weight: 500;
            color: rgb(203, 213, 225);
            margin-bottom: 0.5rem;
        }

        .label.required::after {
            content: ' *';
            color: rgb(239, 68, 68);
        }

        .select-wrapper {
            position: relative;
        }

        select {
            width: 100%;
            background-color: rgb(51, 65, 85);
            color: white;
            border-radius: 0.5rem;
            padding: 0.75rem 2.5rem 0.75rem 1rem;
            appearance: none;
            border: 1px solid transparent;
            cursor: pointer;
            font-size: 1rem;
            font-family: inherit;
            transition: all 0.2s;
        }

        select:hover:not(:disabled) {
            background-color: rgb(71, 85, 105);
        }

        select:focus {
            outline: none;
            border-color: rgb(59, 130, 246);
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        select:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        select.error {
            border-color: rgb(239, 68, 68);
        }

        .select-arrow {
            position: absolute;
            right: 0.75rem;
            top: 50%;
            transform: translateY(-50%);
            width: 1.25rem;
            height: 1.25rem;
            color: rgb(148, 163, 184);
            pointer-events: none;
            transition: transform 0.2s;
        }

        select:focus ~ .select-arrow {
            transform: translateY(-50%) rotate(180deg);
        }

        .error-message {
            font-size: 0.75rem;
            color: rgb(239, 68, 68);
            margin-top: 0.5rem;
            display: flex;
            align-items: center;
            gap: 0.25rem;
        }

        .error-icon {
            width: 1rem;
            height: 1rem;
        }
    `;

    constructor() {
        super();
        this.name = '';
        this.value = '';
        this.label = '';
        this.options = [];
        this.placeholder = 'Bitte wählen...';
        this.disabled = false;
        this.required = false;
        this.error = '';
    }

    handleChange(e) {
        const newValue = e.target.value;
        this.value = newValue;
        this.error = ''; // Clear error on change
        
        this.dispatchEvent(new CustomEvent('change', {
            detail: { name: this.name, value: newValue },
            bubbles: true,
            composed: true
        }));
    }

    render() {
        return html`
            <div class="select-container">
                ${this.label ? html`
                    <label class="label ${this.required ? 'required' : ''}" for="${this.name}">
                        ${this.label}
                    </label>
                ` : ''}
                
                <div class="select-wrapper">
                    <select
                        id="${this.name}"
                        name="${this.name}"
                        .value="${this.value}"
                        ?disabled="${this.disabled}"
                        ?required="${this.required}"
                        class="${this.error ? 'error' : ''}"
                        @change="${this.handleChange}"
                        aria-label="${this.label}"
                        aria-invalid="${this.error ? 'true' : 'false'}"
                    >
                        ${this.placeholder ? html`
                            <option value="" disabled ?selected="${!this.value}">
                                ${this.placeholder}
                            </option>
                        ` : ''}
                        
                        ${this.options.map(option => html`
                            <option
                                value="${option.value}"
                                ?selected="${this.value === option.value}"
                                ?disabled="${option.disabled}"
                            >
                                ${option.label}
                            </option>
                        `)}
                    </select>
                    
                    <svg class="select-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                </div>
                
                ${this.error ? html`
                    <div class="error-message" role="alert">
                        <svg class="error-icon" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                        </svg>
                        ${this.error}
                    </div>
                ` : ''}
            </div>
        `;
    }
}

customElements.define('wm-select', Select);