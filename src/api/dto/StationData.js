/**
 * StationData DTO - Represents a weather station
 */
export class StationData {
  constructor(data = {}) {
    this.id = data.id || '';
    this.passKey = data.pass_key || '';
    this.stationType = data.station_type || '';
    this.model = data.model || '';
    this.freq = data.freq || '';
    this.interval = data.interval || 0;
  }

  /**
   * Get display name for the station
   */
  getDisplayName() {
    return `${this.model} (${this.stationType})`;
  }

  /**
   * Get interval in minutes
   */
  getIntervalMinutes() {
    return Math.floor(this.interval / 60);
  }

  /**
   * Get interval display string
   */
  getIntervalDisplay() {
    const minutes = this.getIntervalMinutes();
    return minutes > 0 ? `${minutes} min` : `${this.interval} sec`;
  }

  /**
   * Check if station is active (has valid configuration)
   */
  isActive() {
    return this.id && this.passKey && this.interval > 0;
  }

  /**
   * Convert to plain object
   */
  toJSON() {
    return { ...this };
  }
}
