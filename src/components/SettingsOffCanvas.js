import {css, html, LitElement} from 'lit';
import './OffCanvas.js';
import './form/RadioGroup.js';
import './form/Select.js';
import {UnitPresetList, UnitPresets, Units} from '../config/units.js';
import {uiConfigManager} from "../lib/UiConfigManager.js";
import {i18n} from "../i18n/i18n.js";
import {de} from "../i18n/locales/de.js";
import {en} from "../i18n/locales/en.js";

export class SettingsOffCanvas extends LitElement {
    static properties = {
        settings: {type: Object},
        triggeredBy: {type: String}
    };

    static styles = css`
        :host {
            display: contents;
        }

        .section {
            margin-bottom: 1.5rem;
        }

        .section:not(:first-child) {
            border-top: 1px solid rgb(51, 65, 85);
            padding-top: 1.5rem;
        }

        .section-title {
            font-size: 1.125rem;
            font-weight: 600;
            color: white;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 1rem;
        }

        .section-title svg {
            width: 1.25rem;
            height: 1.25rem;
            color: rgb(34, 211, 238);
        }

        .field-group {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1rem;
        }

        .field-group + .field-group {
            margin-top: 1rem;
        }

        @media (min-width: 640px) {
            .field-group.two-cols {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        .preset-buttons {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-bottom: 1rem;
        }

        .preset-button {
            padding: 0.625rem 1rem;
            border-radius: 0.5rem;
            font-weight: 500;
            border: none;
            cursor: pointer;
            transition: all 0.2s;
            background-color: rgb(51, 65, 85);
            color: white;
        }

        .preset-button:hover {
            background-color: rgb(71, 85, 105);
        }

        .preset-button.active {
            background: linear-gradient(135deg, rgb(59, 130, 246), rgb(34, 211, 238));
            box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.25);
        }

        .footer-buttons {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 0.75rem;
        }

        .button {
            padding: 0.625rem 1.5rem;
            border-radius: 0.5rem;
            font-weight: 500;
            border: none;
            cursor: pointer;
            transition: all 0.2s;
            font-size: 1rem;
        }
    `;

    constructor() {
        super();
        this.triggeredBy = null;
        this.settings = {
            language: uiConfigManager.getLanguage(),
            timezone: uiConfigManager.getTimezone(),
            dateformat: uiConfigManager.getDateFormat(),
            timeformat: uiConfigManager.getTimeFormat(),
        };

        Object.keys(UnitPresets.metric).map((unitType, unitConfig) => {
            this.settings[unitType] = uiConfigManager.getUnit(unitType);
        })

        this._activePreset = uiConfigManager.getPresetName() || 'metric';
    }

    /**
     * Generate options for a unit type from Units config
     */
    _getUnitOptions(unitConfig) {
        return Object.entries(unitConfig).map(([key, config]) => ({
            value: key,
            label: config.label
        }));
    }

    handleSettingChange(e) {
        const {name, value} = e.detail;
        this.settings = {
            ...this.settings,
            [name]: value
        };
        this._activePreset = 'custom';

        this.saveSettings().then(() => this.requestUpdate);
    }

    applyPreset(presetName) {
        this._activePreset = presetName;

        this.settings = {
            ...this.settings,
            ...UnitPresets[presetName]
        };

        this.saveSettings().then(() => this.requestUpdate);
    }

    async saveSettings() {
        const unitCategories = Object.keys(Units);
        const units = {};
        unitCategories.forEach((category) => {
            if (!this.settings[category] || this.settings[category] === null) return;
            units[category] = this.settings[category];
        })

        uiConfigManager.setPreset(this._activePreset)
        uiConfigManager.setUnits(units);
        uiConfigManager.setLanguage(this.settings.language);
        uiConfigManager.setTimezone(this.settings.timezone);
        uiConfigManager.setDateFormat(this.settings.dateformat);
        uiConfigManager.setTimeFormat(this.settings.timeformat);
    }

