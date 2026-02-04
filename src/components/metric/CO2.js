import {html, svg} from 'lit';
import {MetricCard} from '../MetricCard.js';
import {Weather} from "../../lib/Weather.js";
import {i18n} from "../../i18n/i18n.js";
import {uiConfigManager} from "../../lib/UiConfigManager.js";
import {UNIT_CO2} from "../../config/units.js";

/**
 * CO₂ Level Widget - Displays CO₂ concentration with animated gauge
 */
export class CO2 extends MetricCard {
    static properties = {
        co2Level: {type: Number},
    };

    constructor() {
        super();
        this.co2Level = 0;
    }

    render() {
        const co2Info = this.getCO2Info(this.co2Level);
        const fillHeight = Math.min((this.co2Level / 2000) * 130, 130);
        const fillY = 145 - fillHeight;

        // Convert value for display
        const convertedValue = uiConfigManager.convert(this.co2Level, UNIT_CO2);
        const displayUnit = uiConfigManager.getUnitLabel(UNIT_CO2);

        return html`
            <div class="metric-card">
                <h4 class="card-header">${i18n.t('CO2_HEADER')}</h4>
                <div class="text-center">
                    ${this.renderCO2Gauge(co2Info, fillY, fillHeight)}
                    <div class="metric-row">
                        <p class="metric-value" style="color: ${co2Info.color};">${convertedValue}<p>
                        <p class="metric-unit">${displayUnit}</p>
                    </div>
                    <p class="text-label">${i18n.t('CO2_LABEL')}</p>
                    <p class="text-sub" style="color: ${co2Info.color};">${Weather.getCo2Label(this.co2Level)}</p>
                </div>
            </div>
        `;
    }

    renderCO2Gauge(co2Info, fillY, fillHeight) {
        return svg`
            <svg width="140" height="140" viewBox="0 0 140 160">
                <defs>
                    <linearGradient id="co2Gradient" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" style="stop-color:${co2Info.color};stop-opacity:0.9" />
                        <stop offset="50%" style="stop-color:${co2Info.colorLight};stop-opacity:0.7" />
                        <stop offset="100%" style="stop-color:${co2Info.colorLighter};stop-opacity:0.5" />
                    </linearGradient>
                    <linearGradient id="co2Fill" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:${co2Info.colorLighter};stop-opacity:0.8" />
                        <stop offset="100%" style="stop-color:${co2Info.color};stop-opacity:1" />
                    </linearGradient>
                </defs>

                <!-- Container outline -->
                <rect x="45" y="20" width="50" height="130" rx="5" fill="#1e293b" stroke="#334155" stroke-width="2" />

                <!-- Scale markers and labels -->
                <line x1="40" y1="30" x2="45" y2="30" stroke="#64748b" stroke-width="1" />
                <text x="35" y="33" fill="#64748b" font-size="8" text-anchor="end">2000</text>

                <line x1="40" y1="55" x2="45" y2="55" stroke="#64748b" stroke-width="1" />
                <text x="35" y="58" fill="#64748b" font-size="8" text-anchor="end">1500</text>

                <line x1="40" y1="80" x2="45" y2="80" stroke="#64748b" stroke-width="1" />
                <text x="35" y="83" fill="#64748b" font-size="8" text-anchor="end">1000</text>

                <line x1="40" y1="105" x2="45" y2="105" stroke="#64748b" stroke-width="1" />
                <text x="35" y="108" fill="#64748b" font-size="8" text-anchor="end">500</text>

                <line x1="40" y1="130" x2="45" y2="130" stroke="#64748b" stroke-width="1" />
                <text x="35" y="133" fill="#64748b" font-size="8" text-anchor="end">400</text>

                <line x1="40" y1="145" x2="45" y2="145" stroke="#64748b" stroke-width="1" />
                <text x="35" y="148" fill="#64748b" font-size="8" text-anchor="end">0</text>

                <!-- CO₂ fill level -->
                <rect x="47" y="${fillY}" width="46" height="${fillHeight}" rx="3" fill="url(#co2Fill)">
                    <animate attributeName="y" values="145;${fillY}" dur="2s" fill="freeze" />
                    <animate attributeName="height" values="0;${fillHeight}" dur="2s" fill="freeze" />
                </rect>

                <!-- Floating particles/molecules -->
                <circle cx="60" cy="70" r="2" fill="${co2Info.color}" opacity="0.6">
                    <animate attributeName="cy" values="70;50;70" dur="4s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.6;0.3;0.6" dur="4s" repeatCount="indefinite" />
                </circle>

                <circle cx="75" cy="90" r="2" fill="${co2Info.color}" opacity="0.5">
                    <animate attributeName="cy" values="90;65;90" dur="3.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.5;0.2;0.5" dur="3.5s" repeatCount="indefinite" />
                </circle>

                <circle cx="85" cy="110" r="2" fill="${co2Info.color}" opacity="0.7">
                    <animate attributeName="cy" values="110;80;110" dur="4.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.7;0.3;0.7" dur="4.5s" repeatCount="indefinite" />
                </circle>
            </svg>
        `;
    }

    getCO2Info(co2Level) {
        if (co2Level < 400) {
            return {
                color: '#10b981',
                colorLight: '#34d399',
                colorLighter: '#6ee7b7',
            };
        } else if (co2Level < 600) {
            return {
                color: '#10b981',
                colorLight: '#34d399',
                colorLighter: '#6ee7b7',
            };
        } else if (co2Level < 1000) {
            return {
                color: '#f59e0b',
                colorLight: '#fbbf24',
                colorLighter: '#fcd34d',
            };
        } else if (co2Level < 1500) {
            return {
                color: '#f97316',
                colorLight: '#fb923c',
                colorLighter: '#fdba74',
            };
        } else {
            return {
                color: '#ef4444',
                colorLight: '#f87171',
                colorLighter: '#fca5a5',
            };
        }
    }
}

customElements.define('co2-metric', CO2);