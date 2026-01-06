import { CircularGauge } from "./CircularGauge.js";
import { i18n } from "../i18n/i18n.js";

/**
 * Solar Radiation Gauge - shows solar radiation intensity
 * Color changes from dark (night) to bright (sun) based on intensity
 */
export class SolarRadiationGauge extends CircularGauge {
    constructor(options = {}) {
        super(options);
        this.solarRadiation = options.solarRadiation || 0;
        this.value = this.solarRadiation; // Set value for parent class
        this.unit = options.unit || 'W/m²';
        this.max = options.max || 1200; // Max solar radiation
        this.colors = this.getSolarRadiationColors();
    }

    getSolarRadiationColors() {
        // Color gradient from night (dark) to full sun (bright yellow)
        return [
            { threshold: 0, color: '#1a1a2e' },      // Night - very dark blue
            { threshold: 50, color: '#2d3561' },     // Twilight - dark blue
            { threshold: 100, color: '#4a5a8a' },    // Dawn - medium blue
            { threshold: 200, color: '#7b9fd4' },    // Morning - light blue
            { threshold: 400, color: '#f4d03f' },    // Midday - yellow
            { threshold: 600, color: '#f9a825' },    // Bright - orange
            { threshold: 800, color: '#ff8c00' },    // Very bright - dark orange
            { threshold: 1000, color: '#ff6b00' }    // Intense - red-orange
        ];
    }

    getSolarRadiationColor() {
        // Get color based on current solar radiation value
        for (let i = this.colors.length - 1; i >= 0; i--) {
            if (this.solarRadiation >= this.colors[i].threshold) {
                return this.colors[i].color;
            }
        }
        return this.colors[0].color;
    }

    generateDisplay() {
        const centerX = this.width / 2;
        const centerY = this.height / 2;

        return `
            <g class="display" id="${this.id}-display">
                <text class="gauge-units" x="${centerX}" y="${centerY + 38}" 
                      text-anchor="middle" 
                      font-family="Arial" 
                      font-size="12" 
                      fill="#888">${this.unit}</text>
                <text class="value-text" x="${centerX}" y="${centerY + 74}" 
                      text-anchor="middle" 
                      font-family="Arial" 
                      font-size="25" 
                      font-weight="bold"
                      fill="${this.getSolarRadiationColor()}">${this.solarRadiation.toFixed(0)}</text>
            </g>
        `;
    }

    render() {
        return `
            ${this.createSVG()}
                ${this.generateDefs()}
                ${this.generatePlate()}
                ${this.generateBands()}
                ${this.generateTicks()}
                ${this.generateDisplay()}
                ${this.generateNeedle()}
            ${this.closeSVG()}
        `;
    }
}