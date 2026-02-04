import {css, html, svg} from 'lit';
import {MetricCard} from '../MetricCard.js';
import {i18n} from "../../i18n/i18n.js";
import {Weather} from "../../lib/Weather.js";
import {uiConfigManager} from "../../lib/UiConfigManager.js";
import {UNIT_SOLAR_RADIATION} from "../../config/units.js";

/**
 * Solar Radiation Widget - Displays solar radiation intensity with animated sun
 * Extends MetricCard with solar radiation visualization
 */
export class Solar extends MetricCard {
    static properties = {
        solarRadiation: {type: Number},
        uvIndex: {type: Number}
    };

    static styles = [
        ...MetricCard.styles,
        css`
            .solar-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 1rem;
            }

            .solar-visualization {
                position: relative;
                width: 140px;
                height: 140px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .solar-svg {
                filter: drop-shadow(0 0 8px rgba(0, 0, 0, 0.3));
            }

            .solar-info {
                text-align: center;
                width: 100%;
            }

            .solar-label {
                font-size: 0.75rem;
                color: rgb(148, 163, 184);
                margin-bottom: 0.25rem;
            }

            .uv-info {
                font-size: 0.75rem;
                color: rgb(100, 116, 139);
                margin-top: 0.25rem;
            }

            .uv-index {
                font-weight: 600;
                color: #f97316;
            }

            .intensity-bar {
                width: 100%;
                height: 4px;
                background-color: rgba(148, 163, 184, 0.2);
                border-radius: 2px;
                overflow: hidden;
                margin-top: 1rem;
            }

            .intensity-fill {
                height: 100%;
                background: linear-gradient(90deg, #3b82f6, #fbbf24, #f97316);
                border-radius: 2px;
                transition: width 0.3s ease;
            }

            @keyframes sun-pulse {
                0%, 100% {
                    opacity: 0.8;
                }
                50% {
                    opacity: 1;
                }
            }

            .sun-pulse {
                animation: sun-pulse 3s ease-in-out infinite;
            }

            @keyframes ray-flicker {
                0%, 100% {
                    stroke-width: 2px;
                }
                50% {
                    stroke-width: 4px;
                }
            }

            .ray-flicker {
                animation: ray-flicker 2s ease-in-out infinite;
            }

            @media (max-width: 640px) {
                .solar-visualization {
                    width: 120px;
                    height: 120px;
                }

                .solar-value {
                    font-size: 1.25rem;
                }
            }
        `
    ];

    constructor() {
        super();
        this.solarRadiation = 0;
        this.uvIndex = 0;
        this._uid = Math.random().toString(36).substr(2, 9);
    }

    render() {
        const intensity = Math.min(this.solarRadiation / 1200, 1);
        const intensityPercent = intensity * 100;
        const convertedRadiation = uiConfigManager.convert(this.solarRadiation, UNIT_SOLAR_RADIATION);
        const radiationUnit = uiConfigManager.getUnitLabel(UNIT_SOLAR_RADIATION);

        return html`
            <div class="metric-card">
                <h4 class="card-header">${i18n.t('SOLAR_HEADER')}</h4>
                <div class="text-center">
                    ${this.renderSolarRadiation(intensity)}
                    <div class="metric-row">
                        <p class="metric-value" style="color: #f9a825;">${convertedRadiation.toFixed(0)}</p>
                        <p class="metric-unit">${radiationUnit}</p>
                    </div>
                    <p class="text-label">${i18n.t('SOLAR_LABEL')}</p>

                    <div class="solar-info">
                        <p class="uv-info"><span class="uv-index">${this.uvIndex.toFixed(1)}</span>
                                (${Weather.getUVCategoryLabel(this.uvIndex)})</p>
                        <div class="intensity-bar">
                            <div class="intensity-fill" style="width: ${intensityPercent}%"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Render sun rays
     * @param {string} sunColor - Sun color hex code
     * @param {number} activeRays - Number of active rays
     * @returns {TemplateResult}
     */
    renderSunRays(sunColor, activeRays) {
        const rays = [
            {x1: 70, y1: 15, x2: 70, y2: 30},           // 0°
            {x1: 98.5, y1: 23.5, x2: 90, y2: 35},       // 30°
            {x1: 116.5, y1: 41.5, x2: 105, y2: 50},     // 60°
            {x1: 125, y1: 70, x2: 110, y2: 70},         // 90°
            {x1: 116.5, y1: 98.5, x2: 105, y2: 90},     // 120°
            {x1: 98.5, y1: 116.5, x2: 90, y2: 105},     // 150°
            {x1: 70, y1: 125, x2: 70, y2: 110},         // 180°
            {x1: 41.5, y1: 116.5, x2: 50, y2: 105},     // 210°
            {x1: 23.5, y1: 98.5, x2: 35, y2: 90},       // 240°
            {x1: 15, y1: 70, x2: 30, y2: 70},           // 270°
            {x1: 23.5, y1: 41.5, x2: 35, y2: 50},       // 300°
            {x1: 41.5, y1: 23.5, x2: 50, y2: 35}        // 330°
        ];

        return rays.map((ray, index) => {
            const isActive = index < activeRays;
            const rayColor = isActive ? sunColor : '#64748b';
            const rayOpacity = isActive ? 1 : 0.4;
            return svg`
                    <line x1="${ray.x1}" y1="${ray.y1}" x2="${ray.x2}" y2="${ray.y2}"
                          stroke="${rayColor}"
                          stroke-width="2.5"
                          stroke-linecap="round"
                          opacity="${rayOpacity}"
                          class="${isActive ? 'ray-flicker' : ''}"/>
                `
        });
    }

    /**
     * Get sun color based on radiation intensity
     * @param {number} radiation - Solar radiation value
     * @returns {string} Color hex code
     */
    getSunColor(radiation) {
        if (radiation < 50) return '#1a1a2e';      // Night - very dark
        if (radiation < 100) return '#2d3561';     // Twilight - dark blue
        if (radiation < 200) return '#4a5a8a';     // Dawn - medium blue
        if (radiation < 400) return '#7b9fd4';     // Morning - light blue
        if (radiation < 600) return '#f4d03f';     // Midday - yellow
        if (radiation < 800) return '#f9a825';     // Bright - orange
        if (radiation < 1000) return '#ff8c00';    // Very bright - dark orange
        return '#ff6b00';                           // Intense - red-orange
    }

    renderSolarRadiation(intensity) {
        const sunColor = this.getSunColor(this.solarRadiation);
        const activeRays = Math.ceil(intensity * 12);

        return svg`
            <svg class="solar-svg" width="140" height="140" viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <radialGradient id="sunGradient-${this._uid}" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" style="stop-color:${sunColor};stop-opacity:1"/>
                        <stop offset="100%" style="stop-color:${sunColor};stop-opacity:0.8"/>
                    </radialGradient>
                </defs>

                ${this.renderSunRays(sunColor, activeRays)}

                <!-- Sun circle with glow -->
                <circle cx="70" cy="70" r="25"
                        fill="url(#sunGradient-${this._uid})"
                        opacity="${0.6 + (intensity * 0.4)}"
                        class="sun-pulse"/>

                <!-- Inner glow -->
                <circle cx="70" cy="70" r="18" fill="#fef3c7" opacity="${0.3 + (intensity * 0.2)}"
                        class="animate-glow"/>
            </svg>
        `
    }
}

customElements.define('solar-metric', Solar);