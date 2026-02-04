import {css, html, LitElement} from 'lit';

export class RadioGroup extends LitElement {
    static properties = {
        name: {type: String},
        value: {type: String},
        label: {type: String},
        options: {type: Array},
        layout: {type: String}, // 'horizontal', 'vertical', 'grid', 'grid-4'
        disabled: {type: Boolean},
        required: {type: Boolean}
    };

    static styles = css`
        :host {
            display: block;
        }

        .radio-group-container {
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

        .radio-group {
            display: flex;
            gap: 0.75rem;
        }

        .radio-group.vertical {
            flex-direction: column;
        }

        .radio-group.horizontal {
            flex-direction: row;
            flex-wrap: wrap;
        }

        .radio-group.grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 0.5rem;
        }

        .radio-group.grid-4 {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 0.5rem;
        }

        @media (min-width: 640px) {
            .radio-group.grid-4 {
                grid-template-columns: repeat(4, 1fr);
            }
        }

        .radio-option {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            padding: 0.625rem 1rem;
            background-color: rgb(51, 65, 85);
            border: 2px solid transparent;
            border-radius: 0.5rem;
            cursor: pointer;
            transition: all 0.2s;
            flex: 1;
            min-width: 0;
            position: relative;
        }

        .radio-option:hover:not(.disabled) {
            background-color: rgb(71, 85, 105);
            border-color: rgb(100, 116, 139);
        }

        .radio-option.checked {
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(34, 211, 238, 0.2));
            border-color: rgb(59, 130, 246);
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .radio-option.disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        /* Radio-Button verstecken */

        .radio-option input[type="radio"] {
            position: absolute;
            opacity: 0;
            width: 0;
            height: 0;
            pointer-events: none;
        }

        /* Fokus-Stil für Tastaturnavigation */

        .radio-option input[type="radio"]:focus-visible + .radio-option-label {
            outline: 2px solid rgb(59, 130, 246);
            outline-offset: 2px;
            border-radius: 0.25rem;
        }

        .radio-option-label {
            color: white;
            font-weight: 500;
            font-size: 1rem;
            user-select: none;
            flex: 1;
            text-align: center;
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .radio-option.checked .radio-option-label {
            color: rgb(96, 165, 250);
        }

        .radio-option.compact .radio-option-label {
            font-size: 0.875rem;
        }

        .error-message {
            font-size: 0.75rem;
            color: rgb(239, 68, 68);
            margin-top: 0.5rem;
        }
    `;

    constructor() {
        super();
        this.name = '';
        this.value = '';
        this.label = '';
        this.options = [];
        this.layout = 'horizontal';
        this.disabled = false;
        this.required = false;
    }

    handleChange(e) {
        const newValue = e.target.value;
        this.value = newValue;

        this.dispatchEvent(new CustomEvent('change', {
            detail: {name: this.name, value: newValue},
            bubbles: true,
            composed: true
        }));
    }

    render() {
        return html`
            <div class="radio-group-container">
                ${this.label ? html`
                    <label class="label ${this.required ? 'required' : ''}">
                        ${this.label}
                    </label>
                ` : ''}

                <div class="radio-group ${this.layout}" role="radiogroup" aria-label="${this.label}">
                    ${this.options.map(option => {
                        const isChecked = this.value === option.value;
                        const isDisabled = this.disabled || option.disabled;

                        return html`
                            <label class="radio-option ${isChecked ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}">
                                <input
                                        type="radio"
                                        name="${this.name}"
                                        value="${option.value}"
                                        .checked="${isChecked}"
                                        ?disabled="${isDisabled}"
                                        @change="${this.handleChange}"
                                        aria-label="${option.label}"
                                />
                                <span class="radio-option-label">${option.label}</span>
                            </label>
                        `;
                    })}
                </div>
            </div>
        `;
    }
}

customElements.define('wm-radio-group', RadioGroup);