import {i18n} from "../i18n/i18n.js";
import {uiConfigManager} from "./UiConfigManager.js";

/**
 * Weather utility class with static methods
 * No instantiation needed
 */
export class Weather {
    /**
     * Get wind direction label
     * @param {number} degrees Wind direction in degrees (0-360)
     * @returns {string} Localized wind direction label
     */
    static getWindDirectionLabel(degrees) {
        const directions = [
            i18n.t('COMPASS_DIR_N'),
            i18n.t('COMPASS_DIR_NE'),
            i18n.t('COMPASS_DIR_E'),
            i18n.t('COMPASS_DIR_SE'),
            i18n.t('COMPASS_DIR_S'),
            i18n.t('COMPASS_DIR_SW'),
            i18n.t('COMPASS_DIR_W'),
            i18n.t('COMPASS_DIR_NW')
        ];
        const index = Math.round(degrees / 45) % 8;
        return directions[index];
    }

    /**
     * Get UV index category label
     * @param {number} uvValue UV index value
     * @returns {string} Localized UV category label
     */
    static getUVCategoryLabel(uvValue) {
        if (uvValue <= 2) return i18n.t('UV_CAT_LOW');
        if (uvValue <= 5) return i18n.t('UV_CAT_MODERATE');
        if (uvValue <= 7) return i18n.t('UV_CAT_HIGH');
        if (uvValue <= 10) return i18n.t('UV_CAT_VERY_HIGH');
        return i18n.t('UV_CAT_EXTREME');
    }

    static getDewPointLabel(value) {
        if (value < -10) return i18n.t('DEW_VERY_DRY');
        if (value < 0) return i18n.t('DEW_DRY');
        if (value < 10) return i18n.t('DEW_COMFORTABLE');
        if (value < 15) return i18n.t('DEW_HUMID');
        if (value < 20) return i18n.t('DEW_VERY_HUMID');
        return i18n.t('DEW_EXTREMELY_HUMID');
    }

    static getCo2Label(co2Level) {
        if (co2Level < 400) {
            return i18n.t('CO2_OPTIMAL');
        } else if (co2Level < 600) {
            return i18n.t('CO2_GOOD');
        } else if (co2Level < 1000) {
            return i18n.t('CO2_ACCEPTABLE');
        } else if (co2Level < 1500) {
            return i18n.t('CO2_POOR');
        } else {
            return i18n.t('CO2_VERY_POOR');
        }
    }

    static getHumidityLabel(humidity) {
        if (humidity < 30) {
            return i18n.t('HUMIDITY_TOO_DRY');
        } else if (humidity < 40) {
            return i18n.t('HUMIDITY_DRY');
        } else if (humidity <= 60) {
            return i18n.t('HUMIDITY_OPTIMAL');
        } else if (humidity <= 70) {
            return i18n.t('HUMIDITY_HUMID');
        } else {
            return i18n.t('HUMIDITY_TOO_HUMID');
        }
    }

    static getNoiseLabel(noiseLevel) {
        if (noiseLevel < 30) {
            return i18n.t('NOISE_VERY_QUIET');
        } else if (noiseLevel < 50) {
            return i18n.t('NOISE_QUIET');
        } else if (noiseLevel < 70) {
            return i18n.t('NOISE_MODERATE');
        } else if (noiseLevel < 85) {
            return i18n.t('NOISE_LOUD');
        } else if (noiseLevel < 100) {
            return i18n.t('NOISE_VERY_LOUD');
        } else {
            return i18n.t('NOISE_EXTREMELY_LOUD');
        }
    }

    /**
     * Get pressure description based on value
     * @returns {string} Pressure category label
     */
    static getPressureLabel(pressure) {
        if (pressure < 980) {
            return i18n.t('PRESSURE_VERY_LOW') || 'Very Low';
        } else if (pressure < 1000) {
            return i18n.t('PRESSURE_LOW') || 'Low';
        } else if (pressure < 1013) {
            return i18n.t('PRESSURE_BELOW_NORMAL') || 'Below Normal';
        } else if (pressure < 1030) {
            return i18n.t('PRESSURE_NORMAL') || 'Normal';
        } else if (pressure < 1050) {
            return i18n.t('PRESSURE_HIGH') || 'High';
        } else {
            return i18n.t('PRESSURE_VERY_HIGH') || 'Very High';
        }
    }

    /**
     * Calculates the apparent temperature (feels like) based on temperature, humidity, and wind speed
     * Uses wind chill formula for cold temperatures with wind and heat index formula for warm temperatures
     * @returns {number} Apparent temperature in the current temperature unit
     */
    static getApparentTemp(tempC, windSpeedKmH, humidity) {

        // Wind chill formula (valid for temp < 10°C and wind >= 4.8 km/h)
        if (tempC < 10 && windSpeedKmH >= 4.8) {
            return 13.12 + (0.6215 * tempC) - (11.37 * Math.pow(windSpeedKmH, 0.16)) + (0.3965 * tempC * Math.pow(windSpeedKmH, 0.16))
        }

        // Heat index formula (valid for temp >= 26.67°C)
        if (tempC >= 26.67) {
            return Weather.getHeatIndexC(tempC, humidity);
        }

        // For moderate temperatures, return actual temperature
        return tempC;
    }

    /**
     * Calculates the heat index based on temperature and humidity
     * Uses the standard heat index formula (valid for temp >= 26.67°C)
     * @returns {number} Heat index in Celsius
     * @private
     */
    static getHeatIndexC(tempC, humidity) {
        // Heat index formula only applies for temperatures >= 26.67°C
        if (tempC < 26.67) {
            return tempC;
        }

        const c1 = -42.379;
        const c2 = 2.04901523;
        const c3 = 10.14333127;
        const c4 = -0.22475541;
        const c5 = -0.00683783;
        const c6 = -0.05481717;
        const c7 = 0.00122874;
        const c8 = 0.00085282;
        const c9 = -0.00000199;

        return c1 + (c2 * tempC) + (c3 * humidity) + (c4 * tempC * humidity) + (c5 * tempC * tempC) + (c6 * humidity * humidity) + (c7 * tempC * tempC * humidity) + (c8 * tempC * humidity * humidity) + (c9 * tempC * tempC * humidity * humidity);
    }

    /**
     * Calculates the dew point based on temperature and humidity
     * Uses the Magnus formula
     * @returns {number} Dew point in the current temperature unit
     */
    static getDewPoint(tempC, humidity) {
        // Magnus constants
        const a = 17.27;
        const b = 237.7; // in Celsius

        // Calculate dew point in Celsius using the Magnus formula
        const alpha = ((a * tempC) / (b + tempC)) + Math.log(humidity / 100);
        const dewPointC = (b * alpha) / (a - alpha);

        // Convert to current unit using uiConfigManager
        return uiConfigManager.convert(dewPointC, 'temperature');
    }
}