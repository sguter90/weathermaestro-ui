import {css, html, svg} from 'lit';
import {MetricCard} from "../MetricCard.js";
import {i18n} from "../../i18n/i18n.js";
import {uiConfigManager} from "../../lib/UiConfigManager.js";

export class WindSpeed extends MetricCard {
    static properties = {
        speed: {type: Number},
        gust: {type: Number},
    };

    static styles = [
        ...MetricCard.styles,
        css`
            .gauge-ring {
                stroke-dasharray: 502.4;
                stroke-dashoffset: 502.4;
                transition: stroke-dashoffset 1s ease-out;
            }

            .gauge-bg {
                stroke: rgba(30, 41, 59, 0.8);
            }
            
            .wind-streaks line, .wind-streaks path {
                stroke: rgba(56, 189, 248, 0.5);
                stroke-width: 3;
                stroke-linecap: round;
            }

            @keyframes windFlow {
                0% {
                    transform: translateX(-40px);
                    opacity: 0;
                }
                20% {
                    opacity: 1;
                }
                80% {
                    opacity: 1;
                }
                100% {
                    transform: translateX(40px);
                    opacity: 0;
                }
            }

            .wind-particle {
                animation: windFlow 2s ease-in-out infinite;
            }

            .wind-particle:nth-child(2) {
                animation-delay: 0.3s;
            }

            .wind-particle:nth-child(3) {
                animation-delay: 0.6s;
            }

            .wind-particle:nth-child(4) {
                animation-delay: 0.9s;
            }
        `
    ];

    constructor() {
        super();
        this.speed = 0;
        this.gust = 0;
        this.maxSpeed = 20; // 20 m/s = 72 km/h
    }

    getGaugeColor(percentage) {
        if (percentage < 30) return '#22c55e';
        if (percentage < 50) return '#38bdf8';
        if (percentage < 70) return '#eab308';
        if (percentage < 85) return '#f97316';
        return '#ef4444';
    }

    updated(changedProperties) {
        super.updated(changedProperties);

        if (changedProperties.has('speed') || changedProperties.has('maxSpeed')) {
            this.updateGaugeArc();
        }
    }

    updateGaugeArc() {
        const gaugeArc = this.shadowRoot.querySelector('.gauge-ring');
        if (gaugeArc) {
            const percentage = Math.min((this.speed / this.maxSpeed) * 100, 100);
            const radius = 80;
            const circumference = 2 * Math.PI * radius;
            const offset = circumference - (percentage / 100) * circumference;

            gaugeArc.style.strokeDashoffset = offset;
            gaugeArc.style.stroke = this.getGaugeColor(percentage);
        }
    }

    render() {
        const speedConverted = uiConfigManager.convert(this.speed, 'windSpeed');
        const gustConverted = uiConfigManager.convert(this.gust, 'windSpeed');
        const windUnit = uiConfigManager.getUnitLabel('windSpeed');

        return html`
            <div class="metric-card">
                <h4 class="card-header">${i18n.t('WIND_SPEED_HEADER')}</h4>

                <div class="text-center">
                    ${this.renderWindGauge()}

                    <div class="metric-row">
                        <span class="metric-value" style="color: rgb(34, 211, 238)">${speedConverted.toFixed(1)}</span>
                        <span class="metric-unit">${windUnit}</span>
                    </div>

                    <p class="text-label">${i18n.t('WIND_SPEED_LABEL')}</p>
                    <p class="text-sub"">${gustConverted} ${windUnit}</p>
                </div>
            </div>
        `;
    }

    renderWindGauge() {
        const percentage = Math.min((this.speed / this.maxSpeed) * 100, 100);
        const gaugeColor = this.getGaugeColor(percentage);

        return svg`
            <svg width="140" height="140" viewBox="0 0 200 200">
                <!-- Gauge Ring -->
                <g style="transform: rotate(-90deg); transform-origin: 100px 100px;">
                    <circle cx="100" cy="100" r="80" fill="none" class="gauge-bg" stroke-width="10"/>
                    <circle cx="100" cy="100" r="80" fill="none"
                            stroke="${gaugeColor}" stroke-width="10" stroke-linecap="round"
                            class="gauge-ring"/>
                </g>

                <!-- Wind Streaks -->
                <g class="wind-streaks" transform="translate(100, 100)">
                    <g class="wind-particle">
                        <line x1="-25" y1="-15" x2="5" y2="-15" stroke-width="2"/>
                    </g>
                    <g class="wind-particle">
                        <line x1="-30" y1="-5" x2="0" y2="-5" stroke-width="2"/>
                    </g>
                    <g class="wind-particle">
                        <line x1="-25" y1="5" x2="5" y2="5" stroke-width="2"/>
                    </g>
                    <g class="wind-particle">
                        <line x1="-30" y1="15" x2="0" y2="15" stroke-width="2"/>
                    </g>
                </g>
            </svg>
        `;
    }
}

customElements.define('wind-speed-metric', WindSpeed);