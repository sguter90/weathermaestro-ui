import { Gauge } from './Gauge.js';

/**
 * Thermometer-style gauge for temperature
 */
export class TemperatureGauge extends Gauge {
  constructor(options = {}) {
    super(options);
    this.value = options.value || 0;
    this.min = options.min || -40;
    this.max = options.max || 60;
    this.unit = options.unit || '°C';
    this.colors = options.colors || [
      { threshold: -20, color: '#49AFCD' },
      { threshold: 0, color: '#7FC3DD' },
      { threshold: 20, color: '#D3B9BE' },
      { threshold: 40, color: '#DA7777' },
      { threshold: 60, color: '#C83333' }
    ];
  }

  getPercentage() {
    const range = this.max - this.min;
    const valueInRange = Math.max(this.min, Math.min(this.max, this.value)) - this.min;
    return (valueInRange / range) * 100;
  }

  getColor() {
    for (let i = this.colors.length - 1; i >= 0; i--) {
      if (this.value >= this.colors[i].threshold) {
        return this.colors[i].color;
      }
    }
    return this.colors[0].color;
  }

  generateBands() {
    const bandHeight = 140 / this.colors.length;
    const bands = this.colors.map((colorDef, index) => {
      const reverseIndex = this.colors.length - 1 - index;
      const y = 8 + (reverseIndex * bandHeight);
      return `<rect x="70" y="${y}" width="13" height="${bandHeight}" fill="${colorDef.color}"></rect>`;
    });
    
    return `<g class="band">${bands.join('')}</g>`;
  }

  generateTicks() {
    const ticks = [];
    const step = (this.max - this.min) / 5;
    
    for (let i = 0; i <= 5; i++) {
      const value = this.min + (step * i);
      const y = 150 - (i * 28);
      ticks.push(`<text x="60" y="${y}" text-anchor="end" fill="#888" font-size="11" font-family="Arial">${value.toFixed(0)}</text>`);
    }
    
    return `<g class="ticks" id="${this.id}-ticks">${ticks.join('')}</g>`;
  }

  generateMask() {
    const percentage = this.getPercentage();
    const fillHeight = (140 * percentage) / 100;
    const y = 150 - fillHeight + 48;
    
    return `
      <defs>
        <mask id="${this.id}-mask">
          <rect x="0" y="0" width="200" height="200" fill="black"></rect>
          <rect id="${this.id}-mask-rect" x="100" y="${y}" width="80" height="${fillHeight + 48}" fill="white"></rect>
        </mask>
      </defs>
    `;
  }

  generateGlass() {
    return `
      <g class="glass">
        <path d="M 155 150 A 28.2842712474619 28.2842712474619 0 1 1 115 150 L 115 22 Q 115 2, 135 2 L 135 2 Q 155 2, 155 22 Z" 
              stroke="#888" stroke-width="2" fill="none"></path>
      </g>
    `;
  }

  generateWater() {
    const color = this.getColor();
    return `
      <g class="water" id="${this.id}-water">
        <path d="M 150 152 A 23.33452377915607 23.33452377915607 0 1 1 120 152 L 120 26 Q 119 4, 140 7.5 L 130 7.5 Q 151 4, 150 26 Z" 
              fill="${color}" mask="url(#${this.id}-mask)"></path>
      </g>
    `;
  }

  generateDisplay() {
    return `
      <g class="display" id="${this.id}-display">
        <text class="temp-value-text" x="54" y="186" text-anchor="middle" font-family="Arial" font-size="25" fill="#333">
          ${this.value.toFixed(1)} ${this.unit}
        </text>
      </g>
    `;
  }

  render() {
    return `
      ${this.createSVG()}
        ${this.generateMask()}
        ${this.generateGlass()}
        ${this.generateBands()}
        ${this.generateTicks()}
        ${this.generateDisplay()}
        ${this.generateWater()}
      ${this.closeSVG()}
    `;
  }
}
