import { Gauge } from "./Gauge.js";

/**
 * Wind direction compass with speed indicator
 */
export class WindCompass extends Gauge {
    constructor(options = {}) {
        super(options);
        this.direction = options.direction || 0; // 0-360 degrees
        this.speed = options.speed || 0;
        this.unit = options.unit || 'km/h';
        this.color = options.color || '#4CAF50';
        this.needleOffset = 0; // Offset for SVG coordinate system
    }

    getDirectionLabel() {
        const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 
                          'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
        const index = Math.round(this.direction / 22.5) % 16;
        return directions[index];
    }

    getSpeedColor() {
        // Beaufort scale inspired colors
        if (this.speed < 1) return '#95A5A6';      // Calm
        if (this.speed < 12) return '#3498DB';     // Light breeze
        if (this.speed < 20) return '#2ECC71';     // Gentle breeze
        if (this.speed < 29) return '#F39C12';     // Moderate breeze
        if (this.speed < 39) return '#E67E22';     // Fresh breeze
        if (this.speed < 50) return '#E74C3C';     // Strong breeze
        return '#C0392B';                          // Gale and above
    }

    getArrowRotation() {
        // Convert compass direction to SVG rotation
        // In compass: 0° = N, 90° = E, 180° = S, 270° = W
        // In SVG: 0° = right, 90° = down, 180° = left, 270° = up
        // We need to add needleOffset to align properly
        return this.direction + this.needleOffset;
    }

    generateDefs() {
        return `
            <defs>
                <style>
                    .outer-stroke { stroke: #8d8d8d; stroke-width: 2; fill: none; }
                    .compass-label { font-family: Arial; font-size: 14px; font-weight: bold; fill: #666; }
                    .compass-label-small { font-family: Arial; font-size: 11px; fill: #888; }
                </style>
                <linearGradient id="${this.id}-arrow-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="${this.getSpeedColor()}"></stop>
                    <stop offset="100%" stop-color="${this.getSpeedColor()}" stop-opacity="0.7"></stop>
                </linearGradient>
                <filter id="${this.id}-shadow">
                    <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.3"/>
                </filter>
            </defs>
        `;
    }

    generatePlate() {
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        const radius = 93;

        return `
            <g class="plate">
                <circle class="outer-stroke" cx="${centerX}" cy="${centerY}" r="${radius}"></circle>
            </g>
        `;
    }

    generateSpeedBands() {
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        const outerRadius = 86;
        const innerRadius = 71;
        
        // Cardinal direction bands (N, E, S, W) - rotated 45° to be between directions
        const bands = [
            { start: -45, end: 45, color: '#64B5F6' },      // Around N - medium blue
            { start: 45, end: 135, color: '#FFB74D' },      // Around E - medium orange
            { start: 135, end: 225, color: '#fa4d4d' },     // Around S - medium purple
            { start: 225, end: 315, color: '#81C784' }      // Around W - medium green
        ];

        const segments = [];

        for (let i = 0; i < bands.length; i++) {
            const startAngle = bands[i].start;
            const endAngle = bands[i].end;

            const outerStart = this.polarToCartesian(0, 0, outerRadius, endAngle);
            const outerEnd = this.polarToCartesian(0, 0, outerRadius, startAngle);
            const innerStart = this.polarToCartesian(0, 0, innerRadius, endAngle);
            const innerEnd = this.polarToCartesian(0, 0, innerRadius, startAngle);

            const largeArcFlag = "0"; // Always 90° segments

            const path = [
                "M", outerStart.x, outerStart.y,
                "A", outerRadius, outerRadius, 0, largeArcFlag, 0, outerEnd.x, outerEnd.y,
                "L", innerEnd.x, innerEnd.y,
                "A", innerRadius, innerRadius, 0, largeArcFlag, 1, innerStart.x, innerStart.y,
                "Z"
            ].join(" ");

            segments.push(`<path d="${path}" fill="${bands[i].color}" opacity="0.6" transform="translate(${centerX},${centerY})"></path>`);
        }

        return `<g class="direction-bands">${segments.join('')}</g>`;
    }

