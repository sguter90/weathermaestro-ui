import {uiConfigManager} from "../UiConfigManager.js";
import {Weather} from "../Weather.js";

/**
 * WeatherData DTO - Represents weather data from a weather station
 * Provides both metric and imperial measurements
 */
export class WeatherData {
  constructor(data = {}) {
    // System Info
    this.runtime = data.runtime || 0;
    this.heap = data.heap || 0;
    this.dateUTC = data.date_utc ? new Date(data.date_utc) : null;

    // Indoor - Metric
    this.tempInC = data.temp_in_c || 0;
    this.humidityIn = data.humidity_in || 0;

    // Indoor - Imperial
    this.tempInF = data.temp_in_f || 0;

    // Outdoor - Metric
    this.tempOutC = data.temp_out_c || 0;
    this.humidityOut = data.humidity_out || 0;

    // Outdoor - Imperial
    this.tempOutF = data.temp_out_f || 0;

    // Barometric Pressure - Metric
    this.baromRelHPa = data.barom_rel_hpa || 0;
    this.baromAbsHPa = data.barom_abs_hpa || 0;

    // Barometric Pressure - Imperial
    this.baromRelIn = data.barom_rel_in || 0;
    this.baromAbsIn = data.barom_abs_in || 0;

    // Wind - Metric
    this.windDir = data.wind_dir || 0;
    this.windSpeedMS = data.wind_speed_ms || 0;
    this.windGustMS = data.wind_gust_ms || 0;
    this.maxDailyGustMS = data.max_daily_gust_ms || 0;
    this.windSpeedKmH = data.wind_speed_kmh || 0;
    this.windGustKmH = data.wind_gust_kmh || 0;
    this.maxDailyGustKmH = data.max_daily_gust_kmh || 0;

    // Wind - Imperial
    this.windSpeedMPH = data.wind_speed_mph || 0;
    this.windGustMPH = data.wind_gust_mph || 0;
    this.maxDailyGustMPH = data.max_daily_gust_mph || 0;

    // Solar & UV
    this.solarRadiation = data.solar_radiation || 0;
    this.uv = data.uv || 0;

    // Rain - Metric
    this.rainRateMmH = data.rain_rate_mm_h || 0;
    this.eventRainMm = data.event_rain_mm || 0;
    this.hourlyRainMm = data.hourly_rain_mm || 0;
    this.dailyRainMm = data.daily_rain_mm || 0;
    this.weeklyRainMm = data.weekly_rain_mm || 0;
    this.monthlyRainMm = data.monthly_rain_mm || 0;
    this.yearlyRainMm = data.yearly_rain_mm || 0;
    this.totalRainMm = data.total_rain_mm || 0;

    // Rain - Imperial
    this.rainRateIn = data.rain_rate_in || 0;
    this.eventRainIn = data.event_rain_in || 0;
    this.hourlyRainIn = data.hourly_rain_in || 0;
    this.dailyRainIn = data.daily_rain_in || 0;
    this.weeklyRainIn = data.weekly_rain_in || 0;
    this.monthlyRainIn = data.monthly_rain_in || 0;
    this.yearlyRainIn = data.yearly_rain_in || 0;
    this.totalRainIn = data.total_rain_in || 0;

    // Additional Sensors
    this.vpd = data.vpd || 0;
    this.wh65Batt = data.wh65_batt || 0;
  }

  /**
   * Get outdoor temperature with unit conversion
   */
  getOutdoorTemp() {
    return uiConfigManager.convert(this.tempOutC, 'temperature');
  }

  /**
   * Get temperature unit symbol
   */
  getTempUnit() {
    return uiConfigManager.getUnitLabel('temperature');
  }

  /**
   * Get wind speed with unit conversion
   */
  getWindSpeed() {
    return uiConfigManager.convert(this.windSpeedMS, 'windSpeed');
  }

  /**
   * Get wind speed unit
   */
  getWindUnit() {
    return uiConfigManager.getUnitLabel('windSpeed');
  }

  /**
   * Get daily rain with unit conversion
   */
  getDailyRain() {
    return uiConfigManager.convert(this.dailyRainMm, 'rain');
  }

  /**
   * Get hourly rain with unit conversion
   */
  getHourlyRain() {
    return uiConfigManager.convert(this.hourlyRainMm, 'rain');
  }

  /**
   * Get rain unit
   */
  getRainUnit() {
    return uiConfigManager.getUnitLabel('rain');
  }

  /**
   * Get rain max value for gauge
   */
  getRainMax() {
    const isMetric = uiConfigManager.getUnit('rain') === 'MM';
    return isMetric ? 100 : 4;
  }

  /**
   * Get indoor temperature with unit conversion
   */
  getIndoorTemp() {
    return uiConfigManager.convert(this.tempInC, 'temperature');
  }

  /**
   * Get pressure with unit conversion
   */
  getPressure() {
    return uiConfigManager.convert(this.baromRelHPa, 'pressure');
  }

  /**
   * Get pressure unit
   */
  getPressureUnit() {
    return uiConfigManager.getUnitLabel('pressure');
  }

  /**
   * Get UV index category
   */
  getUVCategory() {
    return Weather.getUVCategoryLabel(this.uv);
  }

  /**
   * Get wind direction
   */
  getWindDirection() {
    return Weather.getWindDirectionLabel(this.windDir)
  }

  /**
   * Convert to plain object
   */
  toJSON() {
    return { ...this };
  }
}

