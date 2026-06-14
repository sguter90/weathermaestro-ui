import {viewManager} from "../lib/ViewManager.js";
import {apiClient} from "../lib/ApiClient.js";
import {i18n} from "../i18n/i18n.js";
import {authManager} from "../lib/AuthManager.js";
import {DashboardListItem} from "../components/DashboardListItem.js";

/**
 * Render summary card
 */
const renderSummaryCard = function (label, value, color) {
    return `
        <div class="summary-card summary-card--${color}">
            <div class="summary-card__icon">
                <span class="summary-card__value">${value}</span>
            </div>
            <p class="summary-card__label">${label}</p>
        </div>
    `;
}

/**
 * Render dashboard list view
 */
export async function renderDashboardListView() {
    viewManager.showLoading('Loading dashboards...');

    // Always create page-actions div (for both auth and unauth users)
    const pageActions = document.createElement('div');
    pageActions.className = 'page-actions';

    try {
        const dashboards = await apiClient.getDashboards();
        const isAuthenticated = authManager.isAuthenticated();

        const container = document.createElement('div');
        container.className = 'page-container';

        // Calculate stats
        const totalSections = dashboards.reduce((sum, d) => sum + d.getSections().length, 0);
        const totalWidgets = dashboards.reduce((sum, d) =>
            sum + d.getSections().reduce((s, section) => s + (section.widgets?.length || 0), 0), 0);

        // Header Section
        const header = document.createElement('div');
        header.className = 'page-header';
        header.innerHTML = `
            <div>
                <h1>${i18n.t('DASHBOARDS') || 'Dashboards'}</h1>
                <p>${i18n.t('DASHBOARDS_DESCRIPTION') || 'Manage your custom dashboards'}</p>
            </div>
        `;

        if (isAuthenticated) {
            const createBtn = document.createElement('button');
            createBtn.id = 'create-dashboard-btn';
            createBtn.className = 'btn-primary';
            createBtn.innerHTML = `
                <svg class="icon-medium" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                <span>${i18n.t('NEW_DASHBOARD') || 'New Dashboard'}</span>
            `;
            createBtn.onclick = () => showCreateDashboardDialog();
            pageActions.appendChild(createBtn);
        }

        header.appendChild(pageActions);
        container.appendChild(header);

        // Dashboards List
        const dashboardListElement = document.createElement('div');
        dashboardListElement.className = 'dashboard-list list-rows';

        if (dashboards.length === 0) {
            // Empty state
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = `
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 0v10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2z"/>
                </svg>
                <h3>${i18n.t('NO_DASHBOARDS') || 'No Dashboards Yet'}</h3>
                <p>${i18n.t('NO_DASHBOARDS_DESCRIPTION') || 'Create your first dashboard to get started'}</p>
            `;
            dashboardListElement.appendChild(emptyState);
        } else {
            // Render dashboard items
            dashboards.forEach((dashboard) => {
                const card = new DashboardListItem();
                card.dashboard = dashboard;
                card.isAuthenticated = isAuthenticated;

                // Add event listeners for edit and delete
                card.addEventListener('edit-dashboard', (e) => {
                    showEditDashboardDialog(e.detail.dashboard);
                });

                card.addEventListener('delete-dashboard', (e) => {
                    showDeleteDashboardDialog(e.detail.dashboard);
                });

                dashboardListElement.appendChild(card);
            });
        }

        container.appendChild(dashboardListElement);

        // Summary Stats
        const summaryStats = document.createElement('div');
        summaryStats.className = 'summary-stats';
        summaryStats.innerHTML = `
            ${renderSummaryCard(i18n.t('TOTAL_SUM') || 'Total', dashboards.length, 'blue')}
            ${renderSummaryCard(i18n.t('SECTIONS') || 'Sections', totalSections, 'emerald')}
            ${renderSummaryCard(i18n.t('WIDGETS') || 'Widgets', totalWidgets, 'amber')}
        `;
        container.appendChild(summaryStats);

        viewManager.render(container);
    } catch (error) {
        console.error('Error rendering dashboard list view', error);
        viewManager.showError(error.message);
    }

    // Create reload button AFTER try/catch (always available for retry)
    if (pageActions) {
        const reloadBtn = document.createElement('button');
        reloadBtn.id = 'reload-dashboards-btn';
        reloadBtn.className = 'btn-secondary';
        reloadBtn.setAttribute('aria-label', i18n.t('RELOAD_DASHBOARDS') || 'Reload dashboards');
        reloadBtn.innerHTML = `
            <svg class="icon-medium btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <span>${i18n.t('RELOAD_DASHBOARDS') || 'Reload dashboards'}</span>
        `;
        reloadBtn.onclick = handleReloadDashboards;
        // Insert before any existing buttons (New Dashboard, etc.)
        if (pageActions.firstChild) {
            pageActions.insertBefore(reloadBtn, pageActions.firstChild);
        } else {
            pageActions.appendChild(reloadBtn);
        }
    }
}

