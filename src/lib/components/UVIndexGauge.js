import { Gauge } from './Gauge.js';
import { Weather } from '../Weather.js';

/**
 * UV Index gauge with color-coded bands
 */
export class UVIndexGauge extends Gauge {
  constructor(options = {}) {
    super(options);
    this.value = options.value || 0;
    this.min = 0;
    this.max = 12;
    this.unit = options.unit || '';
    this.label = options.label || 'UV Index';
    this.startAngle = -135;  // For drawing the scale/bands
    this.endAngle = 135;     // For drawing the scale/bands
    this.needleOffset = 180; // Offset between scale angles and needle rotation
    this.colors = this.getUVColors();
  }

  getUVColors() {
    return [
      { threshold: 0, color: '#20A120', label: '' },      // Low (0-2)
      { threshold: 1, color: '#67B715', label: '' },
      { threshold: 2, color: '#AFCD0A', label: '' },
      { threshold: 3, color: '#F7E400', label: '3' },     // Moderate (3-5)
      { threshold: 4, color: '#F9BA0D', label: '' },
      { threshold: 5, color: '#FB911A', label: '' },
      { threshold: 6, color: '#FD6828', label: '6' },     // High (6-7)
      { threshold: 7, color: '#DC3414', label: '' },
      { threshold: 8, color: '#BB0000', label: '8' },     // Very High (8-10)
      { threshold: 9, color: '#A01842', label: '' },
      { threshold: 10, color: '#853085', label: '' },
      { threshold: 11, color: '#6B49C8', label: '11+' }   // Extreme (11+)
    ];
  }

  getAngle() {
    const valueRange = this.max - this.min;
    const angleRange = this.endAngle - this.startAngle;
    const valueInRange = Math.max(this.min, Math.min(this.max, this.value)) - this.min;
    const percentage = valueInRange / valueRange;
    const angle = angleRange * percentage;

    return this.startAngle + angle + this.needleOffset;
  }

  generateDefs() {
    return `
      <defs>
        <mask id="${this.id}-needle-mask">
          <rect x="-105" y="-105" width="210" height="210" fill="white"></rect>
          <circle r="12.6" fill="black"></circle>
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
    const radius = 97.65;

    return `
      <g class="plate">
        <circle class="outer-stroke" cx="${centerX}" cy="${centerY}" r="${radius}"></circle>
      </g>
    `;
  }

  generateBands() {
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    const outerRadius = 90.3;
    const innerRadius = 74.55;
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
    const radius = 57.75;
    const ticks = [];
    const angleRange = this.endAngle - this.startAngle;

    // Generate tick for each UV level (0-12)
    for (let i = 0; i <= this.max; i++) {
      const angle = this.startAngle + (angleRange * i / this.max);
      const pos = this.polarToCartesian(centerX, centerY, radius, angle);
      
      // Find the label for this tick
      const colorEntry = this.colors.find(c => c.threshold === i);
      const label = colorEntry ? colorEntry.label : '';

      ticks.push(`
        <text x="${pos.x}" y="${pos.y}" 
              text-anchor="middle" 
              alignment-baseline="middle" 
              font-family="Arial" 
              font-size="11" 
              fill="#888">${label}</text>
      `);
    }

    return `<g class="ticks" id="${this.id}-ticks">${ticks.join('')}</g>`;
  }

  generateDisplay() {
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    const uvCategory = Weather.getUVCategoryLabel(this.value);

    return `
      <g class="display" id="${this.id}-display">
        <text class="gauge-units" x="${centerX}" y="${centerY + 38}" 
              text-anchor="middle" 
              font-family="Arial" 
              font-size="12" 
              fill="#888">${uvCategory}</text>
        <text class="value-text" x="${centerX}" y="${centerY + 74}" 
              text-anchor="middle" 
              font-family="Arial" 
              font-size="25" 
              font-weight="bold"
              fill="#333">${this.value.toFixed(1)}</text>
      </g>
    `;
  }

  generateNeedle() {
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    const angle = this.getAngle();

    return `
      <g class="needle" id="${this.id}-needle">
        <path d="M-4.2,-21L-6.3,0L0,80.85L6.3,0L4.2,-21Z" 
              fill="url(#${this.id}-needle-gradient)" 
              transform="translate(${centerX}, ${centerY}) rotate(${angle})" 
              mask="url(#${this.id}-needle-mask)"></path>
        <circle cx="${centerX}" cy="${centerY}" r="12.6" 
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
