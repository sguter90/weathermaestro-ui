import { Gauge } from './Gauge.js';

/**
 * Circular gauge for humidity, pressure, etc.
 */
export class CircularGauge extends Gauge {
  constructor(options = {}) {
    super(options);
    this.value = options.value || 0;
    this.min = options.min || 0;
    this.max = options.max || 100;
    this.unit = options.unit || '%';
    this.label = options.label || '';
    this.color = options.color || '#4CAF50';
    this.startAngle = options.startAngle || -135;
    this.endAngle = options.endAngle || 135;
    this.needleOffset = 180; // Offset between scale angles and needle rotation
    this.colors = options.colors || this.getDefaultColors();
  }

  getDefaultColors() {
    // Default color bands based on gauge type
    if (this.unit === '%') {
      // Humidity colors
      return [
        { threshold: 0, color: '#DBEFF5' },
        { threshold: 20, color: '#B6DFEB' },
        { threshold: 40, color: '#92CFE1' },
        { threshold: 60, color: '#6DBFD7' },
        { threshold: 80, color: '#49AFCD' }
      ];
    } else if (this.unit === 'hPa') {
      // Pressure colors
      return [
        { threshold: 950, color: '#C83333' },
        { threshold: 980, color: '#DA7777' },
        { threshold: 1000, color: '#D3B9BE' },
        { threshold: 1020, color: '#7FC3DD' },
        { threshold: 1040, color: '#49AFCD' }
      ];
    }
    // Default single color
    return [{ threshold: this.min, color: this.color }];
  }

  getAngle() {
    const range = this.max - this.min;
    const valueInRange = Math.max(this.min, Math.min(this.max, this.value)) - this.min;
    const percentage = valueInRange / range;
    const angleRange = this.endAngle - this.startAngle;
    const angle = angleRange * percentage;

    // Convert from scale angle to needle rotation angle
    return this.startAngle + angle + this.needleOffset;
  }

  generateDefs() {
    return `
      <defs>
        <mask id="${this.id}-needle-mask">
          <rect x="-100" y="-100" width="200" height="200" fill="white"></rect>
          <circle r="12" fill="black"></circle>
        </mask>
        <style>.outer-stroke {stroke: #8d8d8d; stroke-width: 2; fill: none;}</style>
        <linearGradient id="${this.id}-needle-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#333"></stop>
          <stop offset="100%" stop-color="#888"></stop>
        </linearGradient>
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

  generateBands() {
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    const outerRadius = 86;
    const innerRadius = 71;
    const angleRange = this.endAngle - this.startAngle;
    const bands = [];

    for (let i = 0; i < this.colors.length; i++) {
      const startThreshold = this.colors[i].threshold;
      const endThreshold = i < this.colors.length - 1 ? this.colors[i + 1].threshold : this.max;

      const startPercent = (startThreshold - this.min) / (this.max - this.min);
      const endPercent = (endThreshold - this.min) / (this.max - this.min);

      const startAngle = this.startAngle + (angleRange * startPercent);
      const endAngle = this.startAngle + (angleRange * endPercent);

      const outerStart = this.polarToCartesian(0, 0, outerRadius, endAngle);
      const outerEnd = this.polarToCartesian(0, 0, outerRadius, startAngle);
      const innerStart = this.polarToCartesian(0, 0, innerRadius, endAngle);
      const innerEnd = this.polarToCartesian(0, 0, innerRadius, startAngle);

      const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

      const path = [
        "M", outerStart.x, outerStart.y,
        "A", outerRadius, outerRadius, 0, largeArcFlag, 0, outerEnd.x, outerEnd.y,
        "L", innerEnd.x, innerEnd.y,
        "A", innerRadius, innerRadius, 0, largeArcFlag, 1, innerStart.x, innerStart.y,
        "Z"
      ].join(" ");

      bands.push(`<path d="${path}" fill="${this.colors[i].color}" transform="translate(${centerX},${centerY})"></path>`);
    }

    return `<g class="band">${bands.join('')}</g>`;
  }

  generateTicks() {
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    const radius = 60;
    const ticks = [];
    const numTicks = this.colors.length + 1;
    const angleRange = this.endAngle - this.startAngle;

    for (let i = 0; i < numTicks; i++) {
      const value = this.min + ((this.max - this.min) * i / (numTicks - 1));
      const angle = this.startAngle + (angleRange * i / (numTicks - 1));
      const pos = this.polarToCartesian(centerX, centerY, radius, angle);

      ticks.push(`
        <text x="${pos.x}" y="${pos.y}" 
              text-anchor="middle" 
              alignment-baseline="middle" 
              font-family="Arial" 
              font-size="11" 
              fill="#888">${value.toFixed(0)}</text>
      `);
    }

    return `<g class="ticks" id="${this.id}-ticks">${ticks.join('')}</g>`;
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
              fill="#333">${this.value.toFixed(0)}</text>
      </g>
    `;
  }

  generateNeedle() {
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    const angle = this.getAngle();

    return `
      <g class="needle" id="${this.id}-needle">
        <path d="M-4,-20L-6,0L0,77L6,0L4,-20Z" 
              fill="url(#${this.id}-needle-gradient)" 
              transform="translate(${centerX}, ${centerY}) rotate(${angle})" 
              mask="url(#${this.id}-needle-mask)"></path>
        <circle cx="${centerX}" cy="${centerY}" r="12" 
                fill="none" 
                stroke="#888" 
                stroke-width="2"></circle>
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