/**
 * Handle reload/refresh of the dashboard list view
 */
async function handleReloadDashboards() {
    const reloadBtn = document.getElementById('reload-dashboards-btn');
    if (!reloadBtn) return;

    // Set loading state
    reloadBtn.classList.add('loading');
    reloadBtn.disabled = true;

    try {
        // Re-fetch dashboards from API
        const dashboards = await apiClient.getDashboards();

        // Restore button state before re-render (button will be replaced)
        reloadBtn.classList.remove('loading');
        reloadBtn.disabled = false;

        // Re-render the view with fresh data
        await renderDashboardListView();
    } catch (error) {
        console.error('Error reloading dashboards:', error);
        // Restore button state on error
        if (reloadBtn) {
            reloadBtn.classList.remove('loading');
            reloadBtn.disabled = false;
        }
        alert(error.message || i18n.t('ERROR_LOADING_WIDGET') || 'Failed to reload dashboards');
    }
}

/**
 * Show create dashboard dialog
 */
async function showCreateDashboardDialog() {
    const dialog = document.createElement('div');
    dialog.className = 'dialog-overlay';

    const form = document.createElement('form');
    form.className = 'dialog-form';
    form.innerHTML = `
        <div class="dialog-header">
            <h2 class="dialog-title">
                ${i18n.t('CREATE_DASHBOARD') || 'Create Dashboard'}
            </h2>
            <button type="button" class="close-btn">
                <svg class="icon-large" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
        </div>
        
        <div class="dialog-body">
            <div class="form-group">
                <label class="form-label">
                    ${i18n.t('DASHBOARD_NAME') || 'Name'} *
                </label>
                <input 
                    type="text" 
                    name="name" 
                    required
                    class="form-input"
                    placeholder="${i18n.t('DASHBOARD_NAME_PLACEHOLDER') || 'My Dashboard'}"
                />
            </div>
        
            <div class="form-group">
                <label class="form-label">
                    ${i18n.t('DASHBOARD_DESCRIPTION') || 'Description'}
                </label>
                <textarea 
                    name="description" 
                    rows="3"
                    class="form-input"
                    placeholder="${i18n.t('DASHBOARD_DESCRIPTION_PLACEHOLDER') || 'Optional description...'}"
                ></textarea>
            </div>
        </div>
        
        <div class="dialog-form-actions">
            <button type="button" class="cancel-btn btn-secondary">
                ${i18n.t('CANCEL') || 'Cancel'}
            </button>
            <button type="submit" class="btn-primary">
                ${i18n.t('CREATE') || 'Create'}
            </button>
        </div>
    `;

    const closeDialog = () => dialog.remove();

    dialog.onclick = (e) => {
        if (e.target === dialog) closeDialog();
    };

    form.querySelector('.close-btn').onclick = closeDialog;
    form.querySelector('.cancel-btn').onclick = closeDialog;
    form.onsubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const name = formData.get('name').trim();
        const description = formData.get('description').trim();

        if (!name) {
            alert(i18n.t('NAME_REQUIRED') || 'Name is required');
            return;
        }

        try {
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = i18n.t('ADDING') || 'Adding...';

            const dashboard = await apiClient.createDashboard({
                name,
                description,
                config: { sections: [] }
            });

            closeDialog();

            // Navigate to the new dashboard
            window.location.hash = `#/dashboard/${dashboard.id}`;
        } catch (error) {
            console.error('Error creating dashboard:', error);
            alert(error.message || i18n.t('ERROR_CREATING_DASHBOARD') || 'Failed to create dashboard');

            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = false;
            submitBtn.textContent = i18n.t('CREATE') || 'Create';
        }
    };

    dialog.appendChild(form);
    document.body.appendChild(dialog);

    // Focus the name input
    form.querySelector('input[name="name"]').focus();
}

/**
 * Show edit dashboard dialog
 */
