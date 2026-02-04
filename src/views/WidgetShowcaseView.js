import {viewManager} from "../lib/ViewManager.js";
import {showcaseWidgets} from "../config/showcase.js";
import {SimpleMetricCard} from "../components/SimpleMetricCard.js";
import {CO2} from "../components/metric/CO2.js";
import {Noise} from "../components/metric/Noise.js";
import {Solar} from "../components/metric/Solar.js";
import {WindSpeed} from "../components/metric/WindSpeed.js";
import {WindRose} from "../components/metric/WindRose.js";
import {Rain} from "../components/metric/Rain.js";
import {Temperature} from "../components/metric/Temperature.js";
import {Humidity} from "../components/metric/Humidity.js";
import {Pressure} from "../components/metric/Pressure.js";
import {SensorGroup} from "../components/SensorGroup.js";
import {Chart} from "../components/Chart.js";

/**
 * Widget Showcase View - Display all widgets with live property editing
 * Uses Lit web components for reactive updates
 */
export class WidgetShowcaseView {
    constructor(container) {
        this.container = container;
        this.widgetInstances = new Map();
        this.widgetConfigs = showcaseWidgets;
    }

    render() {
        this.container.innerHTML = `
            <div class="widget-showcase-view min-h-screen bg-slate-900 p-6">
                <div class="max-w-7xl mx-auto">
                    <!-- Header -->
                    <div class="mb-8">
                        <h1 class="text-4xl font-bold text-white mb-2">Widget Showcase</h1>
                        <p class="text-slate-400">Edit widget properties and see live preview</p>
                    </div>

                    <!-- Widgets Grid -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6" id="widgets-grid">
                        ${Object.entries(this.widgetConfigs).map(([key, config]) => `
                              <div class="widget-card-container bg-slate-800 rounded-lg overflow-hidden flex flex-col h-full" data-widget-type="${key}">
                                <!-- Widget Header -->
                                <div class="bg-slate-700 px-4 py-3 border-b border-slate-600">
                                    <h3 class="text-lg font-semibold text-white">${config.name}</h3>
                                    <p class="text-xs text-slate-400 mt-1">${key}</p>
                                </div>

                                <!-- Preview Section -->
                                <div class="preview-section bg-slate-900 p-4 min-h-64 border-b border-slate-700">
                                    <div id="widget-preview-${key}"></div>
                                </div>

                                <!-- Properties Section -->
                                <div class="properties-section p-4 max-h-96 overflow-y-auto">
                                    <div class="space-y-3" id="properties-${key}">
                                        ${config.properties.map(prop => `
                                            <div class="property-input-group">
                                                <label class="block text-xs font-medium text-slate-300 mb-1">${prop.label}</label>
                                                ${this.renderPropertyInput(key, prop)}
                                            </div>
                                        `).join('')}
                                    </div>
                                    
                                    <button class="reset-button w-full mt-4 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-xs font-medium" 
                                            data-widget-type="${key}">
                                        Reset to Default
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        // Initialize widgets and attach listeners
        this.initializeWidgets();
        this.attachEventListeners();
    }

    initializeWidgets() {
        Object.entries(this.widgetConfigs).forEach(([key, config]) => {
            const previewContainer = this.container.querySelector(`#widget-preview-${key}`);
            if (!previewContainer) return;

            const widgetElement = this.createWidgetElement(key, config.defaultData);
            previewContainer.appendChild(widgetElement);
            this.widgetInstances.set(key, widgetElement);
        });
    }

    createWidgetElement(widgetType, data) {
        let element;

        switch (widgetType) {
            case 'simple-metric-card':
                element = new SimpleMetricCard();
                element.icon = data.icon;
                element.label = data.label;
                element.value = data.value;
                element.unit = data.unit;
                element.status = data.status;
                element.statusColor = data.statusColor;
                break;

            case 'co2-level':
                element = new CO2();
                element.co2Level = data.co2Level;
                element.unit = data.unit;
                break;

            case 'noise-level':
                element = new Noise();
                element.noiseLevel = data.noiseLevel;
                element.noiseCategory = data.noiseCategory;
                element.unit = data.unit;
                break;

            case 'solar-radiation':
                element = new Solar();
                element.solarRadiation = data.solarRadiation;
                element.uvIndex = data.uvIndex;
                element.unit = data.unit;
                break;

            case 'wind-gauge':
                element = new WindSpeed();
                element.gust = data.gust;
                element.direction = data.direction;
                element.speed = data.speed;
                element.unit = data.unit;
                break;

            case 'wind-rose':
                element = new WindRose();
                element.windSpeed = data.windSpeed;
                element.windDirection = data.windDirection;
                element.windUnit = data.windUnit;
                element.windDirectionLabel = data.windDirectionLabel;
                element.windGust = data.windGust;
                element.windCategory = data.windCategory;
                break;

            case 'rain-gauge':
                element = new Rain();
                element.dailyRain = data.dailyRain;
                element.weeklyRain = data.hourlyRain;
                element.unit = data.unit;
                break;

            case 'thermometer':
                element = new Temperature();
                element.outdoorTemp = data.outdoorTemp;
                element.indoorTemp = data.indoorTemp;
                element.unit = data.unit;
                element.minTemp = data.minTemp;
                element.maxTemp = data.maxTemp;
                break;

            case 'humidity':
                element = new Humidity();
                element.label = data.label;
                element.humidity = data.humidity;
                break;

            case 'pressure':
                element = new Pressure();
                element.label = data.label;
                element.pressure = data.pressure;
                break;

            case 'sensor-group':
                element = new SensorGroup();
                element.title = data.title;
                element.icon = data.icon;
                element.iconColor = data.iconColor;
                element.sensors = data.sensors;
                break;

            case 'chart':
                element = new Chart();
                element.title = data.title;
                element.subtitle = data.subtitle;
                element.chartType = data.type;
                element.labels = data.labels;
                element.data = data.data;
                element.colorDot = this.getColorDot(data.color);
                element.timeRanges = ['7D', '30D', '90D'];
                element.activeTimeRange = '7D';
                element.stats = {
                    min: `${Math.min(...data.data)}${data.unit}`,
                    avg: `${(data.data.reduce((a, b) => a + b) / data.data.length).toFixed(1)}${data.unit}`,
                    max: `${Math.max(...data.data)}${data.unit}`
                };
                break;

            default:
                console.warn(`Unknown widget type: ${widgetType}`);
                return null;
        }

        return element;
    }

