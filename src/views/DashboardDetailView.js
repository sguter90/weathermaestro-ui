import {viewManager} from "../lib/ViewManager.js";
import {i18n} from "../i18n/i18n.js";
import {apiClient} from "../lib/ApiClient.js";
import {authManager} from "../lib/AuthManager.js";
import {MetricReader} from "../lib/MetricReader.js";
import {SENSOR_TYPES} from "../config/sensor_types.js";

/**
 * Render dashboard detail view
 */
export async function renderDashboardDetailView(params) {
    viewManager.showLoading('Loading dashboard...');

    const {id} = params;

    try {
        const dashboard = await apiClient.getDashboard(id);
        const isAuthenticated = authManager.isAuthenticated();

        if (!dashboard) {
            viewManager.showError(i18n.t('DASHBOARD_NOT_FOUND') || 'Dashboard not found');
            return;
        }

        const container = document.createElement('div');
        container.className = 'page-container';
        container.dataset.dashboardId = dashboard.id;

        // Header Section
        const header = document.createElement('div');
        header.className = 'page-header';
        header.innerHTML = `
            <div>
                <h1>${dashboard.name}</h1>
                ${dashboard.description ? `<p>${dashboard.description}</p>` : ''}
            </div>
        `;

        if (isAuthenticated) {
            const actions = document.createElement('div');
            actions.className = 'page-actions';

            const addSectionBtn = document.createElement('button');
            addSectionBtn.className = 'btn-primary';
            addSectionBtn.innerHTML = `
                <svg class="icon-medium" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                <span>${i18n.t('ADD_SECTION') || 'Add Section'}</span>
            `;
            addSectionBtn.onclick = () => showAddSectionDialog(dashboard);

            actions.appendChild(addSectionBtn);
            header.appendChild(actions);
        }

        container.appendChild(header);

        // Render sections
        const sections = dashboard.getSections();

        if (sections.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = `
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 0v10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2z"/>
                </svg>
                <h3>${i18n.t('NO_SECTIONS') || 'No Sections Yet'}</h3>
                <p>${i18n.t('NO_SECTIONS_DESCRIPTION') || 'Add sections to organize your dashboard widgets'}</p>
            `;
            container.appendChild(emptyState);
        } else {
            // Render each section
            for (const section of sections) {
                const sectionElement = await renderSection(section, dashboard, isAuthenticated);
                container.appendChild(sectionElement);
            }
        }

        viewManager.render(container);
    } catch (error) {
        console.error('Error rendering dashboard detail view', error);
        viewManager.showError(error.message);
    }
}

/**
 * Render a dashboard section
 */
async function renderSection(section, dashboard, isAuthenticated) {
    const sectionElement = document.createElement('div');
    sectionElement.className = 'dashboard-section';
    sectionElement.dataset.sectionId = section.id;

    // Section header
    const header = document.createElement('div');
    header.className = 'section-header';

    const title = document.createElement('h2');
    title.textContent = section.name;
    header.appendChild(title);

    if (isAuthenticated) {
        const actions = document.createElement('div');
        actions.className = 'section-actions';

        const addWidgetBtn = document.createElement('button');
        addWidgetBtn.className = 'btn-secondary';
        addWidgetBtn.innerHTML = `
            <svg class="icon-medium" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            <span>${i18n.t('ADD_WIDGET') || 'Add Widget'}</span>
        `;
        addWidgetBtn.onclick = () => showAddWidgetDialog(section, dashboard);

        const editSectionBtn = document.createElement('button');
        editSectionBtn.className = 'btn-secondary';
        editSectionBtn.innerHTML = `
            <svg class="icon-medium" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
        `;
        editSectionBtn.onclick = () => showEditSectionDialog(section, dashboard);

        const deleteSectionBtn = document.createElement('button');
        deleteSectionBtn.className = 'btn-secondary delete';
        deleteSectionBtn.innerHTML = `
            <svg class="icon-medium" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
        `;
        deleteSectionBtn.onclick = () => deleteSection(section, dashboard);

        actions.appendChild(addWidgetBtn);
        actions.appendChild(editSectionBtn);
        actions.appendChild(deleteSectionBtn);
        header.appendChild(actions);
    }

    sectionElement.appendChild(header);

    // Widgets grid
    const widgets = section.widgets || [];

    if (widgets.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = `
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 0v10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2z"/>
            </svg>
            <p>${i18n.t('NO_WIDGETS_IN_SECTION') || 'No widgets in this section yet'}</p>
        `;
        sectionElement.appendChild(emptyState);
    } else {
        const widgetsGrid = document.createElement('div');
        widgetsGrid.className = 'widgets-grid';

        for (const widget of widgets) {
            try {
                const widgetElement = await renderWidget(widget, section, dashboard, isAuthenticated);
                widgetsGrid.appendChild(widgetElement);
            } catch (error) {
                console.error('Error rendering widget:', error);
                const errorWidget = document.createElement('div');
                errorWidget.className = 'empty-state';
                errorWidget.innerHTML = `
                    <p style="color: #f87171;">${i18n.t('ERROR_LOADING_WIDGET') || 'Error loading widget'}</p>
                `;
                widgetsGrid.appendChild(errorWidget);
            }
        }

        sectionElement.appendChild(widgetsGrid);
    }

    return sectionElement;
}