    render() {
        const presetOptions = UnitPresetList;
        presetOptions.custom = {
            icon: '⚙️',
        };

        return html`
            <wm-offcanvas
                    position="right"
                    width="48rem"
                    @offcanvas-closed="${this.close}"
                    .triggeredBy="${this.triggeredBy}"
            >
                <svg slot="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>

                <span slot="title">${i18n.t('SETTINGS')}</span>

                <div slot="body">
                    <!-- Sprache & Region -->
                    <div class="section">
                        <h3 class="section-title">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                      d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/>
                            </svg>
                            ${i18n.t('REGIONAL_SETTINGS')}
                        </h3>
                        <div class="field-group two-cols">
                            <wm-select
                                    name="language"
                                    label="${i18n.t('LANGUAGE')}"
                                    .value="${this.settings.language}"
                                    .options="${[
                                        {value: 'de', label: de.FLAG + ' ' + i18n.t('LANG_DE')},
                                        {value: 'en', label: en.FLAG + ' ' + i18n.t('LANG_EN')},
                                    ]}"
                                    @change="${this.handleSettingChange}"
                            ></wm-select>

                            <wm-select
                                    name="timezone"
                                    label="${i18n.t('TIMEZONE')}"
                                    .value="${this.settings.timezone}"
                                    .options="${[
                                        {value: 'Europe/Berlin', label: 'Europe/Berlin (CET)'},
                                        {value: 'Europe/London', label: 'Europe/London (GMT)'},
                                        {value: 'America/New_York', label: 'America/New York (EST)'},
                                        {value: 'America/Los_Angeles', label: 'America/Los Angeles (PST)'},
                                        {value: 'Asia/Tokyo', label: 'Asia/Tokyo (JST)'}
                                    ]}"
                                    @change="${this.handleSettingChange}"
                            ></wm-select>
                        </div>

                        <div class="field-group two-cols">
                            <wm-select
                                    name="dateformat"
                                    label="${i18n.t('DATE_FORMAT')}"
                                    .value="${this.settings.dateformat}"
                                    .options="${[
                                        {value: 'DD.MM.YYYY', label: 'DD.MM.YYYY'},
                                        {value: 'MM/DD/YYYY', label: 'MM/DD/YYYY'},
                                        {value: 'YYYY-MM-DD', label: 'YYYY-MM-DD'}
                                    ]}"
                                    @change="${this.handleSettingChange}"
                            ></wm-select>

                            <wm-select
                                    name="timeformat"
                                    label="${i18n.t('TIME_FORMAT')}"
                                    .value="${this.settings.timeformat}"
                                    .options="${[
                                        {value: '24', label: i18n.t('TIME_FORMAT_24_HOUR')},
                                        {value: '12', label: i18n.t('TIME_FORMAT_12_HOUR')},
                                    ]}"
                                    @change="${this.handleSettingChange}"
                            ></wm-select>
                        </div>
                    </div>

                    <!-- Einheiten -->
                    <div class="section">
                        <h3 class="section-title">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                      d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                            </svg>
                            ${i18n.t('UNITS')}
                        </h3>

                        <!-- Preset Buttons -->
                        <div class="preset-buttons">
                            ${Object.entries(presetOptions).map(([presetKey, preset]) => html`
                                <button
                                        class="preset-button ${this._activePreset === presetKey ? 'active' : ''}"
                                        @click="${() => this.applyPreset(presetKey)}"
                                >
                                    ${preset.icon} ${i18n.t('UNIT_PRESET_' + presetKey.toUpperCase())}
                                </button>
                            `)}
                        </div>

                        <!-- Unit Radio Groups -->
                        <div class="field-group">
                            ${Object.entries(Units)
                                    .filter(([unitType, unitConfig]) => this._getUnitOptions(unitConfig).length > 1)
                                    .map(([unitType, unitConfig]) => {
                                        const label = i18n.t('UNIT_TYPE_' + unitType.toUpperCase());
                                        const options = this._getUnitOptions(unitConfig);
                                        const optionsCount = options.length;
                                        let radioLayout = 'vertical'
                                        if (optionsCount <= 2) {
                                            radioLayout = 'horizontal';
                                        } else if (optionsCount <= 4) {
                                            radioLayout = 'grid-4';
                                        }
                                        
                                        return html`
                                            <wm-radio-group
                                                    name="${unitType}"
                                                    label="${label}"
                                                    .value="${this.settings[unitType]}"
                                                    .options="${options}"
                                                    layout="${radioLayout}"
                                                    @change="${this.handleSettingChange}"
                                            ></wm-radio-group>
                                        `
                                    })
                            }
                        </div>
                    </div>
                </div>
            </wm-offcanvas>
        `;
    }
}

customElements.define('wm-settings-offcanvas', SettingsOffCanvas);