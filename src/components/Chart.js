import {css, html} from 'lit';
import {MetricCard} from "./MetricCard.js";

export class Chart extends MetricCard {
    static properties = {
        title: {type: String},
        subtitle: {type: String},
        data: {type: Array},
        labels: {type: Array},
        colorDot: {type: String},
        timeRanges: {type: Array},
        activeTimeRange: {type: String},
        stats: {type: Object},
        chartType: {type: String} // 'bar' or 'line'
    };

    static styles = [
        ...MetricCard.styles,
        css`
            .header {
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
                margin-bottom: 1.5rem;
            }

            @media (min-width: 640px) {
                .header {
                    flex-direction: row;
                    align-items: center;
                    justify-content: space-between;
                }
            }

            .title-section {
                display: flex;
                flex-direction: column;
                gap: 0.25rem;
            }

            .title-section h3 {
                font-weight: 600;
                color: white;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin: 0;
                font-size: 1rem;
            }

            .color-dot {
                width: 0.75rem;
                height: 0.75rem;
                border-radius: 9999px;
                display: inline-block;
                flex-shrink: 0;
            }

            .subtitle {
                font-size: 0.75rem;
                color: rgb(148, 163, 184);
                margin: 0;
            }

            .time-range-buttons {
                display: flex;
                gap: 0.5rem;
            }

            .time-btn {
                padding: 0.375rem 0.75rem;
                background-color: rgb(55, 65, 81);
                color: white;
                border: none;
                border-radius: 0.5rem;
                font-size: 0.75rem;
                font-weight: 500;
                cursor: pointer;
                transition: background-color 0.2s ease;
            }

            .time-btn:hover {
                background-color: rgb(71, 85, 105);
            }

            .time-btn.active {
                background-color: rgb(59, 130, 246);
            }

            .chart-container {
                margin-bottom: 0.75rem;
            }

            .bar-chart {
                display: flex;
                align-items: flex-end;
                justify-content: space-between;
                gap: 0.5rem;
                height: 10rem;
                margin-bottom: 0.75rem;
            }

            .bar-item {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.25rem;
            }

            .bar {
                width: 100%;
                border-radius: 0.375rem 0.375rem 0 0;
                animation: slideUp 0.6s ease-out forwards;
            }

            @keyframes slideUp {
                from {
                    height: 0;
                    opacity: 0;
                }
                to {
                    height: 100%;
                    opacity: 1;
                }
            }

            .bar-label {
                font-size: 0.75rem;
                color: rgb(148, 163, 184);
            }

            .bar-label.active {
                font-weight: 500;
                color: rgb(59, 130, 246);
            }

            .stats {
                display: flex;
                justify-content: space-between;
                font-size: 0.75rem;
                color: rgb(120, 113, 108);
                border-top: 1px solid rgb(51, 65, 85);
                padding-top: 0.75rem;
            }

            .line-chart {
                position: relative;
                height: 8rem;
                margin-bottom: 0.75rem;
            }

            .line-labels {
                display: flex;
                justify-content: space-between;
                font-size: 0.75rem;
                color: rgb(148, 163, 184);
            }

            .line-labels span.active {
                color: rgb(59, 130, 246);
                font-weight: 500;
            }

            svg {
                width: 100%;
                height: 100%;
            }
        `
    ];

    constructor() {
        super();
        this.title = 'Outdoor Temperature';
        this.subtitle = 'Daily average (°F) - Last 7 days';
        this.data = [70, 85, 75, 90, 80, 65, 95];
        this.labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'];
        this.colorDot = 'rgb(251, 191, 36)'; // amber-400
        this.timeRanges = ['7D', '30D', '90D'];
        this.activeTimeRange = '7D';
        this.stats = {
            min: '18°F',
            avg: '22.5°F',
            max: '28°F'
        };
        this.chartType = 'bar'; // 'bar' or 'line'
    }

