import {html, css} from 'lit';
import {StationStatus, STATUS_ACTIVE, STATUS_DELAYED, STATUS_OFFLINE} from "./StationStatus.js";
import {i18n} from "../i18n/i18n.js";
import {dateFormatter} from "../lib/DateFormatter.js";
import {StationData} from "../model/StationData.js";
import {MetricCard} from "./MetricCard.js";

export class StationListItem extends MetricCard {
    static properties = {
        station: {
            type: Object,
        },
    };

    constructor() {
        super();
        /**
         * @type {StationData}
         */
        this.station = null;
    }

    static styles = [
        ...MetricCard.styles,
        css`
            :host {
                display: block;
            }

            a {
                display: block;
                border-radius: 1rem;
                padding: 1.25rem;
                transition: transform 0.2s ease;
                text-decoration: none;
                color: inherit;
            }

            a:hover {
                transform: scale(1.01);
            }

            a.opacity-60 {
                opacity: 0.6;
            }

            .container {
                display: flex;
                flex-direction: column;
                gap: 1rem;
                justify-content: space-between;
            }

            @media (min-width: 640px) {
                .container {
                    flex-direction: row;
                    align-items: center;
                }
            }

            .left-section {
                display: flex;
                align-items: center;
                gap: 1rem;
            }

            .station-icon {
                width: 3rem;
                height: 3rem;
                border-radius: 0.75rem;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                background: linear-gradient(135deg, var(--gradient-from), var(--gradient-to));
            }

            .station-icon svg {
                width: 1.5rem;
                height: 1.5rem;
                color: white;
                margin-bottom: 0;
            }

            .station-info h3 {
                font-size: 1.125rem;
                font-weight: 600;
                color: white;
                margin: 0;
            }

            .station-info h3.inactive {
                color: rgb(148, 163, 184);
            }

            .station-info p {
                font-size: 0.75rem;
                color: rgb(148, 163, 184);
                margin: 0;
            }

            .station-info p.inactive {
                color: rgb(100, 116, 139);
            }

            .right-section {
                display: flex;
                align-items: center;
                gap: 1rem;
            }

            .arrow-icon {
                width: 1.5rem;
                height: 1.5rem;
                color: rgb(148, 163, 184);
                flex-shrink: 0;
                margin-bottom: 0;
            }

            /* Gradient variations */
            .gradient-emerald {
                --gradient-from: rgb(16, 185, 129);
                --gradient-to: rgb(20, 184, 166);
            }

            .gradient-blue {
                --gradient-from: rgb(59, 130, 246);
                --gradient-to: rgb(34, 211, 238);
            }

            .gradient-purple {
                --gradient-from: rgb(168, 85, 247);
                --gradient-to: rgb(236, 72, 153);
            }

            .gradient-amber {
                --gradient-from: rgb(245, 158, 11);
                --gradient-to: rgb(249, 115, 22);
            }

            .gradient-green {
                --gradient-from: rgb(34, 197, 94);
                --gradient-to: rgb(16, 185, 129);
            }

            .gradient-indigo {
                --gradient-from: rgb(99, 102, 241);
                --gradient-to: rgb(59, 130, 246);
            }
        `
    ];

    getGradient() {
        const gradients = [
            'gradient-emerald',
            'gradient-blue',
            'gradient-purple',
            'gradient-amber',
            'gradient-green',
            'gradient-indigo'
        ];
        // Use hash of UUID string to get consistent gradient
        const hash = this.station.id.split('').reduce((acc, char) => {
            return acc + char.charCodeAt(0);
        }, 0);
        return gradients[hash % gradients.length];
    }

    getLastUpdate() {
        if (this.station.lastReading) {
            return dateFormatter.formatRelative(this.station.lastReading);
        }

        return i18n.t('NO_DATA') || 'No data';
    }

    getStatus() {
        const isActive = this.station.isActive();
        return isActive ? STATUS_ACTIVE : STATUS_OFFLINE;
    }

    render() {
        if (!this.station) {
            return html``;
        }

        const isActive = this.station.isActive();
        const hasData = this.station.latestData !== null;
        const status = this.getStatus();
        const gradient = this.getGradient();
        const lastUpdate = this.getLastUpdate();
        const isInactive = !isActive && !hasData;
        const statusElement = new StationStatus();
        statusElement.status = status;

        return html`
            <a
                    id="station-${this.station.id}"
                    class="metric-card ${isInactive ? 'opacity-60' : ''}"
                    href="/#/station/${this.station.id}"
            >
                <div class="container">
                    <div class="left-section">
                        <div class="station-icon ${gradient}">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                            </svg>
                        </div>
                        <div class="station-info">
                            <h3 class="${isInactive ? 'inactive' : ''}">${this.station.getDisplayName()}</h3>
                            <p class="${isInactive ? 'inactive' : ''}">
                                ${this.station.id} • ${i18n.t('LAST_UPDATE') || 'Last update'}: ${lastUpdate}
                            </p>
                        </div>
                    </div>
                    <div class="right-section">
                        ${statusElement}
                        <svg class="arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                        </svg>
                    </div>
                </div>
            </a>
        `;
    }
}

customElements.define('station-list-item', StationListItem);