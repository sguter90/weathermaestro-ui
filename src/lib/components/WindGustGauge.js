import { CircularGauge } from "./CircularGauge.js";
import { i18n } from "../i18n/i18n.js";

/**
 * Wind Gust Gauge - shows current gust and max daily gust
 * Color changes based on wind speed intensity
 */
export class WindGustGauge extends CircularGauge {
    constructor(options = {}) {
        super(options);
        this.currentGust = options.currentGust || 0;
        this.maxDailyGust = options.maxDailyGust || 0;
        this.value = this.currentGust; // Set value for parent class
        this.unit = options.unit || 'km/h';
        this.colors = this.getWindGustColors();
    }

    getWindGustColors() {
        // Beaufort scale inspired color bands for wind gust
        return [
            { threshold: 0, color: '#3498DB' },      // Light breeze - blue
            { threshold: 12, color: '#2ECC71' },     // Gentle breeze - green
            { threshold: 20, color: '#F39C12' },     // Moderate breeze - orange
            { threshold: 29, color: '#E67E22' },     // Fresh breeze - dark orange
            { threshold: 39, color: '#E74C3C' },     // Strong breeze - red
            { threshold: 50, color: '#C0392B' }      // Gale - dark red
        ];
    }

    getGustColor() {
        // Get color based on current gust value
        for (let i = this.colors.length - 1; i >= 0; i--) {
            if (this.currentGust >= this.colors[i].threshold) {
                return this.colors[i].color;
            }
        }
        return this.colors[0].color;
    }

    generateDisplay() {
        const centerX = this.width / 2;
        const centerY = this.height / 6 * 4;

        return `
            <g class="display" id="${this.id}-display">
                <text class="value-text" x="${centerX}" y="${centerY + 10}" 
                      text-anchor="middle" 
                      font-family="Arial" 
                      font-size="22" 
                      font-weight="bold"
                      fill="${this.getGustColor()}">${this.currentGust.toFixed(1)}</text>
                <text class="gauge-units" x="${centerX}" y="${centerY + 25}" 
                      text-anchor="middle" 
                      font-family="Arial" 
                      font-size="10" 
                      fill="#888">${this.unit}</text>
                <text class="max-daily" x="${centerX}" y="${centerY + 42}" 
                      text-anchor="middle" 
                      font-family="Arial" 
                      font-size="9" 
                      fill="#999">${i18n.t('MAX_DAILY_GUST')}: ${this.maxDailyGust.toFixed(1)}</text>
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
