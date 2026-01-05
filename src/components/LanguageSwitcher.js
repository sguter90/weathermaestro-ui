import { i18n } from '../i18n/i18n.js';
import {translations} from "../i18n/translations.js";

export class LanguageSwitcher {
  constructor(containerId = 'language-switcher') {
    this.containerId = containerId;
    this.container = document.getElementById(containerId);
    this.init();
  }

  init() {
    if (!this.container) {
      console.warn(`Container with id "${this.containerId}" not found`);
      return;
    }

    this.render();
    i18n.subscribe(() => this.render());
  }

  render() {
    const currentLang = i18n.getLanguage();
    const languages = i18n.getAvailableLanguages();

    this.container.innerHTML = `
      <div class="language-switcher">
        <label for="lang-select" class="lang-label">${i18n.t('LANGUAGE')}:</label>
        <select id="lang-select" class="lang-select">
          ${languages.map(lang => `
            <option value="${lang}" ${lang === currentLang ? 'selected' : ''}>
              ${translations[lang].FLAG} ${i18n.t('LANG_' + lang.toUpperCase())}
            </option>
          `).join('')}
        </select>
      </div>
    `;

    document.getElementById('lang-select').addEventListener('change', (e) => {
      i18n.setLanguage(e.target.value);
    });
  }
}
