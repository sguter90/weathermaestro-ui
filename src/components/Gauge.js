/**
 * Base Gauge class for creating SVG gauges
 */
export class Gauge {
  constructor(options = {}) {
    this.width = options.width || 200;
    this.height = options.height || 200;
    this.id = options.id || `gauge-${Math.random().toString(36).substr(2, 9)}`;
  }

  createSVG() {
    return `<svg class="gauge" width="${this.width}" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}">`;
  }

  closeSVG() {
    return '</svg>';
  }

  /**
   * Convert polar coordinates to cartesian
   */
  polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  }
}

