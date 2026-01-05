import { translations } from './translations.js';

class I18nManager {
  constructor() {
    this.currentLanguage = this.loadLanguage();
    this.listeners = [];
    this.updateHtmlLang();
  }

  loadLanguage() {
    console.log(translations)
    const stored = localStorage.getItem('app-language');
    if (stored && translations[stored]) {
      return stored;
    }

    const browserLang = navigator.language.split('-')[0];
    return (browserLang === 'en') ? 'en' : 'de';
  }

  updateHtmlLang() {
    document.documentElement.lang = this.currentLanguage;
  }

  setLanguage(lang) {
    if (!translations[lang]) {
      console.warn(`Language "${lang}" not available`);
      return;
    }
    
    this.currentLanguage = lang;
    localStorage.setItem('app-language', lang);
    this.updateHtmlLang();
    this.notifyListeners();
  }

  getLanguage() {
    return this.currentLanguage;
  }

  t(key, defaultValue = key) {
    return translations[this.currentLanguage]?.[key] ?? defaultValue;
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  notifyListeners() {
    this.listeners.forEach(callback => callback(this.currentLanguage));
  }

  getAvailableLanguages() {
    return Object.keys(translations);
  }
}

export const i18n = new I18nManager();
