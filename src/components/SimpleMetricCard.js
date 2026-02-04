import {css, html} from 'lit';
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';
import {MetricCard} from './MetricCard.js';

/**
 * Simple Metric Card Widget - Displays a single metric with icon and status
 * Extends MetricCard with standard metric display layout
 */
export class SimpleMetricCard extends MetricCard {
    static properties = {
        icon: {type: String},
        label: {type: String},
        value: {type: String},
        unit: {type: String},
        status: {type: String},
        statusColor: {type: String}
    };

    static styles = [
        ...MetricCard.styles,
        css`
            .metric-header {
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                margin-bottom: 0.75rem;
            }

            .metric-icon-container {
                width: 2.5rem;
                height: 2.5rem;
                border-radius: 0.75rem;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.25rem;
                background-color: rgba(59, 130, 246, 0.2);
            }

            .metric-icon-container.blue {
                background-color: rgba(59, 130, 246, 0.2);
            }

            .metric-icon-container.green {
                background-color: rgba(16, 185, 129, 0.2);
            }

            .metric-icon-container.red {
                background-color: rgba(239, 68, 68, 0.2);
            }

            .metric-icon-container.amber {
                background-color: rgba(245, 158, 11, 0.2);
            }

            .metric-icon-container.purple {
                background-color: rgba(139, 92, 246, 0.2);
            }

            .metric-icon-container.cyan {
                background-color: rgba(34, 211, 238, 0.2);
            }

            .metric-status {
                font-size: 0.75rem;
                font-weight: 500;
                padding: 0.25rem 0.5rem;
                border-radius: 0.25rem;
            }

            .metric-status.blue {
                color: #60a5fa;
            }

            .metric-status.green {
                color: #10b981;
            }

            .metric-status.red {
                color: #ef4444;
            }

            .metric-status.amber {
                color: #f59e0b;
            }

            .metric-status.purple {
                color: #a78bfa;
            }

            .metric-status.cyan {
                color: #22d3ee;
            }

            .metric-value {
                font-size: 1.875rem;
                font-weight: bold;
                color: white;
                font-family: 'Courier New', monospace;
                margin-bottom: 0.25rem;
                line-height: 1.2;
            }

            .metric-value-unit {
                font-size: 0.875rem;
                font-weight: normal;
                color: rgb(100, 116, 139);
                margin-left: 0.25rem;
            }

            .metric-label {
                font-size: 0.875rem;
                color: rgb(148, 163, 184);
                margin-top: 0.25rem;
            }

            @media (max-width: 640px) {
                .metric-value {
                    font-size: 1.5rem;
                }

                .metric-label {
                    font-size: 0.75rem;
                }
            }

            @keyframes value-update {
                0% {
                    opacity: 0.7;
                    transform: scale(0.95);
                }
                50% {
                    opacity: 1;
                    transform: scale(1.05);
                }
                100% {
                    opacity: 1;
                    transform: scale(1);
                }
            }

            .metric-value.updating {
                animation: value-update 0.3s ease-out;
            }
        `
    ];

    constructor() {
        super();
        this.icon = '📊';
        this.label = 'Metric';
        this.value = '0';
        this.unit = '';
        this.status = '';
        this.statusColor = 'blue';
    }

    render() {
        return html`
            <div class="metric-card">
                <div class="metric-header">
                    <div class="metric-icon-container ${this.statusColor}">
                        ${unsafeHTML(this.icon)}
                    </div>
                    ${this.status ? html`
                        <span class="metric-status ${this.statusColor}">
                            ${this.status}
                        </span>
                    ` : ''}
                </div>
                <p class="metric-value text-2xl sm:text-3xl">
                    ${this.value}${this.unit ? html`<span class="metric-value-unit">${this.unit}</span>` : ''}
                </p>
                <p class="metric-label text-xs sm:text-sm">${this.label}</p>
            </div>
        `;
    }

    /**
     * Update metric data
     * @param {Object} newData - New metric data
     */
    updateMetric(newData) {
        if (newData.value !== undefined) {
            this.value = newData.value;
        }
        if (newData.label !== undefined) {
            this.label = newData.label;
        }
        if (newData.unit !== undefined) {
            this.unit = newData.unit;
        }
        if (newData.status !== undefined) {
            this.status = newData.status;
        }
        if (newData.statusColor !== undefined) {
            this.statusColor = newData.statusColor;
        }
        if (newData.icon !== undefined) {
            this.icon = newData.icon;
        }
    }

    /**
     * Set metric value with animation
     * @param {string|number} value - New value
     */
    setValue(value) {
        this.value = String(value);
        this.requestUpdate();
    }

    /**
     * Set metric status
     * @param {string} status - Status text
     * @param {string} color - Status color
     */
    setStatus(status, color = 'blue') {
        this.status = status;
        this.statusColor = color;
    }

    /**
     * Get current metric value
     * @returns {string}
     */
    getValue() {
        return this.value;
    }
}

customElements.define('simple-metric-card', SimpleMetricCard);