/**
 * Render a widget
 */
async function renderWidget(widget, section, dashboard, isAuthenticated) {
    const widgetElement = document.createElement('div');
    widgetElement.className = 'widget-container';
    widgetElement.dataset.widgetId = widget.id;

    try {
        // Fetch station and sensor data
        const station = await apiClient.getStation(widget.stationId);
        const sensorData = station.sensors.find(s => s.id === widget.sensorId);

        if (!sensorData) {
            throw new Error('Sensor not found');
        }

        // Get sensor type configuration
        const sensorType = SENSOR_TYPES.find(t => t.name === sensorData.sensorType);
        if (!sensorType) {
            throw new Error('Unknown sensor type');
        }

        // Create metric component
        const metricReader = new MetricReader(station.sensors, station.latestData);
        const metricElement = metricReader.createComponent(sensorData);

        widgetElement.appendChild(metricElement);

        // Add delete button for authenticated users
        if (isAuthenticated) {
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'widget-delete-btn';
            deleteBtn.innerHTML = `
                <svg class="icon-medium" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            `;
            deleteBtn.onclick = () => deleteWidget(widget, section, dashboard);
            widgetElement.appendChild(deleteBtn);
        }

    } catch (error) {
        console.error('Error rendering widget:', error);
        widgetElement.innerHTML = `
            <div class="empty-state">
                <p style="color: #f87171;">${error.message}</p>
            </div>
        `;
    }

    return widgetElement;
}

/**
 * Show add section dialog
 */
