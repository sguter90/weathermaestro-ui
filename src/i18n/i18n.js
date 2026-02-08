import {uiConfigManager} from "../lib/UiConfigManager.js";
import {translations} from "./translations.js";

class Translator {
    t(key, defaultValue = key, params) {
        let translation = translations[uiConfigManager.getLanguage()]?.[key] ?? defaultValue;

        // Replace placeholders like {name}, {count}, etc.
        if (typeof params === 'object' && params !== null) {
            Object.keys(params).forEach(paramKey => {
                const placeholder = `{${paramKey}}`;
                translation = translation.replace(new RegExp(placeholder, 'g'), params[paramKey]);
            });
        }

        return translation
    }
}

export const i18n = new Translator();