    getColorDot(colorName) {
        const colorMap = {
            'blue': 'rgb(59, 130, 246)',
            'green': 'rgb(34, 197, 94)',
            'red': 'rgb(239, 68, 68)',
            'amber': 'rgb(251, 191, 36)',
            'cyan': 'rgb(34, 211, 238)',
            'purple': 'rgb(168, 85, 247)'
        };
        return colorMap[colorName] || colorMap['blue'];
    }

    renderPropertyInput(widgetType, property) {
        const {key, type, label, options, min, max, step} = property;

        if (type === 'text') {
            return `
                <input type="text" 
                       class="property-input w-full px-2 py-1.5 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-blue-500" 
                       data-widget-type="${widgetType}" 
                       data-property="${key}" 
                       placeholder="${label}">
            `;
        } else if (type === 'number') {
            return `
                <input type="number" 
                       class="property-input w-full px-2 py-1.5 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-blue-500" 
                       data-widget-type="${widgetType}" 
                       data-property="${key}" 
                       ${min !== undefined ? `min="${min}"` : ''} 
                       ${max !== undefined ? `max="${max}"` : ''} 
                       ${step !== undefined ? `step="${step}"` : ''}>
            `;
        } else if (type === 'color') {
            return `
                <input type="color" 
                       class="property-input w-full h-10 px-2 py-1 bg-slate-700 border border-slate-600 rounded cursor-pointer" 
                       data-widget-type="${widgetType}" 
                       data-property="${key}">
            `;
        } else if (type === 'select') {
            return `
                <select class="property-input w-full px-2 py-1.5 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-blue-500" 
                        data-widget-type="${widgetType}" 
                        data-property="${key}">
                    ${options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                </select>
            `;
        }

        return '';
    }

    attachEventListeners() {
        // Property input listeners
        this.container.querySelectorAll('.property-input').forEach(input => {
            input.addEventListener('change', (e) => this.handlePropertyChange(e));
            input.addEventListener('input', (e) => this.handlePropertyChange(e));
        });

        // Reset button listeners
        this.container.querySelectorAll('.reset-button').forEach(button => {
            button.addEventListener('click', (e) => this.handleReset(e));
        });

        // Populate inputs with default values
        this.populateDefaultValues();
    }

    populateDefaultValues() {
        Object.entries(this.widgetConfigs).forEach(([widgetType, config]) => {
            config.properties.forEach(prop => {
                const input = this.container.querySelector(
                    `[data-widget-type="${widgetType}"][data-property="${prop.key}"]`
                );

                if (input && config.defaultData.hasOwnProperty(prop.key)) {
                    const value = config.defaultData[prop.key];

                    // Handle different value types
                    if (Array.isArray(value)) {
                        // Skip array values (like sensors)
                        return;
                    }

                    input.value = value;
                }
            });
        });
    }

    handlePropertyChange(event) {
        const input = event.target;
        const widgetType = input.dataset.widgetType;
        const propertyKey = input.dataset.property;
        let value = input.value;

        // Parse value based on input type
        if (input.type === 'number') {
            value = parseFloat(value);
        }

        // Update widget instance
        const widget = this.widgetInstances.get(widgetType);
        if (widget) {
            widget[propertyKey] = value;
        }

        // Update config for reset functionality
        if (this.widgetConfigs[widgetType]) {
            this.widgetConfigs[widgetType].defaultData[propertyKey] = value;
        }
    }

    handleReset(event) {
        const button = event.target;
        const widgetType = button.dataset.widgetType;
        const config = this.widgetConfigs[widgetType];

        if (!config) return;

        // Reset all inputs to original default values
        this.container.querySelectorAll(`[data-widget-type="${widgetType}"]`).forEach(input => {
            const propertyKey = input.dataset.property;
            if (config.defaultData.hasOwnProperty(propertyKey)) {
                const defaultValue = config.defaultData[propertyKey];

                // Skip array values
                if (!Array.isArray(defaultValue)) {
                    input.value = defaultValue;
                }
            }
        });

        // Reset widget to original defaults
        const widget = this.widgetInstances.get(widgetType);
        if (widget) {
            Object.entries(config.defaultData).forEach(([key, value]) => {
                if (!Array.isArray(value)) {
                    widget[key] = value;
                }
            });
        }
    }

    destroy() {
        this.widgetInstances.clear();
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}

/**
 * Render function for ViewManager integration
 */
export async function renderWidgetShowcaseView() {
    try {
        viewManager.render(WidgetShowcaseView);
    } catch (error) {
        console.error('Error rendering widget showcase:', error);
        viewManager.showError(error.message);
    }
}