    generateCompassRose() {
        const centerX = this.width / 2;
        const centerY = this.height / 2;

        const mainDirections = [
            { label: 'N', angle: 0 },
            { label: 'E', angle: 90 },
            { label: 'S', angle: 180 },
            { label: 'W', angle: 270 }
        ];

        const subDirections = [
            { label: 'NE', angle: 45 },
            { label: 'SE', angle: 135 },
            { label: 'SW', angle: 225 },
            { label: 'NW', angle: 315 }
        ];

        const labels = [];

        // Main directions (larger)
        mainDirections.forEach(dir => {
            // Don't subtract 90 - use angle directly for compass positions
            const labelPos = this.polarToCartesian(centerX, centerY, 78, dir.angle);
            labels.push(`
                <text x="${labelPos.x}" y="${labelPos.y}" 
                      text-anchor="middle" 
                      dominant-baseline="central"
                      class="compass-label">${dir.label}</text>
            `);
        });

        // Sub directions (smaller)
        subDirections.forEach(dir => {
            // Don't subtract 90 - use angle directly for compass positions
            const labelPos = this.polarToCartesian(centerX, centerY, 60, dir.angle);
            labels.push(`
                <text x="${labelPos.x}" y="${labelPos.y}" 
                      text-anchor="middle" 
                      dominant-baseline="central"
                      class="compass-label-small">${dir.label}</text>
            `);
        });

        // Tick marks
        const subDirectionAngles = subDirections.map(dir => dir.angle);
        const ticks = [];
        for (let i = 0; i < 360; i += 15) {
            if (subDirectionAngles.includes(i)) {
                continue;
            }

            const isMajor = i % 90 === 0;
            const isMinor = i % 45 === 0;
            const innerRadius = isMajor ? 55 : (isMinor ? 58 : 60);
            const outerRadius = 63;

            const inner = this.polarToCartesian(centerX, centerY, innerRadius, i);
            const outer = this.polarToCartesian(centerX, centerY, outerRadius, i);

            ticks.push(`
                <line x1="${inner.x}" y1="${inner.y}" 
                      x2="${outer.x}" y2="${outer.y}" 
                      stroke="#888" 
                      stroke-width="${isMajor ? 2 : 1}"></line>
            `);
        }

        return `
            <g class="compass-rose">
                ${ticks.join('')}
                ${labels.join('')}
            </g>
        `;
    }

    generateWindArrow() {
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        const arrowLength = 45;

        // Arrow pointing in wind direction
        const arrowPath = `
            M 0,-${arrowLength} 
            L -8,-${arrowLength - 15} 
            L -3,-${arrowLength - 15} 
            L -3,0 
            L 3,0 
            L 3,-${arrowLength - 15} 
            L 8,-${arrowLength - 15} 
            Z
        `;

        return `
            <g class="wind-arrow" transform="translate(${centerX}, ${centerY}) rotate(${this.getArrowRotation()})">
                <path d="${arrowPath}" 
                      fill="url(#${this.id}-arrow-gradient)" 
                      filter="url(#${this.id}-shadow)"></path>
            </g>
        `;
    }

    generateCenterDisplay() {
        const centerX = this.width / 2;
        const centerY = this.height / 2;

        return `
            <g class="center-display">
                <circle cx="${centerX}" cy="${centerY}" r="35" 
                        fill="white" 
                        stroke="#ddd" 
                        stroke-width="1"></circle>
                <text x="${centerX}" y="${centerY - 5}" 
                      text-anchor="middle" 
                      font-family="Arial" 
                      font-size="14" 
                      font-weight="bold"
                      fill="${this.getSpeedColor()}">${this.getDirectionLabel()}</text>
                <text x="${centerX}" y="${centerY + 12}" 
                      text-anchor="middle" 
                      font-family="Arial" 
                      font-size="16" 
                      font-weight="bold"
                      fill="#333">${this.speed.toFixed(1)}</text>
                <text x="${centerX}" y="${centerY + 24}" 
                      text-anchor="middle" 
                      font-family="Arial" 
                      font-size="10" 
                      fill="#888">${this.unit}</text>
            </g>
        `;
    }

    render() {
        return `
            ${this.createSVG()}
                ${this.generateDefs()}
                ${this.generatePlate()}
                ${this.generateSpeedBands()}
                ${this.generateCompassRose()}
                ${this.generateWindArrow()}
                ${this.generateCenterDisplay()}
            ${this.closeSVG()}
        `;
    }
}