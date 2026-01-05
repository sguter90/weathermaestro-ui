import {i18n} from "../i18n/i18n.js";

export function getWindDirectionLabel(degrees) {
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