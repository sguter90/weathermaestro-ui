import {css, html, svg} from 'lit';
import {MetricCard} from '../MetricCard.js';
import {i18n} from "../../i18n/i18n.js";
import {Weather} from "../../lib/Weather.js";
import {uiConfigManager} from "../../lib/UiConfigManager.js";
import {UNIT_PRESSURE} from "../../config/units.js";

/**
 * Pressure Widget - Displays atmospheric pressure with animated layers
 * Extends MetricCard with pressure visualization
 */
export class Pressure extends MetricCard {
    static properties = {
        pressure: {type: Number}
    };

    static styles = [
        ...MetricCard.styles,
        css`
            .pressure-svg {
                filter: drop-shadow(0 0 8px rgba(0, 0, 0, 0.3));
            }

            @keyframes pressureSymbolBounce {
                0%, 100% {
                    transform: translateY(0px);
                }
                50% {
                    transform: translateY(-6px);
                }
            }

            .pressure-symbol {
                animation: pressureSymbolBounce 2.5s ease-in-out infinite;
            }

            @keyframes atmosphereWave1 {
                0%, 100% {
                    stroke-width: 1.5px;
                    opacity: 0.6;
                }
                50% {
                    stroke-width: 2.5px;
                    opacity: 0.8;
                }
            }

            @keyframes atmosphereWave2 {
                0%, 100% {
                    stroke-width: 1.5px;
                    opacity: 0.5;
                }
                50% {
                    stroke-width: 2.5px;
                    opacity: 0.7;
                }
            }

            @keyframes atmosphereWave3 {
                0%, 100% {
                    stroke-width: 1.5px;
                    opacity: 0.4;
                }
                50% {
                    stroke-width: 2.5px;
                    opacity: 0.6;
                }
            }

            @keyframes atmosphereWave4 {
                0%, 100% {
                    stroke-width: 1.5px;
                    opacity: 0.3;
                }
                50% {
                    stroke-width: 2.5px;
                    opacity: 0.5;
                }
            }

            @keyframes atmosphereWave5 {
                0%, 100% {
                    stroke-width: 1.5px;
                    opacity: 0.2;
                }
                50% {
                    stroke-width: 2.5px;
                    opacity: 0.4;
                }
            }

            @keyframes atmosphereWave6 {
                0%, 100% {
                    stroke-width: 1.5px;
                    opacity: 0.15;
                }
                50% {
                    stroke-width: 2.5px;
                    opacity: 0.3;
                }
            }

            .atmosphere-line {
                stroke: rgb(148, 163, 184);
                fill: none;
                stroke-linecap: round;
            }

            .atmosphere-line-1 {
                animation: atmosphereWave1 2.5s ease-in-out infinite;
            }

            .atmosphere-line-2 {
                animation: atmosphereWave2 2.5s ease-in-out infinite 0.15s;
            }

            .atmosphere-line-3 {
                animation: atmosphereWave3 2.5s ease-in-out infinite 0.3s;
            }

            .atmosphere-line-4 {
                animation: atmosphereWave4 2.5s ease-in-out infinite 0.45s;
            }

            .atmosphere-line-5 {
                animation: atmosphereWave5 2.5s ease-in-out infinite 0.6s;
            }

            .atmosphere-line-6 {
                animation: atmosphereWave6 2.5s ease-in-out infinite 0.75s;
            }

            @media (max-width: 640px) {
                .pressure-value {
                    font-size: 1.25rem;
                }
            }
        `
    ];

    constructor() {
        super();
        this.pressure = 0;
    }

    render() {
        // Convert value for display
        const convertedValue = uiConfigManager.convert(this.pressure, UNIT_PRESSURE);
        const displayUnit = uiConfigManager.getUnitLabel(UNIT_PRESSURE);

        return html`
            <div class="metric-card">
                <h4 class="card-header">${i18n.t('PRESSURE_HEADER')}</h4>
                <div class="text-center">
                    ${this.renderPressureVisualization()}
                    <div class="metric-row">
                        <p class="metric-value" style="color: #94a3b8;">${convertedValue.toFixed(0)}</p>
                        <p class="metric-unit">${displayUnit}</p>
                    </div>
                    <p class="text-label">${i18n.t('PRESSURE_LABEL')}</p>
                    <p class="text-sub" style="color: #94a3b8;">${Weather.getPressureLabel(this.pressure)}</p>
                </div>
            </div>
        `;
    }

    /**
     * Calculate line spacing based on pressure
     * Higher pressure = lines closer together
     * @returns {number} Spacing in pixels
     */
    getLineSpacing() {
        // Normal pressure: 1013 hPa
        // Range: 950-1050 hPa
        const normalized = (this.pressure - 950) / 100; // 0-1
        const maxSpacing = 16;
        const minSpacing = 2;
        return maxSpacing - (normalized * (maxSpacing - minSpacing));
    }

    renderPressureVisualization() {
        const lineSpacing = this.getLineSpacing();
        const lineCount = 5; // 5 atmosphere lines
        const bottomY = 110; // Alle Linien unten

        return svg`
            <svg class="pressure-svg" width="140" height="140" viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg">
                <!-- Atmosphere layers (all at bottom) -->
                ${Array.from({length: lineCount}).map((_, index) => {
                    const y = bottomY - (index * lineSpacing);
                    const animationClass = `atmosphere-line-${index + 1}`;
                    return svg`
                                <line x1="20" y1="${y}" x2="120" y2="${y}"
                                      class="atmosphere-line ${animationClass}"
                                      stroke-width="1.5px" />
                            `;
                })}

                <!-- Pressure symbol (floating above) -->
                <g class="pressure-symbol">
                    <!-- Horizontal line -->
                    <line x1="55" y1="35" x2="85" y2="35"
                          stroke="rgb(148, 163, 184)"
                          stroke-width="2.5"
                          stroke-linecap="round" />

                    <!-- Left arrow -->
                    <g>
                        <line x1="60" y1="35" x2="60" y2="47"
                              stroke="rgb(148, 163, 184)"
                              stroke-width="2"
                              stroke-linecap="round" />
                        <polyline points="56,43 60,47 64,43"
                                  stroke="rgb(148, 163, 184)"
                                  stroke-width="2"
                                  fill="none"
                                  stroke-linecap="round"
                                  stroke-linejoin="round" />
                    </g>

                    <!-- Right arrow -->
                    <g>
                        <line x1="80" y1="35" x2="80" y2="47"
                              stroke="rgb(148, 163, 184)"
                              stroke-width="2"
                              stroke-linecap="round" />
                        <polyline points="76,43 80,47 84,43"
                                  stroke="rgb(148, 163, 184)"
                                  stroke-width="2"
                                  fill="none"
                                  stroke-linecap="round"
                                  stroke-linejoin="round" />
                    </g>
                </g>
            </svg>
        `;
    }
}

customElements.define('pressure-metric', Pressure);