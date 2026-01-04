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
   * Get wind direction as compass direction (N, NE, E, SE, S, SW, W, NW)
   */
  getWindDirection() {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(this.windDir / 45) % 8;
    return directions[index];
  }

  /**
   * Get UV index category
   */
  getUVCategory() {
    if (this.uv <= 2) return 'Low';
    if (this.uv <= 5) return 'Moderate';
    if (this.uv <= 7) return 'High';
    if (this.uv <= 10) return 'Very High';
    return 'Extreme';
  }

  /**
   * Check if battery is low (assuming 0 = low, 1 = ok)
   */
  isBatteryLow() {
    return this.wh65Batt === 0;
  }

  /**
   * Get formatted date string
   */
  getFormattedDate(locale = 'en-US', options = {}) {
    if (!this.dateUTC) return 'N/A';
    return this.dateUTC.toLocaleString(locale, options);
  }

  /**
   * Get temperature (respects user preference)
   * @param {boolean} useMetric - true for Celsius, false for Fahrenheit
   * @param {boolean} indoor - true for indoor, false for outdoor
   */
  getTemperature(useMetric = true, indoor = false) {
    if (indoor) {
      return useMetric ? this.tempInC : this.tempInF;
    }
    return useMetric ? this.tempOutC : this.tempOutF;
  }

  /**
   * Get wind speed (respects user preference)
   * @param {string} unit - 'ms', 'kmh', or 'mph'
   */
  getWindSpeed(unit = 'ms') {
    switch (unit) {
      case 'kmh':
        return this.windSpeedKmH;
      case 'mph':
        return this.windSpeedMPH;
      default:
        return this.windSpeedMS;
    }
  }

  /**
   * Get rain data (respects user preference)
   * @param {boolean} useMetric - true for mm, false for inches
   */
  getRainData(useMetric = true) {
    if (useMetric) {
      return {
        rate: this.rainRateMmH,
        event: this.eventRainMm,
        hourly: this.hourlyRainMm,
        daily: this.dailyRainMm,
        weekly: this.weeklyRainMm,
        monthly: this.monthlyRainMm,
        yearly: this.yearlyRainMm,
        total: this.totalRainMm,
      };
    }
    return {
      rate: this.rainRateIn,
      event: this.eventRainIn,
      hourly: this.hourlyRainIn,
      daily: this.dailyRainIn,
      weekly: this.weeklyRainIn,
      monthly: this.monthlyRainIn,
      yearly: this.yearlyRainIn,
      total: this.totalRainIn,
    };
  }

  /**
   * Get barometric pressure (respects user preference)
   * @param {boolean} useMetric - true for hPa, false for inches
   */
  getBarometricPressure(useMetric = true) {
    if (useMetric) {
      return {
        relative: this.baromRelHPa,
        absolute: this.baromAbsHPa,
      };
    }
    return {
      relative: this.baromRelIn,
      absolute: this.baromAbsIn,
    };
  }

  /**
   * Convert to plain object
   */
  toJSON() {
    return { ...this };
  }
}
