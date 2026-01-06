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
                    .dewpoint-label { font-family: Arial; font-size: 12px; fill: #888; }
                    .dewpoint-value { font-family: Arial; font-size: 25px; font-weight: bold; fill: #333 }
                    .dewpoint-description { font-family: Arial; font-size: 11px; fill: #999; }
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
                <circle cx="100" cy="100" r="83" fill="none" stroke="#e0e0e0" stroke-width="14"></circle>
                
                <!-- Gradient circle (progress) -->
                <circle cx="100" cy="100" r="83" fill="none" stroke="url(#${this.id}-gradient)" stroke-width="14"
                        stroke-dasharray="${(clampedPercentage / 100) * 521.76} 521.76"
                        stroke-linecap="round" transform="rotate(-90 100 100)"></circle>
                
                <!-- Description -->
                <text x="100" y="80" text-anchor="middle" class="dewpoint-description">
                    ${this.getDewPointDescription()}
                </text>
                
                <!-- Value in center -->
                <text x="100" y="110" text-anchor="middle" class="dewpoint-value">${this.value.toFixed(1)}</text>
                <text x="100" y="138" text-anchor="middle" class="dewpoint-label">${this.unit}</text>
            </svg>
        `;
    }

    getDewPointDescription() {
        return Weather.getDewPointLabel(this.value)
    }
}
