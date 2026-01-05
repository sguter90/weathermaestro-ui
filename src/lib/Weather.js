import {i18n} from "./i18n/i18n.js";

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
}