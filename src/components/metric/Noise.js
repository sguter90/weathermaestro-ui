import {html, svg} from 'lit';
import {MetricCard} from '../MetricCard.js';
import {Weather} from "../../lib/Weather.js";
import {i18n} from "../../i18n/i18n.js";
import {uiConfigManager} from "../../lib/UiConfigManager.js";
import {UNIT_NOISE} from "../../config/units.js";

/**
 * Noise Level Widget - Displays noise level with animated sound waves and volume bars
 */
export class Noise extends MetricCard {
    static properties = {
        noiseLevel: {type: Number}
    };

    constructor() {
        super();
        this.noiseLevel = 0;
    }

    render() {
        const noiseInfo = this.getNoiseInfo(this.noiseLevel);
        const activeBars = Math.ceil((this.noiseLevel / 120) * 10);

        // Convert value for display
        const convertedValue = uiConfigManager.convert(this.noiseLevel, UNIT_NOISE);
        const displayUnit = uiConfigManager.getUnitLabel(UNIT_NOISE);

        return html`
            <div class="metric-card">
                <h4 class="card-header">${i18n.t('NOISE_HEADER')}</h4>
                <div class="text-center">
                    ${this.renderNoiseGauge(noiseInfo, activeBars)}
                    <div class="metric-row">
                        <p class="metric-value" style="color: ${noiseInfo.color};">${convertedValue}</p>
                        <p class="metric-unit">${displayUnit}</p>
                    </div>
                    <p class="text-label">${i18n.t('NOISE_LABEL')}</p>
                    <p class="text-sub" style="color: ${noiseInfo.color};">${Weather.getNoiseLabel(this.noiseLevel)}</p>
                </div>
            </div>
        `;
    }

    renderNoiseGauge(noiseInfo, activeBars) {
        const bars = [];
        const barPositions = [
            {x: 20, height: 20},
            {x: 33, height: 30},
            {x: 46, height: 40},
            {x: 59, height: 50},
            {x: 72, height: 60},
            {x: 85, height: 70},
            {x: 98, height: 80},
            {x: 111, height: 90}
        ];

        for (let i = 0; i < barPositions.length; i++) {
            const pos = barPositions[i];
            const isActive = i < activeBars;
            bars.push(svg`
                <rect x="${pos.x}" y="${140 - pos.height}" width="8" height="${pos.height}" rx="2" 
                      fill="${isActive ? noiseInfo.color : '#334155'}" opacity="${isActive ? '0.8' : '0.3'}" />
            `);
        }

        return svg`
            <svg width="140" height="140" viewBox="0 0 140 140" class="mb-3">
                <defs>
                    <linearGradient id="noiseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style="stop-color:${noiseInfo.color};stop-opacity:0.3" />
                        <stop offset="50%" style="stop-color:${noiseInfo.color};stop-opacity:0.6" />
                        <stop offset="100%" style="stop-color:${noiseInfo.color};stop-opacity:0.3" />
                    </linearGradient>
                </defs>

                <!-- Volume bars -->
                ${bars}

                <!-- Sound waves emanating from speaker -->
                <circle cx="70" cy="45" r="20" fill="none" stroke="${noiseInfo.color}" stroke-width="2" opacity="0">
                    <animate attributeName="r" values="15;35" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.6;0" dur="2s" repeatCount="indefinite" />
                </circle>

                <circle cx="70" cy="45" r="20" fill="none" stroke="${noiseInfo.color}" stroke-width="2" opacity="0">
                    <animate attributeName="r" values="15;35" dur="2s" begin="0.7s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.6;0" dur="2s" begin="0.7s" repeatCount="indefinite" />
                </circle>

                <circle cx="70" cy="45" r="20" fill="none" stroke="${noiseInfo.color}" stroke-width="2" opacity="0">
                    <animate attributeName="r" values="15;35" dur="2s" begin="1.4s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.6;0" dur="2s" begin="1.4s" repeatCount="indefinite" />
                </circle>

                <!-- Speaker icon -->
                <path d="M 60 35 L 60 55 L 50 55 L 40 45 L 40 35 L 50 35 Z" fill="${noiseInfo.color}" opacity="0.8" />

                <circle cx="70" cy="45" r="8" fill="${noiseInfo.colorLight}" opacity="0.6">
                    <animate attributeName="r" values="8;10;8" dur="1.5s" repeatCount="indefinite" />
                </circle>
            </svg>
        `;
    }

    getNoiseInfo(noiseLevel) {
        if (noiseLevel < 30) {
            return {
                color: '#10b981',
                colorLight: '#34d399',
                category: 'Very Quiet',
                description: 'Whisper, rustling leaves'
            };
        } else if (noiseLevel < 50) {
            return {
                color: '#34d399',
                colorLight: '#6ee7b7',
                category: 'Quiet',
                description: 'Normal conversation'
            };
        } else if (noiseLevel < 70) {
            return {
                color: '#f59e0b',
                colorLight: '#fbbf24',
                category: 'Moderate',
                description: 'Busy traffic, vacuum'
            };
        } else if (noiseLevel < 85) {
            return {
                color: '#f97316',
                colorLight: '#fb923c',
                category: 'Loud',
                description: 'Lawn mower, alarm clock'
            };
        } else if (noiseLevel < 100) {
            return {
                color: '#ef4444',
                colorLight: '#f87171',
                category: 'Very Loud',
                description: 'Chainsaw, rock concert'
            };
        } else {
            return {
                color: '#dc2626',
                colorLight: '#ef4444',
                category: 'Extremely Loud',
                description: 'Potential hearing damage'
            };
        }
    }
}

customElements.define('noise-metric', Noise);