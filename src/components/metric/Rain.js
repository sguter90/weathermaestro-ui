import {MetricCard} from '../MetricCard.js';
import {html, svg} from 'lit';
import {i18n} from "../../i18n/i18n.js";
import {uiConfigManager} from "../../lib/UiConfigManager.js";
import {UNIT_RAIN} from "../../config/units.js";

/**
 * Rain Gauge Widget - Displays rainfall data with animated water level
 * Extends MetricCard with rain gauge visualization
 */
export class Rain extends MetricCard {
    static properties = {
        dailyRain: {type: Number},
        hourlyRain: {type: Number}
    };

    constructor() {
        super();
        this.dailyRain = 0;
        this.hourlyRain = 0;
    }

    render() {
        // Convert values for display
        const convertedDailyRain = uiConfigManager.convert(this.dailyRain, UNIT_RAIN);
        const convertedHourlyRain = uiConfigManager.convert(this.hourlyRain, UNIT_RAIN);
        const displayUnit = uiConfigManager.getUnitLabel(UNIT_RAIN);

        // Get max value for gauge (metric: 100mm, imperial: 4in)
        const isMetric = uiConfigManager.getUnit(UNIT_RAIN) === 'MM';
        const maxRain = isMetric ? 100 : 4;

        const waterPercentage = Math.min((convertedDailyRain / maxRain) * 100, 100);
        const waterHeight = 144 - (waterPercentage / 100) * (144 - 155);
        const waterPath = `M 36 ${waterHeight} L 36 155 Q 36 159 40 159 L 80 159 Q 84 159 84 155 L 84 ${waterHeight} Z`;

        return html`
            <div class="metric-card">
                <h4 class="card-header">${i18n.t('RAIN_HEADER')}</h4>
                <div class="text-center">
                    ${this.renderRainGauge(waterPath)}
                    <div class="metric-row">
                        <p class="metric-value" style="color: #3b82f6;">${convertedDailyRain.toFixed(1)}</p>
                        <p class="metric-unit">${displayUnit}</p>
                    </div>
                    <p class="text-label">${i18n.t('RAIN_LABEL')}</p>
                    <p class="text-sub">${convertedHourlyRain.toFixed(2)} ${displayUnit}</p>
                </div>
            </div>
        `;
    }

    renderRainGauge(waterPath) {
        return svg`
            <svg width="120" height="160" viewBox="0 0 120 180" class="mb-3">
                <defs>
                    <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style="stop-color:#e0f2fe;stop-opacity:0.3" />
                        <stop offset="50%" style="stop-color:#bae6fd;stop-opacity:0.2" />
                        <stop offset="100%" style="stop-color:#e0f2fe;stop-opacity:0.3" />
                    </linearGradient>
                    <linearGradient id="waterGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:0.8" />
                        <stop offset="50%" style="stop-color:#60a5fa;stop-opacity:0.9" />
                        <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:0.8" />
                    </linearGradient>
                </defs>

                <!-- Glass outline -->
                <path d="M 40 20 L 35 50 L 35 150 Q 35 160 45 160 L 75 160 Q 85 160 85 150 L 85 50 L 80 20 Z" 
                      fill="url(#glassGradient)" stroke="#60a5fa" stroke-width="2" opacity="0.6" />

                <!-- Measurement lines -->
                <line x1="30" y1="60" x2="38" y2="60" stroke="#64748b" stroke-width="1" />
                <text x="25" y="63" fill="#64748b" font-size="8" text-anchor="end">2.0</text>

                <line x1="30" y1="85" x2="38" y2="85" stroke="#64748b" stroke-width="1" />
                <text x="25" y="88" fill="#64748b" font-size="8" text-anchor="end">1.5</text>

                <line x1="30" y1="110" x2="38" y2="110" stroke="#64748b" stroke-width="1" />
                <text x="25" y="113" fill="#64748b" font-size="8" text-anchor="end">1.0</text>

                <line x1="30" y1="135" x2="38" y2="135" stroke="#64748b" stroke-width="1" />
                <text x="25" y="138" fill="#64748b" font-size="8" text-anchor="end">0.5</text>

                <!-- Water level (animated fill) -->
                <path d="M 36 155 L 36 155 Q 36 159 40 159 L 80 159 Q 84 159 84 155 L 84 155 Z" 
                      fill="url(#waterGradient)" class="rain-fill">
                    <animate attributeName="d" 
                             values="M 36 155 L 36 155 Q 36 159 40 159 L 80 159 Q 84 159 84 155 L 84 155 Z;${waterPath}" 
                             dur="2s" fill="freeze" />
                </path>

                <!-- Water surface wave -->
                <path d="M 36 144 Q 45 142 54 144 T 84 144" fill="none" stroke="#93c5fd" stroke-width="1.5" opacity="0.7">
                    <animate attributeName="d" 
                             values="M 36 144 Q 45 142 54 144 T 84 144;
                                     M 36 144 Q 45 146 54 144 T 84 144;
                                     M 36 144 Q 45 142 54 144 T 84 144" 
                             dur="3s" repeatCount="indefinite" />
                </path>

                <!-- Rain drops -->
                <circle cx="50" cy="5" r="2" fill="#3b82f6" opacity="0">
                    <animate attributeName="cy" values="5;160" dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0;0.8;0" dur="1.5s" repeatCount="indefinite" />
                </circle>

                <circle cx="70" cy="5" r="2" fill="#3b82f6" opacity="0">
                    <animate attributeName="cy" values="5;160" dur="1.5s" begin="0.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0;0.8;0" dur="1.5s" begin="0.5s" repeatCount="indefinite" />
                </circle>

                <circle cx="60" cy="5" r="2" fill="#3b82f6" opacity="0">
                    <animate attributeName="cy" values="5;160" dur="1.5s" begin="1s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0;0.8;0" dur="1.5s" begin="1s" repeatCount="indefinite" />
                </circle>
            </svg>
        `;
    }
}

customElements.define('rain-metric', Rain);