async function showAddSectionDialog(dashboard) {
    const dialog = document.createElement('div');
    dialog.className = 'dialog-overlay';

    const form = document.createElement('form');
    form.className = 'dialog-form';
    form.innerHTML = `
        <div class="dialog-header">
            <h2 class="dialog-title">
                ${i18n.t('ADD_SECTION') || 'Add Section'}
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
                    ${i18n.t('SECTION_NAME') || 'Section Name'} *
                </label>
                <input 
                    type="text" 
                    name="name" 
                    required
                    class="form-input"
                    placeholder="${i18n.t('SECTION_NAME_PLACEHOLDER') || 'e.g., Temperature Sensors'}"
                />
            </div>
        </div>
        
        <div class="dialog-form-actions">
            <button type="button" class="cancel-btn btn-secondary">
                ${i18n.t('CANCEL') || 'Cancel'}
            </button>
            <button type="submit" class="btn-primary">
                ${i18n.t('ADD') || 'Add'}
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

        if (!name) {
            alert(i18n.t('SECTION_NAME_REQUIRED') || 'Section name is required');
            return;
        }

        try {
            const submitBtn = form.querySelector('[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = i18n.t('ADDING') || 'Adding...';

            // Add section to dashboard config
            dashboard.addSection({ name });

            // Update dashboard via API
            await apiClient.updateDashboard(dashboard.id, dashboard.toApiFormat());

            closeDialog();

            // Reload the view
            renderDashboardDetailView({ id: dashboard.id });
        } catch (error) {
            console.error('Error adding section:', error);
            alert(error.message || i18n.t('ERROR_ADDING_SECTION') || 'Failed to add section');
        }
    };

    dialog.appendChild(form);
    document.body.appendChild(dialog);

    // Focus the name input
    form.querySelector('input[name="name"]').focus();
}

/**
 * Show edit section dialog
 */
async function showEditSectionDialog(section, dashboard) {
    const dialog = document.createElement('div');
    dialog.className = 'dialog-overlay';

    const form = document.createElement('form');
    form.className = 'dialog-form';
    form.innerHTML = `
        <div class="dialog-header">
            <h2 class="dialog-title">
                ${i18n.t('EDIT_SECTION') || 'Edit Section'}
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
                    ${i18n.t('SECTION_NAME') || 'Section Name'} <span class="text-red-400">*</span>
                </label>
                <input 
                    type="text" 
                    name="name" 
                    required
                    value="${section.name}"
                    class="form-input"
                />
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

        if (!name) {
            alert(i18n.t('SECTION_NAME_REQUIRED') || 'Section name is required');
            return;
        }

        try {
            const submitBtn = form.querySelector('[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = i18n.t('SAVING') || 'Saving...';

            dashboard.updateSection(section.id, { name });

            await apiClient.updateDashboard(dashboard.id, dashboard.toApiFormat());

            closeDialog();

            // Reload the view
            renderDashboardDetailView({ id: dashboard.id });
        } catch (error) {
            console.error('Error updating section:', error);
            alert(error.message || i18n.t('ERROR_UPDATING_SECTION') || 'Failed to update section');
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
 * Delete section with confirmation
 */
async function deleteSection(section, dashboard) {
    const confirmed = confirm(
        i18n.t('CONFIRM_DELETE_SECTION', '',{ name: section.name }) ||
        `Are you sure you want to delete "${section.name}"? All widgets in this section will be removed.`
    );

    if (!confirmed) return;

    try {
        // Remove section from dashboard config
        dashboard.removeSection(section.id);

        // Update dashboard via API
        await apiClient.updateDashboard(dashboard.id, dashboard.toApiFormat());

        // Reload the view
        renderDashboardDetailView({ id: dashboard.id });
    } catch (error) {
        console.error('Error deleting section:', error);
        alert(error.message || i18n.t('ERROR_DELETING_SECTION') || 'Failed to delete section');
    }
}


/**
 * Show add widget dialog
 */
async function showAddWidgetDialog(section, dashboard) {
    const dialog = document.createElement('div');
    dialog.className = 'dialog-overlay';

    const form = document.createElement('form');
    form.className = 'dialog-form dialog-form-large';
    form.innerHTML = `
        <div class="dialog-header">
            <h2 class="dialog-title">
                ${i18n.t('ADD_WIDGET') || 'Add Widget'}
            </h2>
            <button type="button" class="close-btn">
                <svg class="icon-medium" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
        </div>
        
        <div class="dialog-body">
            <div class="form-group">
                <label class="form-label">
                    ${i18n.t('SELECT_STATION') || 'Select Station'} <span class="text-red-400">*</span>
                </label>
                <select 
                    name="stationId" 
                    required
                    class="form-input"
                >
                    <option value="">${i18n.t('SELECT_STATION_PLACEHOLDER') || 'Choose a station...'}</option>
                </select>
            </div>
            
            <div class="form-group">
                <label class="form-label">
                    ${i18n.t('SELECT_SENSOR') || 'Select Sensor'} <span class="text-red-400">*</span>
                </label>
                <select 
                    name="sensorId" 
                    required
                    disabled
                    class="form-input"
                >
                    <option value="">${i18n.t('SELECT_SENSOR_PLACEHOLDER') || 'First select a station...'}</option>
                </select>
            </div>
        </div>
        
        <div class="dialog-form-actions">
            <button type="button" class="cancel-btn btn-secondary">
                ${i18n.t('CANCEL') || 'Cancel'}
            </button>
            <button type="submit" class="btn-primary">
                ${i18n.t('ADD') || 'Add'}
            </button>
        </div>
    `;

    const closeDialog = () => dialog.remove();

    dialog.onclick = (e) => {
        if (e.target === dialog) closeDialog();
    };

    form.querySelector('.close-btn').onclick = closeDialog;
    form.querySelector('.cancel-btn').onclick = closeDialog;

    // Load stations
    try {
        const stations = await apiClient.getStations();
        const stationSelect = form.querySelector('select[name="stationId"]');

        stations.forEach(station => {
            const option = document.createElement('option');
            option.value = station.id;
            option.textContent = station.getDisplayName();
            stationSelect.appendChild(option);
        });

        // Handle station selection
        stationSelect.onchange = async () => {
            const sensorSelect = form.querySelector('select[name="sensorId"]');
            sensorSelect.innerHTML = `<option value="">${i18n.t('LOADING') || 'Loading...'}</option>`;
            sensorSelect.disabled = true;

            if (!stationSelect.value) {
                sensorSelect.innerHTML = `<option value="">${i18n.t('SELECT_SENSOR_PLACEHOLDER') || 'First select a station...'}</option>`;
                return;
            }

            try {
                const station = await apiClient.getStation(stationSelect.value);
                sensorSelect.innerHTML = `<option value="">${i18n.t('SELECT_SENSOR_PLACEHOLDER') || 'Choose a sensor...'}</option>`;

                station.sensors.forEach(sensor => {
                    console.log('Sensor:', sensor);
                    const sensorType = SENSOR_TYPES.find(t => t.name === sensor.sensorType);
                    if (sensorType) {
                        const option = document.createElement('option');
                        option.value = sensor.id;
                        option.textContent = `${sensor.location} - ${sensorType.title}`;
                        sensorSelect.appendChild(option);
                    }
                });

                sensorSelect.disabled = false;
            } catch (error) {
                console.error('Error loading sensors:', error);
                sensorSelect.innerHTML = `<option value="">${i18n.t('ERROR_LOADING_SENSORS') || 'Error loading sensors'}</option>`;
            }
        };

    } catch (error) {
        console.error('Error loading stations:', error);
        alert(error.message || i18n.t('ERROR_LOADING_STATIONS') || 'Failed to load stations');
        closeDialog();
        return;
    }

    form.onsubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const stationId = formData.get('stationId');
        const sensorId = formData.get('sensorId');

        if (!stationId || !sensorId) {
            alert(i18n.t('STATION_AND_SENSOR_REQUIRED') || 'Please select both station and sensor');
            return;
        }

        try {
            const submitBtn = form.querySelector('[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = i18n.t('ADDING') || 'Adding...';

            // Add widget to dashboard config
            dashboard.addWidget(section.id, {
                type: 'sensor',
                stationId,
                sensorId
            });

            // Update dashboard via API
            await apiClient.updateDashboard(dashboard.id, dashboard.toApiFormat());

            closeDialog();

            // Reload the view
            renderDashboardDetailView({ id: dashboard.id });
        } catch (error) {
            console.error('Error adding widget:', error);
            alert(error.message || i18n.t('ERROR_ADDING_WIDGET') || 'Failed to add widget');

            const submitBtn = form.querySelector('[type="submit"]');
            submitBtn.disabled = false;
            submitBtn.textContent = i18n.t('ADD') || 'Add';
        }
    };

    dialog.appendChild(form);
    document.body.appendChild(dialog);
}

/**
 * Delete widget with confirmation
 */
async function deleteWidget(widget, section, dashboard) {
    const confirmed = confirm(
        i18n.t('CONFIRM_DELETE_WIDGET') ||
        'Are you sure you want to delete this widget?'
    );

    if (!confirmed) return;

    try {
        // Remove widget from dashboard config
        dashboard.removeWidget(section.id, widget.id);

        // Update dashboard via API
        await apiClient.updateDashboard(dashboard.id, dashboard.toApiFormat());

        // Reload the view
        renderDashboardDetailView({ id: dashboard.id });
    } catch (error) {
        console.error('Error deleting widget:', error);
        alert(error.message || i18n.t('ERROR_DELETING_WIDGET') || 'Failed to delete widget');
    }
}