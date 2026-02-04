import {uiConfigManager} from "../lib/UiConfigManager.js";
import {translations} from "./translations.js";

class Translator {
    t(key, defaultValue = key) {
        return translations[uiConfigManager.getLanguage()]?.[key] ?? defaultValue;
    }
}

export const i18n = new Translator();
