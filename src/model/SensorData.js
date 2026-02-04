/**
 * Sensor Data Model
 */
export class SensorData {
  constructor(data) {
    this.id = data.id;
    this.stationId = data.station_id;
    this.sensorType = data.sensor_type;
    this.location = data.location;
    this.name = data.name;
    this.enabled = data.enabled;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  /**
   * Get display name for the sensor
   */
  getDisplayName() {
    return this.name || `${this.sensorType} (${this.location})`;
  }
}