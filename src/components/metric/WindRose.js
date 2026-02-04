import {css, html, svg} from 'lit';
import {MetricCard} from '../MetricCard.js';
import {Weather} from "../../lib/Weather.js";
import {i18n} from "../../i18n/i18n.js";
import {uiConfigManager} from "../../lib/UiConfigManager.js";
import {UNIT_WIND_DIRECTION} from "../../config/units.js";

/**
 * Wind Rose Widget - Displays wind direction with animated compass
 * Extends MetricCard with wind rose visualization and Beaufort scale coloring
 */
export class WindRose extends MetricCard {
    static properties = {
        windDirection: {type: Number},
    };

    static styles = [
        ...MetricCard.styles,
        css`
            .wind-rose-svg {
                width: 140px;
                height: 140px;
                filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
            }

            .wind-needle {
                animation: wind-needle-pulse 2s ease-in-out infinite;
            }

            @keyframes wind-needle-pulse {
                0%, 100% {
                    filter: drop-shadow(0 0 0px rgba(220, 38, 38, 0.5));
                    opacity: 1;
                }
                50% {
                    filter: drop-shadow(0 0 6px rgba(220, 38, 38, 0.9));
                    opacity: 0.95;
                }
            }

            @media (max-width: 640px) {
                .wind-rose-svg {
                    width: 120px;
                    height: 120px;
                }
            }
        `
    ];

    constructor() {
        super();
        this.windDirection = 0;
    }

    render() {

        // Convert value for display
        const convertedValue = uiConfigManager.convert(this.windDirection, UNIT_WIND_DIRECTION);
        const displayUnit = uiConfigManager.getUnitLabel(UNIT_WIND_DIRECTION);

        return html`
            <div class="metric-card">
                <h4 class="card-header">${i18n.t('WIND_ROSE_HEADER')}</h4>
                <div class="text-center">
                    ${this.renderWindRose()}

                    <div class="metric-row">
                        <p class="metric-value">${convertedValue}${displayUnit}</p>
                    </div>

                    <p class="text-label">${i18n.t('WIND_ROSE_LABEL')}</p>
                    <p class="text-sub">${Weather.getWindDirectionLabel(this.windDirection)}</p>
                </div>
            </div>
        `;
    }

    renderWindRose() {
        return svg`
            <svg class="wind-rose-svg" viewBox="-10 -10 160 160" xmlns="http://www.w3.org/2000/svg">
    
                <defs>
                    <linearGradient id="needleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stop-color="#dc2626" stop-opacity="1"/>
                        <stop offset="100%" stop-color="#dc2626" stop-opacity="0.6"/>
                    </linearGradient>
                </defs>
        
                <!-- Compass circles -->
                <circle cx="70" cy="70" r="60" fill="none" stroke="#334155" stroke-width="2"/>
                <circle cx="70" cy="70" r="50" fill="none" stroke="#334155" stroke-width="1"
                        stroke-dasharray="2,2"/>
                <circle cx="70" cy="70" r="40" fill="none" stroke="#334155" stroke-width="1"
                        stroke-dasharray="2,2"/>
                <circle cx="70" cy="70" r="30" fill="none" stroke="#334155" stroke-width="1"
                        stroke-dasharray="2,2"/>
        
                <!-- Cardinal directions -->
                <text x="70" y="2" fill="#ef4444" font-size="14" font-weight="bold" text-anchor="middle">${i18n.t('COMPASS_DIR_N')}</text>
                <text x="140" y="75" fill="#64748b" font-size="12" text-anchor="middle">${i18n.t('COMPASS_DIR_E')}</text>
                <text x="70" y="145" fill="#64748b" font-size="12" text-anchor="middle">${i18n.t('COMPASS_DIR_S')}</text>
                <text x="0" y="75" fill="#64748b" font-size="12" text-anchor="middle">${i18n.t('COMPASS_DIR_W')}</text>
        
                <!-- Direction lines -->
                <line x1="70" y1="10" x2="70" y2="30" stroke="#475569" stroke-width="2"/>
                <line x1="70" y1="110" x2="70" y2="130" stroke="#475569" stroke-width="1"/>
                <line x1="10" y1="70" x2="30" y2="70" stroke="#475569" stroke-width="1"/>
                <line x1="110" y1="70" x2="130" y2="70" stroke="#475569" stroke-width="1"/>
        
                <!-- Wind needle -->
                <g class="wind-needle"
                   transform="translate(70 70) rotate(${this.windDirection}) translate(-70 -70)">
                    <path d="M 70 25 L 75 70 L 70 75 L 65 70 Z"
                          fill="url(#needleGradient)" stroke="#dc2626" stroke-width="1"/>
                    <circle cx="70" cy="70" r="5" fill="#dc2626" stroke="#dc2626" stroke-width="2"/>
                </g>
        
                <!-- Center dot -->
                <circle cx="70" cy="70" r="3" fill="#1e293b"/>
            </svg>
        `;
    }
}

customElements.define('wind-rose-metric', WindRose);