async function showEditDashboardDialog(dashboard) {
    const dialog = document.createElement('div');
    dialog.className = 'dialog-overlay';

    const form = document.createElement('form');
    form.className = 'dialog-form';
    form.innerHTML = `
        <div class="dialog-header">
            <h2 class="dialog-title">
                ${i18n.t('EDIT_DASHBOARD') || 'Edit Dashboard'}
            </h2>
            <button type="button" class="close-btn">
                <svg class=icon-large" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
        </div>
        
        <div class="dialog-body">
            <div class="form-group">
                <label class="form-label">
                    ${i18n.t('DASHBOARD_NAME') || 'Name'} <span class="text-red-400">*</span>
                </label>
                <input 
                    type="text" 
                    name="name" 
                    required
                    value="${dashboard.name}"
                    class="form-input"
                />
            </div>
            
            <div class="form-group">
                <label class="form-label">
                    ${i18n.t('DASHBOARD_DESCRIPTION') || 'Description'}
                </label>
                <textarea 
                    name="description" 
                    rows="3"
                    class="form-input"
                >${dashboard.description || ''}</textarea>
            </div>
        </div>
        
        <div class="dialog-form-actions">
            <button type="button" class="cancel-btn btn-secondary">
                ${i18n.t('CANCEL') || 'Cancel'}
            </button>
            <button type="submit" class="btn-primary">
                ${i18n.t('SAVE') || 'Save'}
            </button>
        </div>
    `;

    const closeDialog = () => dialog.remove();

    dialog.onclick = (e) => {
        if (e.target === dialog) closeDialog();
    };

    form.querySelector('.close-btn').onclick = closeDialog;
    form.querySelector('.cancel-btn').onclick = closeDialog;
    form.onsubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const name = formData.get('name').trim();
        const description = formData.get('description').trim();

        if (!name) {
            alert(i18n.t('NAME_REQUIRED') || 'Name is required');
            return;
        }

        try {
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = i18n.t('ADDING') || 'Adding...';

            await apiClient.updateDashboard(dashboard.id, {
                name,
                description,
                config: dashboard.config,
                isDefault: dashboard.isDefault
            });

            closeDialog();

            // Reload the dashboard list
            renderDashboardListView();
        } catch (error) {
            console.error('Error updating dashboard:', error);
            alert(error.message || i18n.t('ERROR_UPDATING_DASHBOARD') || 'Failed to update dashboard');

            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = false;
            submitBtn.textContent = i18n.t('SAVE') || 'Save';
        }
    };

    dialog.appendChild(form);
    document.body.appendChild(dialog);

    // Focus and select the name input
    const nameInput = form.querySelector('input[name="name"]');
    nameInput.focus();
    nameInput.select();
}

/**
 * Show delete dashboard dialog
 */
async function showDeleteDashboardDialog(dashboard) {
    const dialog = document.createElement('div');
    dialog.className = 'dialog-overlay';

    const confirmDialog = document.createElement('div');
    confirmDialog.className = 'dialog-form';
    confirmDialog.innerHTML = `
        <div class="dialog-header">
            <h2 class="dialog-title">
                ${i18n.t('DELETE') || 'Delete'}
            </h2>
            <button type="button" class="close-btn">
                <svg class="icon-medium" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
        </div>
        
        <div class="dialog-body">
            <div class="dialog-warning">
                <svg class="dialog-warning__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
                <div class="dialog-warning__content">
                    <p class="dialog-warning__title">
                        ${i18n.t('DELETE_DASHBOARD_WARNING') || 'This action cannot be undone'}
                    </p>
                    <p class="dialog-warning__description">
                        ${i18n.t('DELETE_DASHBOARD_DESCRIPTION') || 'All sections and widgets in this dashboard will be permanently deleted.'}
                    </p>
                </div>
            </div>
           
        </div>
        
        <div class="dialog-form-actions">
            <button type="button" class="cancel-btn btn-secondary">
                ${i18n.t('CANCEL') || 'Cancel'}
            </button>
            <button type="button" class="delete-btn btn-secondary delete">
                ${i18n.t('DELETE') || 'Delete'}
            </button>
        </div>
    `;

    const closeDialog = () => dialog.remove();

    dialog.onclick = (e) => {
        if (e.target === dialog) closeDialog();
    };

    confirmDialog.querySelector('.close-btn').onclick = closeDialog;
    confirmDialog.querySelector('.cancel-btn').onclick = closeDialog;

    confirmDialog.querySelector('.delete-btn').onclick = async () => {
        try {
            const deleteBtn = confirmDialog.querySelector('.delete-btn');
            deleteBtn.disabled = true;
            deleteBtn.textContent = i18n.t('DELETING') || 'Adding...';

            await apiClient.deleteDashboard(dashboard.id);

            closeDialog();

            // Reload the dashboard list
            renderDashboardListView();
        } catch (error) {
            console.error('Error deleting dashboard:', error);
            alert(error.message || i18n.t('ERROR_DELETING_DASHBOARD') || 'Failed to delete dashboard');

            const deleteBtn = confirmDialog.querySelector('.delete-btn');
            deleteBtn.disabled = false;
            deleteBtn.textContent = i18n.t('DELETE') || 'Delete';
        }
    };

    dialog.appendChild(confirmDialog);
    document.body.appendChild(dialog);
}