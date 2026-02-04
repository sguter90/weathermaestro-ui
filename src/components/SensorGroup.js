import {css, html} from 'lit';
import {MetricCard} from './MetricCard.js';

/**
 * Sensor Group Widget - Displays a group of related sensors (Indoor/Outdoor)
 * Extends MetricCard with sensor group visualization
 */
export class SensorGroup extends MetricCard {
    static properties = {
        title: {type: String},
        icon: {type: String},
        iconColor: {type: String},
        sensors: {type: Array}
    };

    static styles = [
        ...MetricCard.styles,
        css`
            .sensor-group-container {
                display: flex;
                flex-direction: column;
                gap: 0;
            }

            .sensor-group-header {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin-bottom: 1rem;
            }

            .sensor-group-icon {
                width: 2rem;
                height: 2rem;
                border-radius: 0.5rem;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: rgba(59, 130, 246, 0.2);
            }

            .sensor-group-title {
                font-weight: 600;
                color: white;
                font-size: 1rem;
            }

            .sensors-list {
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
            }

            .sensor-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0.75rem;
                background-color: rgba(30, 41, 59, 0.5);
                border-radius: 0.75rem;
                transition: background-color 0.2s ease;
            }

            .sensor-item:hover {
                background-color: rgba(30, 41, 59, 0.7);
            }

            .sensor-label {
                font-size: 0.875rem;
                color: rgb(203, 213, 225);
            }

            .sensor-value {
                font-size: 1.125rem;
                font-weight: bold;
                font-family: 'Courier New', monospace;
                color: white;
            }

            .sensor-value.temperature {
                color: #f97316;
            }

            .sensor-value.humidity {
                color: #3b82f6;
            }

            .sensor-value.pressure {
                color: #8b5cf6;
            }

            .sensor-value.co2 {
                color: #ef4444;
            }

            .sensor-value.voc {
                color: #f59e0b;
            }

            @keyframes pulse-value {
                0%, 100% {
                    opacity: 1;
                }
                50% {
                    opacity: 0.7;
                }
            }

            .sensor-value.updating {
                animation: pulse-value 0.6s ease-in-out;
            }
        `
    ];

    constructor() {
        super();
        this.title = 'Sensors';
        this.icon = '📊';
        this.iconColor = 'blue';
        this.sensors = [];
    }

    render() {
        return html`
            <div class="metric-card">
                <div class="sensor-group-header">
                    <div class="sensor-group-icon">
                        ${this.icon}
                    </div>
                    <h3 class="sensor-group-title">${this.title}</h3>
                </div>
                <div class="sensors-list">
                    ${this.sensors.map((sensor, index) => this.renderSensorItem(sensor, index))}
                </div>
            </div>
        `;
    }

    /**
     * Render individual sensor item
     * @param {Object} sensor - Sensor data
     * @param {number} index - Sensor index
     * @returns {TemplateResult}
     */
    renderSensorItem(sensor, index) {
        const colorClass = this.getSensorColorClass(sensor.type);

        return html`
            <div class="sensor-item" data-sensor-index="${index}">
                <span class="sensor-label">${sensor.label}</span>
                <span class="sensor-value ${colorClass}">${sensor.value}</span>
            </div>
        `;
    }

    /**
     * Get color class based on sensor type
     * @param {string} type - Sensor type
     * @returns {string}
     */
    getSensorColorClass(type) {
        const colorMap = {
            'temperature': 'temperature',
            'humidity': 'humidity',
            'pressure': 'pressure',
            'co2': 'co2',
            'voc': 'voc'
        };
        return colorMap[type] || '';
    }

    /**
     * Update sensor values
     * @param {Object} newData - New sensor data
     */
    updateSensors(newData) {
        if (newData.sensors) {
            this.sensors = newData.sensors;
        }
        if (newData.title) {
            this.title = newData.title;
        }
        if (newData.icon) {
            this.icon = newData.icon;
        }
    }

    /**
     * Get sensor data by label
     * @param {string} label - Sensor label
     * @returns {Object|null}
     */
    getSensorByLabel(label) {
        return this.sensors.find(sensor => sensor.label === label) || null;
    }

    /**
     * Update a specific sensor value
     * @param {string} label - Sensor label
     * @param {string} value - New value
     */
    updateSensor(label, value) {
        const sensor = this.getSensorByLabel(label);
        if (sensor) {
            sensor.value = value;
            this.requestUpdate();
        }
    }

    /**
     * Add a new sensor to the group
     * @param {Object} sensor - Sensor data {label, value, type}
     */
    addSensor(sensor) {
        this.sensors = [...this.sensors, sensor];
    }

    /**
     * Remove a sensor from the group
     * @param {string} label - Sensor label to remove
     */
    removeSensor(label) {
        this.sensors = this.sensors.filter(s => s.label !== label);
    }

    /**
     * Clear all sensors
     */
    clearSensors() {
        this.sensors = [];
    }
}

customElements.define('sensor-group', SensorGroup);