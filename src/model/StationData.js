/**
 * StationData DTO - Represents a weather station
 */
export class StationData {
  constructor(data = {}) {
    this.id = data.id || '';
    this.passKey = data.pass_key || '';
    this.stationType = data.station_type || '';
    this.model = data.model || '';
    this.totalReadings = data.total_readings || 0;
    this.firstReading = data.first_reading ? new Date(data.first_reading) : null;
    this.lastReading = data.last_reading ? new Date(data.last_reading) : null;

    // Latest data will be loaded separately via API
    this.latestData = []; // Array of ReadingData objects
    this.sensors = []; // Array of SensorData objects
  }

  /**
   * Get display name for the station
   */
  getDisplayName() {
    return `${this.model} (${this.stationType})`;
  }

  /**
   * Check if station is active (has recent data)
   * Station is considered active if last reading is within 20 minutes
   */
  isActive() {
    if (!this.lastReading) {
      return false;
    }

    const now = new Date();
    const offset = new Date(now.getTime() - (20*60*1000));

    return this.lastReading > offset;
  }

  /**
   * Get time since last reading in human-readable format
   */
  getTimeSinceLastReading() {
    if (!this.lastReading) {
      return 'Never';
    }

    const now = new Date();
    const diffMs = now - this.lastReading;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  }

  /**
   * Get station uptime (time between first and last reading)
   */
  getUptime() {
    if (!this.firstReading || !this.lastReading) {
      return 'Unknown';
    }

    const diffMs = this.lastReading - this.firstReading;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 1) return 'Less than a day';
    if (diffDays === 1) return '1 day';
    return `${diffDays} days`;
  }

  /**
   * Set latest readings data
   * @param {ReadingData[]} readings - Array of ReadingData objects
   */
  setLatestData(readings) {
    this.latestData = readings;
  }

  /**
   * Check if station has latest data loaded
   */
  hasLatestData() {
    return this.latestData !== null && this.latestData.length > 0;
  }

  /**
   * Set latest readings data
   * @param {SensorData[]} sensors - Array of SensorData objects
   */
  setSensors(sensors) {
    this.sensors = sensors;
  }

  hasSensors() {
    return this.sensors.length > 0;
  }

  /**
   * Convert to plain object
   */
  toJSON() {
    return {
      id: this.id,
      passKey: this.passKey,
      stationType: this.stationType,
      model: this.model,
      totalReadings: this.totalReadings,
      firstReading: this.firstReading?.toISOString(),
      lastReading: this.lastReading?.toISOString(),
      latestData: this.latestData
    };
  }
}