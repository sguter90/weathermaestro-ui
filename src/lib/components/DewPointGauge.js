import {Gauge} from "./Gauge.js";
import {Weather} from "../Weather.js";

/**
 * Dew point gauge display component
 */
export class DewPointGauge extends Gauge {
    constructor(options = {}) {
        super(options);
        this.value = options.value || 0;
        this.min = options.min || -40;
        this.max = options.max || 40;
        this.unit = options.unit || '°C';
    }

    getColor() {
        // Color coding based on dew point
        // Low dew point = dry (blue)
        // High dew point = humid (red)
        if (this.value < -10) return '#1E88E5';      // Very dry - Blue
        if (this.value < 0) return '#42A5F5';        // Dry - Light blue
        if (this.value < 10) return '#66BB6A';       // Comfortable - Green
        if (this.value < 15) return '#FDD835';       // Humid - Yellow
        if (this.value < 20) return '#FB8C00';       // Very humid - Orange
        return '#E53935';                            // Extremely humid - Red
    }

    generateDefs() {
        return `
            <defs>
                <style>
                    .dewpoint-label { font-family: Arial; font-size: 12px; fill: #666; }
                    .dewpoint-value { font-family: Arial; font-size: 18px; font-weight: bold; fill: ${this.getColor()}; }
                </style>
                <linearGradient id="${this.id}-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#1E88E5"></stop>
                    <stop offset="25%" stop-color="#42A5F5"></stop>
                    <stop offset="50%" stop-color="#66BB6A"></stop>
                    <stop offset="75%" stop-color="#FB8C00"></stop>
                    <stop offset="100%" stop-color="#E53935"></stop>
                </linearGradient>
            </defs>
        `;
    }

    render() {
        const percentage = ((this.value - this.min) / (this.max - this.min)) * 100;
        const clampedPercentage = Math.max(0, Math.min(100, percentage));

        return `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200" class="gauge">
                ${this.generateDefs()}
                
                <!-- Background circle -->
                <circle cx="100" cy="100" r="90" fill="none" stroke="#e0e0e0" stroke-width="8"></circle>
                
                <!-- Gradient circle (progress) -->
                <circle cx="100" cy="100" r="90" fill="none" stroke="url(#${this.id}-gradient)" stroke-width="8"
                        stroke-dasharray="${(clampedPercentage / 100) * 565.48} 565.48"
                        stroke-linecap="round" transform="rotate(-90 100 100)"></circle>
                
                <!-- Value in center -->
                <text x="100" y="90" text-anchor="middle" class="dewpoint-value">${this.value.toFixed(1)}</text>
                <text x="100" y="110" text-anchor="middle" class="dewpoint-label">${this.unit}</text>
                
                <!-- Description -->
                <text x="100" y="160" text-anchor="middle" class="dewpoint-label" font-size="10">
                    ${this.getDewPointDescription()}
                </text>
            </svg>
        `;
    }

    getDewPointDescription() {
        return Weather.getDewPointLabel(this.value)
    }
}
