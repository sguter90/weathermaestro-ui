import {html, svg} from 'lit';
import {MetricCard} from '../MetricCard.js';
import {i18n} from "../../i18n/i18n.js";
import {uiConfigManager} from "../../lib/UiConfigManager.js";

/**
 * Thermometer Widget - Displays temperature with animated mercury level
 * Extends MetricCard with thermometer visualization
 */
export class Temperature extends MetricCard {
    static properties = {
        actual: {type: Number},
        feelsLike: {type: Number},
    };

    constructor() {
        super();
        this.actual = 0;
        this.feelsLike = 0;
    }

    getTemperatureRange() {
        const unit = uiConfigManager.getUnit('temperature');
        return unit === 'C'
            ? { min: -30, max: 50 }
            : { min: -58, max: 122 };
    }

    render() {
        const convertedActual = uiConfigManager.convert(this.actual, 'temperature');
        const convertedFeelsLike = uiConfigManager.convert(this.feelsLike, 'temperature');
        const tempUnit = uiConfigManager.getUnitLabel('temperature');
        const { min: minTemp, max: maxTemp } = this.getTemperatureRange();

        return html`
            <div class="metric-card">
                <h4 class="card-header">${i18n.t('TEMPERATURE_HEADER')}</h4>
                <div class="text-center">
                    ${this.renderTemperature(convertedActual, minTemp, maxTemp)}
                    <div class="metric-row">
                        <p class="metric-value" style="color: #ef4444">${this.formatTemp(convertedActual)}</p>
                        <p class="metric-unit">${tempUnit}</p>
                    </div>
                    <p class="text-label">${i18n.t('TEMPERATURE_LABEL')}</p>
                    <p class="text-sub">${this.formatTemp(convertedFeelsLike)} ${tempUnit}</p>
                </div>
            </div>
        `;
    }

    renderTemperature(convertedActual, minTemp, maxTemp) {
        const tempRange = maxTemp - minTemp;
        const mercuryHeight = ((convertedActual - minTemp) / tempRange) * 120;
        const mercuryY = 138 - mercuryHeight;

        return svg`
            <svg width="80" height="140" viewBox="0 0 80 180" class="mb-3">
                <defs>
                    <linearGradient id="tempGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" style="stop-color:#ef4444;stop-opacity:1" />
                        <stop offset="40%" style="stop-color:#f59e0b;stop-opacity:1" />
                        <stop offset="70%" style="stop-color:#3b82f6;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:0.3" />
                    </linearGradient>
                    <lineargradient id="mercuryGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:#fca5a5;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#ef4444;stop-opacity:1" />
                    </lineargradient>
                </defs>
    
                <!-- Thermometer tube -->
                <rect x="30" y="20" width="20" height="120" rx="10" fill="#1e293b" stroke="#475569" stroke-width="2" />
    
                <!-- Temperature scale -->
                ${this.renderTemperatureScale(minTemp, maxTemp)}
    
                <!-- Mercury column -->
                <rect x="32" y="${mercuryY}" width="16" height="${mercuryHeight}" fill="url(#mercuryGradient)">
                    <animate attributeName="y" values="138;${mercuryY}" dur="2s" fill="freeze" />
                    <animate attributeName="height" values="0;${mercuryHeight}" dur="2s" fill="freeze" />
                </rect>
    
                <!-- Bulb -->
                <circle cx="40" cy="150" r="15" fill="#ef4444" stroke="#dc2626" stroke-width="2">
                    <animate attributeName="r" values="13;15;13" dur="3s" repeatCount="indefinite" />
                </circle>
                <circle cx="40" cy="150" r="10" fill="#fca5a5" opacity="0.6" />
            </svg>
        `
    }

    /**
     * Render temperature scale marks and labels
     * @param {number} minTemp - Minimum temperature
     * @param {number} maxTemp - Maximum temperature
     * @returns {TemplateResult}
     */
    renderTemperatureScale(minTemp, maxTemp) {
        const marks = [];
        const tempRange = maxTemp - minTemp;
        const steps = 5;
        const stepSize = tempRange / steps;

        for (let i = 0; i <= steps; i++) {
            const temp = maxTemp - (i * stepSize);
            const y = 30 + (i * 20);
            marks.push(svg`
                <line x1="52" y1="${y}" x2="58" y2="${y}" stroke="#64748b" stroke-width="1" />
                <text x="62" y="${y + 3}" fill="#64748b" font-size="9">
                    ${Math.round(temp)}°
                </text>
            `);
        }

        return marks;
    }

    /**
     * Format temperature value
     * @param {number} value - Temperature value
     * @returns {string} Formatted temperature
     */
    formatTemp(value) {
        return Math.round(value * 10) / 10;
    }
}

customElements.define('temperature-metric', Temperature);