import {html, css} from 'lit';
import {i18n} from "../i18n/i18n.js";
import {MetricCard} from "./MetricCard.js";

export class DashboardListItem extends MetricCard {
    static properties = {
        dashboard: {
            type: Object,
        },
        isAuthenticated: {
            type: Boolean,
        },
    };

    constructor() {
        super();
        this.dashboard = null;
        this.isAuthenticated = false;
    }

    static styles = [
        ...MetricCard.styles,
        css`
            :host {
                display: block;
            }

            .dashboard-container {
                display: block;
                border-radius: 1rem;
                padding: 1.25rem;
                transition: transform 0.2s ease;
                text-decoration: none;
                color: inherit;
                position: relative;
            }

            .dashboard-container:hover {
                transform: scale(1.01);
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
                flex: 1;
                min-width: 0;
            }

            .dashboard-icon {
                width: 3rem;
                height: 3rem;
                border-radius: 0.75rem;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                background: linear-gradient(135deg, var(--gradient-from), var(--gradient-to));
                flex-shrink: 0;
            }

            .dashboard-icon svg {
                width: 1.5rem;
                height: 1.5rem;
                color: white;
                margin-bottom: 0;
            }

            .dashboard-info {
                flex: 1;
                min-width: 0;
            }

            .dashboard-info h3 {
                font-size: 1.125rem;
                font-weight: 600;
                color: white;
                margin: 0;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .dashboard-info p {
                font-size: 0.75rem;
                color: rgb(148, 163, 184);
                margin: 0;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .dashboard-stats {
                display: flex;
                gap: 0.75rem;
                font-size: 0.75rem;
                color: rgb(148, 163, 184);
                margin-top: 0.25rem;
            }

            .stat-item {
                display: flex;
                align-items: center;
                gap: 0.25rem;
            }

            .stat-item svg {
                width: 0.875rem;
                height: 0.875rem;
                margin-bottom: 0;
            }

            .right-section {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }

            .default-badge {
                display: inline-flex;
                align-items: center;
                gap: 0.25rem;
                padding: 0.25rem 0.75rem;
                background: rgba(168, 85, 247, 0.1);
                border: 1px solid rgba(168, 85, 247, 0.3);
                border-radius: 9999px;
                font-size: 0.75rem;
                color: rgb(192, 132, 252);
                white-space: nowrap;
            }

            .default-badge svg {
                width: 0.875rem;
                height: 0.875rem;
                margin-bottom: 0;
            }

            .actions {
                display: flex;
                gap: 0.5rem;
            }

            .action-btn {
                width: 2rem;
                height: 2rem;
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(51, 65, 85, 0.5);
                border: 1px solid rgb(51, 65, 85);
                border-radius: 0.5rem;
                color: rgb(148, 163, 184);
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .action-btn:hover {
                background: rgba(71, 85, 105, 0.5);
                color: white;
            }

            .action-btn.delete:hover {
                background: rgba(239, 68, 68, 0.2);
                border-color: rgb(239, 68, 68);
                color: rgb(248, 113, 113);
            }

            .action-btn svg {
                width: 1rem;
                height: 1rem;
                margin-bottom: 0;
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
        const hash = this.dashboard.id.split('').reduce((acc, char) => {
            return acc + char.charCodeAt(0);
        }, 0);
        return gradients[hash % gradients.length];
    }

    handleEdit(e) {
        e.preventDefault();
        e.stopPropagation();
        this.dispatchEvent(new CustomEvent('edit-dashboard', {
            detail: { dashboard: this.dashboard },
            bubbles: true,
            composed: true
        }));
    }

    handleDelete(e) {
        e.preventDefault();
        e.stopPropagation();
        this.dispatchEvent(new CustomEvent('delete-dashboard', {
            detail: { dashboard: this.dashboard },
            bubbles: true,
            composed: true
        }));
    }

    handleLinkClick(e) {
        // Prevent navigation if clicking on action buttons
        if (e.target.closest('.action-btn')) {
            e.preventDefault();
        }
    }

    render() {
        if (!this.dashboard) {
            return html``;
        }

        const gradient = this.getGradient();
        const sections = this.dashboard.getSections();
        const totalWidgets = sections.reduce((sum, section) => sum + (section.widgets?.length || 0), 0);

        return html`
            <a
                    class="dashboard-container metric-card"
                    href="/#/dashboard/${this.dashboard.id}"
                    @click="${this.handleLinkClick}"
            >
                <div class="container">
                    <div class="left-section">
                        <div class="dashboard-icon ${gradient}">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 0v10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2z"/>
                            </svg>
                        </div>
                        <div class="dashboard-info">
                            <h3>${this.dashboard.name}</h3>
                            ${this.dashboard.description ? html`
                                <p>${this.dashboard.description}</p>
                            ` : ''}
                            <div class="dashboard-stats">
                                <div class="stat-item">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
                                    </svg>
                                    <span>${sections.length} ${i18n.t('SECTIONS') || 'Sections'}</span>
                                </div>
                                <div class="stat-item">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 13a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1v-6z"/>
                                    </svg>
                                    <span>${totalWidgets} ${i18n.t('WIDGETS') || 'Widgets'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="right-section">
                        ${this.dashboard.isDefault ? html`
                            <div class="default-badge">
                                <svg fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                </svg>
                                ${i18n.t('DEFAULT') || 'Default'}
                            </div>
                        ` : ''}
                        ${this.isAuthenticated ? html`
                            <div class="actions">
                                <button
                                        class="action-btn"
                                        @click="${this.handleEdit}"
                                        title="${i18n.t('EDIT') || 'Edit'}"
                                >
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                    </svg>
                                </button>
                                ${!this.dashboard.isDefault ? html`
                                    <button
                                            class="action-btn delete"
                                            @click="${this.handleDelete}"
                                            title="${i18n.t('DELETE') || 'Delete'}"
                                    >
                                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                        </svg>
                                    </button>
                                ` : ''}
                            </div>
                        ` : ''}
                        <svg class="arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                        </svg>
                    </div>
                </div>
            </a>
        `;
    }
}

customElements.define('dashboard-list-item', DashboardListItem);