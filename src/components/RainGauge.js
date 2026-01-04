
import { Gauge } from './Gauge.js';

/**
 * Rain gauge with beaker-style visualization
 */
export class RainGauge extends Gauge {
  constructor(options = {}) {
    super(options);
    this.value = options.value || 0;
    this.min = options.min || 0;
    this.max = options.max || 100;
    this.unit = options.unit || 'mm';
    this.label = options.label || 'Rain';
    this.colors = options.colors || [
      { threshold: 0, color: '#DBEFF5' },
      { threshold: 20, color: '#B6DFEB' },
      { threshold: 40, color: '#92CFE1' },
      { threshold: 60, color: '#6DBFD7' },
      { threshold: 80, color: '#49AFCD' }
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

  generateMask() {
    const percentage = this.getPercentage();
    const totalHeight = 140;
    const fillHeight = (totalHeight * percentage) / 100;
    const y = 144 - fillHeight;
    
    return `
      <defs>
        <mask id="${this.id}-water-mask">
          <rect x="0" y="0" width="200" height="200" fill="black"></rect>
          <rect id="${this.id}-water-mask-rect" x="40" y="${y}" width="150" height="${fillHeight}" fill="white"></rect>
        </mask>
      </defs>
    `;
  }

  generateGlass() {
    return `
      <g class="glass">
        <path d="M 170,4 L 170,129 Q 170,149 150,149 L 80,149 Q 60,149 60,129 L 60,4" 
              fill="none" 
              stroke="#888" 
              stroke-width="2"></path>
      </g>
    `;
  }

  generateBands() {
    const bandHeight = 130 / this.colors.length;
    const bands = this.colors.map((colorDef, index) => {
      const reverseIndex = this.colors.length - 1 - index;
      const y = 6 + (reverseIndex * bandHeight);
      return `<rect x="30" y="${y}" width="13" height="${bandHeight}" fill="${colorDef.color}"></rect>`;
    });
    
    return `<g class="band">${bands.join('')}</g>`;
  }

  generateTicks() {
    const ticks = [];
    const numTicks = 6;
    const step = (this.max - this.min) / (numTicks - 1);
    const tickHeight = 140;
    
    for (let i = 0; i < numTicks; i++) {
      const value = this.min + (step * i);
      const y = 146 - (i * (tickHeight / (numTicks - 1)));
      ticks.push(`
        <text class="tick-number" 
              x="20" 
              y="${y}" 
              text-anchor="end" 
              dominant-baseline="middle" 
              fill="#888" 
              font-size="11" 
              font-family="Arial">${value.toFixed(0)}</text>
      `);
    }
    
    return `<g class="ticks" id="${this.id}-ticks">${ticks.join('')}</g>`;
  }

  generateWater() {
    const color = this.getColor();
    return `
      <g class="water" id="${this.id}-water">
        <path d="M 165,6 L 165,127.5 Q 165,144 148.5,144 L 81.5,144 Q 65,144 65,127.5 L 65,6 Z" 
              fill="${color}" 
              mask="url(#${this.id}-water-mask)"></path>
      </g>
    `;
  }

  generateDisplay() {
    return `
      <g class="display" id="${this.id}-display">
        <text class="rain-value-text" 
              x="115" 
              y="183" 
              text-anchor="middle" 
              font-family="Arial" 
              font-size="26.5" 
              fill="#333">${this.value.toFixed(1)} ${this.unit}</text>
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
