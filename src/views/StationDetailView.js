import {viewManager} from "../lib/ViewManager.js";
import {i18n} from "../i18n/i18n.js";
import {apiClient} from "../lib/ApiClient.js";
import {dateFormatter} from "../lib/DateFormatter.js";
import {MetricReader} from "../lib/MetricReader.js";
import {SensorGroup} from "../components/SensorGroup.js";
import {SENSOR_TYPES, SENSOR_GROUPS} from "../config/sensor_types.js";
import {StationStatus, STATUS_ACTIVE, STATUS_DELAYED, STATUS_OFFLINE} from "../components/StationStatus.js";
import {uiConfigManager} from "../lib/UiConfigManager.js";

/**
 * Group sensors by location
 * @param {Array} sensors - Array of SensorData objects
 * @returns {Object} Grouped sensors by location
 */
function groupSensorsByLocation(sensors) {
    return sensors.reduce((groups, sensor) => {
        if (!sensor.enabled) {
            return groups;
        }
        const location = sensor.location || 'Unknown';
        if (!groups[location]) {
            groups[location] = [];
        }
        groups[location].push(sensor);
        return groups;
    }, {});
}

/**
 * Sort sensors within a group by predefined type order
 * @param {Array} sensors - Array of SensorData objects
 * @returns {Array} Sorted sensors
 */
function sortSensorsByTypeOrder(sensors) {
    return sensors.sort((a, b) => {
        const indexA = SENSOR_TYPES.findIndex(type => type.name === a.sensorType);
        const indexB = SENSOR_TYPES.findIndex(type => type.name === b.sensorType);

        // If type not in order list, put it at the end
        const orderA = indexA === -1 ? SENSOR_TYPES.length : indexA;
        const orderB = indexB === -1 ? SENSOR_TYPES.length : indexB;

        return orderA - orderB;
    });
}

/**
 * Get sensors grouped by category
 * @param {Array} sensors - Array of SensorData objects
 * @param {Array} latestData - Array of ReadingData objects
 * @returns {Object} Grouped sensors by category
 */
function getSensorsByCategory(sensors, latestData) {
    const grouped = {};

    Object.entries(SENSOR_GROUPS).forEach(([key, config]) => {
        grouped[key] = {
            ...config,
            sensors: []
        };

        config.types.forEach(sensorType => {
            /** @type {SensorData} */
            const sensor = sensors.find(s => s.sensorType === sensorType);
            if (sensor && sensor.enabled) {
                const reading = latestData.find(r => r.sensorId === sensor.id);
                if (reading) {
                    const sensorConfig = SENSOR_TYPES.find(t => t.name === sensorType);
                    grouped[key].sensors.push({
                        label: sensorConfig?.title || sensor.getDisplayName(),
                        value: uiConfigManager.convert(reading.value, sensorConfig.unitType) + ' ' + uiConfigManager.getUnitLabel(sensorConfig.unitType),
                        unit: sensor.unit || '',
                        type: sensorType
                    });
                }
            }
        });
    });

    // Filter out empty groups
    return Object.fromEntries(
        Object.entries(grouped).filter(([_, group]) => group.sensors.length > 0)
    );
}

/**
 * Main render function for StationDetailView
 */
export async function renderStationDetailView(params) {
    viewManager.showLoading('Loading station...');

    const {id} = params;

    try {
        const station = await apiClient.getStation(id);

        if (!station) {
            viewManager.showError(i18n.t('STATION_NOT_FOUND') || 'Station not found');
            return;
        }

        const hasData = station.latestData !== null && station.latestData.length > 0;

        if (!hasData) {
            viewManager.showError(i18n.t('STATION_NO_DATA') || 'Station has no data available');
            return;
        }

        const metricReader = new MetricReader(station.sensors, station.latestData);

        const container = document.createElement('div');
        container.className = 'page-container';

        // Header Section
        container.innerHTML = `
            <div class="page-header">
                <div>
                    <h1 class="page-header">${station.getDisplayName()}</h1>
                    <p>${i18n.t('LAST_UPDATE') || 'Last Update'}: ${hasData ? dateFormatter.formatDateTime(new Date(station.latestData[0].dateUTC)) : 'N/A'}</p>
                </div>
                <div class="station-status-section page-actions"></div>
            </div>
        `;

        const status = station.isActive() ? STATUS_ACTIVE : hasData ? STATUS_DELAYED : STATUS_OFFLINE;
        const statusElement = new StationStatus();
        statusElement.status = status;
        container.querySelector('.station-status-section').appendChild(statusElement);

        // Group and sort sensors
        const groupedSensors = groupSensorsByLocation(station.sensors);

        // Render sensor sections
        Object.entries(groupedSensors).forEach(([location, sensors]) => {
            const sortedSensors = sortSensorsByTypeOrder(sensors);

            // Create section for location
            const section = document.createElement('div');
            section.className = 'dashboard-section';

            // Section header
            const header = document.createElement('div');
            header.className = 'section-header';

            const title = document.createElement('h2');
            title.textContent = location;
            header.appendChild(title);

            section.appendChild(header);

            // Sensors grid
            const sensorsGrid = document.createElement('div');
            sensorsGrid.className = 'widgets-grid';

            // Render widgets for each sensor
            sortedSensors.forEach(sensor => {
                const widget = metricReader.createComponent(sensor);
                if (widget) {
                    sensorsGrid.appendChild(widget);
                }
            });

            section.appendChild(sensorsGrid);

            // ============================================================================
            // SENSOR GROUPS (Tabular View)
            // ============================================================================
            const sensorsByCategory = getSensorsByCategory(sensors, station.latestData);

            if (Object.keys(sensorsByCategory).length > 0) {
                const groupsGrid = document.createElement('div');
                groupsGrid.className = 'widgets-grid';

                Object.values(sensorsByCategory).forEach(groupConfig => {
                    const groupWidget = new SensorGroup();
                    groupWidget.title = groupConfig.title;
                    groupWidget.icon = groupConfig.icon;
                    groupWidget.iconColor = groupConfig.iconColor;
                    groupWidget.sensors = groupConfig.sensors;

                    groupsGrid.appendChild(groupWidget);
                });

                section.appendChild(groupsGrid);
            }

            container.appendChild(section);
        });

        viewManager.render(container);
    } catch (error) {
        console.error('Error rendering station detail view', error);
        viewManager.showError(error.message);
    }
}