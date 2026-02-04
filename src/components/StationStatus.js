import {html, LitElement, css} from "lit";
import {i18n} from "../i18n/i18n.js";

export const STATUS_ACTIVE = 'active';
export const STATUS_DELAYED = 'delayed';
export const STATUS_OFFLINE = 'offline';

export class StationStatus extends LitElement {
    static properties = {
        status: {type: String},
    };

    static styles = css`
        :host {
            display: block;
        }

        .container {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }

        .status-badge {
            padding: 0.375rem 0.75rem;
            font-size: 0.875rem;
            font-weight: 500;
            border-radius: 9999px;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .status-dot {
            width: 0.5rem;
            height: 0.5rem;
            border-radius: 50%;
        }

        /* Active Status */
        .status-active {
            background-color: rgba(16, 185, 129, 0.2);
            color: rgb(16, 185, 129);
        }

        .dot-active {
            background-color: rgb(16, 185, 129);
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        /* Delayed Status */
        .status-delayed {
            background-color: rgba(245, 158, 11, 0.2);
            color: rgb(245, 158, 11);
        }

        .dot-delayed {
            background-color: rgb(245, 158, 11);
            animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        /* Offline Status */
        .status-offline {
            background-color: rgba(239, 68, 68, 0.2);
            color: rgb(239, 68, 68);
        }

        .dot-offline {
            background-color: rgb(239, 68, 68);
        }

        @keyframes pulse {
            0%, 100% {
                opacity: 1;
            }
            50% {
                opacity: 0.5;
            }
        }
    `;

    constructor() {
        super();
        this.status = 'online';
    }

    render() {
        let statusClass, statusText, dotClass;

        switch (this.status) {
            case 'active':
                statusClass = 'status-active';
                statusText = i18n.t('STATION_ONLINE') || 'Online';
                dotClass = 'dot-active';
                break;
            case 'delayed':
                statusClass = 'status-delayed';
                statusText = i18n.t('STATION_DELAYED') || 'Delayed';
                dotClass = 'dot-delayed';
                break;
            default:
                statusClass = 'status-offline';
                statusText = i18n.t('STATION_OFFLINE') || 'Offline';
                dotClass = 'dot-offline';
        }

        return html`
            <div class="container">
                <span class="status-badge ${statusClass}">
                    <span class="status-dot ${dotClass}"></span>
                    ${statusText}
                </span>
            </div>
        `;
    }
}

customElements.define('station-status', StationStatus);