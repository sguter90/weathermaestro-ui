import {viewManager} from "../lib/ViewManager.js";
import {apiClient} from "../lib/ApiClient.js";
import {i18n} from "../i18n/i18n.js";
import {authManager} from "../lib/AuthManager.js";
import {DashboardListItem} from "../components/DashboardListItem.js";

/**
 * Render summary card
 */
const renderSummaryCard = function (label, value, color) {
    const colorClasses = {
        blue: 'from-blue-500 to-cyan-500',
        emerald: 'from-emerald-500 to-teal-500',
        amber: 'from-amber-500 to-orange-500',
        purple: 'from-purple-500 to-pink-500'
    };

    return `
        <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-5 text-center">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} mx-auto mb-3 flex items-center justify-center shadow-lg">
                <span class="text-2xl font-bold text-white">${value}</span>
            </div>
            <p class="text-sm text-slate-400">${label}</p>
        </div>
    `;
}

/**
 * Render dashboard list view
 */
export async function renderDashboardListView() {
    viewManager.showLoading('Loading dashboards...');

    try {
        const dashboards = await apiClient.getDashboards();
        const isAuthenticated = authManager.isAuthenticated();

        const container = document.createElement('div');
        container.className = 'space-y-6';

        // Calculate stats
        const totalSections = dashboards.reduce((sum, d) => sum + d.getSections().length, 0);
        const totalWidgets = dashboards.reduce((sum, d) =>
            sum + d.getSections().reduce((s, section) => s + (section.widgets?.length || 0), 0), 0);

        container.innerHTML = `
            <!-- Header -->
            <div class="mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                    <h2 class="text-2xl font-bold text-white mb-2">${i18n.t('DASHBOARDS') || 'Dashboards'}</h2>
                    <p class="text-sm text-slate-400">${i18n.t('DASHBOARDS_DESCRIPTION') || 'Manage your custom dashboards'}</p>
                </div>
                ${isAuthenticated ? `
                    <button id="create-dashboard-btn" class="btn-primary flex items-center gap-2 self-start">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                        </svg>
                        <span>${i18n.t('NEW_DASHBOARD') || 'New Dashboard'}</span>
                    </button>
                ` : ''}
            </div>
            
            <!-- Dashboards List -->
            <div class="dashboard-list space-y-3"></div>
            
            <!-- Summary Stats -->
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8">
                ${renderSummaryCard(i18n.t('TOTAL_SUM') || 'Total', dashboards.length, 'blue')}
                ${renderSummaryCard(i18n.t('SECTIONS') || 'Sections', totalSections, 'emerald')}
                ${renderSummaryCard(i18n.t('WIDGETS') || 'Widgets', totalWidgets, 'amber')}
            </div>
        `;

        const dashboardListElement = container.querySelector('.dashboard-list');

        if (dashboards.length === 0) {
            // Empty state
            const emptyState = document.createElement('div');
            emptyState.className = 'bg-slate-800/50 border border-slate-700 rounded-2xl p-12 text-center';
            emptyState.innerHTML = `
                <svg class="w-16 h-16 mx-auto text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 0v10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2z"/>
                </svg>
                <h3 class="text-lg font-semibold text-slate-300 mb-2">
                    ${i18n.t('NO_DASHBOARDS') || 'No Dashboards Yet'}
                </h3>
                <p class="text-sm text-slate-400 mb-4">
                    ${i18n.t('NO_DASHBOARDS_DESCRIPTION') || 'Create your first dashboard to get started'}
                </p>
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

        // Add create button handler
        if (isAuthenticated) {
            const createBtn = container.querySelector('#create-dashboard-btn');
            if (createBtn) {
                createBtn.onclick = () => showCreateDashboardDialog();
            }
        }

        viewManager.render(container);
    } catch (error) {
        console.error('Error rendering dashboard list view', error);
        viewManager.showError(error.message);
    }
}

/**
 * Show create dashboard dialog
 */
async function showCreateDashboardDialog() {
    const dialog = document.createElement('div');
    dialog.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4';

    const form = document.createElement('form');
    form.className = 'bg-slate-800/95 border border-slate-700 rounded-2xl p-6 max-w-md w-full space-y-4';
    form.innerHTML = `
        <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-bold text-white">
                ${i18n.t('CREATE_DASHBOARD') || 'Create Dashboard'}
            </h2>
            <button type="button" class="close-btn text-slate-400 hover:text-white">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
        </div>
        
        <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">
                ${i18n.t('DASHBOARD_NAME') || 'Name'} <span class="text-red-400">*</span>
            </label>
            <input 
                type="text" 
                name="name" 
                required
                class="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="${i18n.t('DASHBOARD_NAME_PLACEHOLDER') || 'My Dashboard'}"
            />
        </div>
        
        <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">
                ${i18n.t('DASHBOARD_DESCRIPTION') || 'Description'}
            </label>
            <textarea 
                name="description" 
                rows="3"
                class="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="${i18n.t('DASHBOARD_DESCRIPTION_PLACEHOLDER') || 'Optional description...'}"
            ></textarea>
        </div>
        
        <div class="flex gap-3 pt-4">
            <button type="button" class="cancel-btn btn-secondary flex-1">
                ${i18n.t('CANCEL') || 'Cancel'}
            </button>
            <button type="submit" class="btn-primary flex-1">
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
            submitBtn.innerHTML = `
                <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            `;

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
    dialog.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4';

    const form = document.createElement('form');
    form.className = 'bg-slate-800/95 border border-slate-700 rounded-2xl p-6 max-w-md w-full space-y-4';
    form.innerHTML = `
        <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-bold text-white">
                ${i18n.t('EDIT_DASHBOARD') || 'Edit Dashboard'}
            </h2>
            <button type="button" class="close-btn text-slate-400 hover:text-white">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
        </div>
        
        <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">
                ${i18n.t('DASHBOARD_NAME') || 'Name'} <span class="text-red-400">*</span>
            </label>
            <input 
                type="text" 
                name="name" 
                required
                value="${dashboard.name}"
                class="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
        
        <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">
                ${i18n.t('DASHBOARD_DESCRIPTION') || 'Description'}
            </label>
            <textarea 
                name="description" 
                rows="3"
                class="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            >${dashboard.description || ''}</textarea>
        </div>
        
        <div class="flex gap-3 pt-4">
            <button type="button" class="cancel-btn btn-secondary flex-1">
                ${i18n.t('CANCEL') || 'Cancel'}
            </button>
            <button type="submit" class="btn-primary flex-1">
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
            submitBtn.innerHTML = `
                <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            `;

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
    dialog.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4';

    const confirmDialog = document.createElement('div');
    confirmDialog.className = 'bg-slate-800/95 border border-slate-700 rounded-2xl p-6 max-w-md w-full space-y-4';
    confirmDialog.innerHTML = `
        <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-bold text-white">
                ${i18n.t('DELETE_DASHBOARD') || 'Delete Dashboard'}
            </h2>
            <button type="button" class="close-btn text-slate-400 hover:text-white">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
        </div>
        
        <div class="space-y-3">
            <div class="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <svg class="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
                <div>
                    <p class="text-sm font-medium text-red-300">
                        ${i18n.t('DELETE_DASHBOARD_WARNING') || 'This action cannot be undone'}
                    </p>
                    <p class="text-sm text-red-400/80 mt-1">
                        ${i18n.t('DELETE_DASHBOARD_DESCRIPTION') || 'All sections and widgets in this dashboard will be permanently deleted.'}
                    </p>
                </div>
            </div>
            
            <p class="text-sm text-slate-300">
                ${i18n.t('CONFIRM_DELETE_DASHBOARD', '', { name: dashboard.name }) || `Are you sure you want to delete "${dashboard.name}"?`}
            </p>
        </div>
        
        <div class="flex gap-3 pt-4">
            <button type="button" class="cancel-btn btn-secondary flex-1">
                ${i18n.t('CANCEL') || 'Cancel'}
            </button>
            <button type="button" class="delete-btn bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex-1">
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
            deleteBtn.innerHTML = `
                <svg class="animate-spin h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            `;

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