    render() {
        return html`
            <div class="metric-card">
                <div class="header">
                    <div class="title-section">
                        <h3>
                            <span class="color-dot" style="background-color: ${this.colorDot}"></span>
                            ${this.title}
                        </h3>
                        <p class="subtitle">${this.subtitle}</p>
                    </div>
                    <div class="time-range-buttons">
                        ${this.renderTimeRangeButtons()}
                    </div>
                </div>

                <div class="chart-container">
                    ${this.chartType === 'bar' ? this.renderBarChart() : this.renderLineChart()}
                </div>

                ${this.renderStats()}
            </div>
        `;
    }

    renderBarChart() {
        const maxValue = Math.max(...this.data);
        const animationDelays = this.data.map((_, i) => i * 0.1);

        return html`
            <div class="bar-chart">
                ${this.data.map((value, index) => {
                    const percentage = (value / maxValue) * 100;
                    const isToday = index === this.data.length - 1;
                    const gradientColor = isToday
                            ? 'linear-gradient(to top, rgb(251, 146, 60), rgb(251, 191, 36))'
                            : 'linear-gradient(to top, rgb(251, 146, 60), rgb(251, 191, 36))';

                    return html`
                        <div class="bar-item">
                            <div
                                    class="bar"
                                    style="
                                    height: ${percentage}%;
                                    background: ${gradientColor};
                                    animation-delay: ${animationDelays[index]}s;
                                "
                            ></div>
                            <span class="bar-label ${isToday ? 'active' : ''}">
                                ${this.labels[index]}
                            </span>
                        </div>
                    `;
                })}
            </div>
        `;
    }

    renderLineChart() {
        const maxValue = Math.max(...this.data);
        const minValue = Math.min(...this.data);
        const range = maxValue - minValue;

        const points = this.data.map((value, index) => {
            const x = (index / (this.data.length - 1)) * 700;
            const y = 120 - ((value - minValue) / range) * 100;
            return {x, y};
        });

        const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
        const areaD = `${pathD} L700,120 L0,120 Z`;
        const lastPoint = points[points.length - 1];

        const circles = points.map(p => `<circle cx="${p.x}" cy="${p.y}" r="4" fill="#3b82f6"/>`).join('');

        return html`
            <div class="line-chart">
                <svg viewBox="0 0 700 120" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:0.3"/>
                            <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:0"/>
                        </linearGradient>
                    </defs>
                    <path d="${areaD}" fill="url(#lineGradient)"/>
                    <path d="${pathD}" fill="none" stroke="#3b82f6" stroke-width="3" stroke-linecap="round"/>
                    ${this.renderSVGCircles(circles)}
                    <circle cx="${lastPoint.x}" cy="${lastPoint.y}" r="6" fill="#3b82f6" stroke="#1e293b"
                            stroke-width="2"/>
                </svg>
            </div>
            <div class="line-labels">
                ${this.labels.map((label, i) => html`
                    <span class="${i === this.labels.length - 1 ? 'active' : ''}">${label}</span>
                `)}
            </div>
        `;
    }

    renderSVGCircles(circlesHTML) {
        return html`${circlesHTML}`;
    }

    renderStats() {
        return html`
            <div class="stats">
                <span>Min: ${this.stats.min}</span>
                <span>Avg: ${this.stats.avg}</span>
                <span>Max: ${this.stats.max}</span>
            </div>
        `;
    }

    renderTimeRangeButtons() {
        return this.timeRanges.map(range => html`
            <button
                    class="time-btn ${this.activeTimeRange === range ? 'active' : ''}"
                    @click=${() => this.handleTimeRangeChange(range)}
            >
                ${range}
            </button>
        `);
    }

    handleTimeRangeChange(range) {
        this.activeTimeRange = range;
        this.dispatchEvent(new CustomEvent('time-range-changed', {
            detail: {range},
            bubbles: true,
            composed: true
        }));
    }
}

customElements.define('chart-history', Chart);