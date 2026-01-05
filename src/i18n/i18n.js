import {uiConfigManager} from "../utils/UiConfigManager.js";
import {translations} from "./translations.js";

class Translator {
    constructor() {
        this.currentLanguage = uiConfigManager.getLanguage()
    }

    t(key, defaultValue = key) {
        return translations[this.currentLanguage]?.[key] ?? defaultValue;
    }
}

export const i18n = new Translator();
