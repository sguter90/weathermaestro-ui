import { UnitConfig, UnitPresets } from './UnitConfig.js';

import {translations} from "../i18n/translations.js";

class UiConfigManager {
  constructor() {
    // Units
    this.units = { ...UnitPresets.metric };
    
    // Language
    this.currentLanguage = this.loadLanguage();
    this.availableLanguages = Object.keys(translations);
    
    // Time
    this.timezone = 'UTC';
    this.dateFormat = 'DD/MM/YYYY';
    
    // Subscribers
    this.listeners = [];
    
    this.updateHtmlLang();
    this.loadFromStorage();
  }

  // ============ LANGUAGE ============
  
  loadLanguage() {
    const config = this.getStoredConfig();
    if (config?.language && translations[config.language]) {
      return config.language;
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
    this.updateHtmlLang();
    this.saveToStorage();
    this.notifyListeners();
  }

  getLanguage() {
    return this.currentLanguage;
  }

  getAvailableLanguages() {
    return this.availableLanguages;
  }

  // ============ UNITS ============
  
  setUnits(units) {
    this.units = { ...this.units, ...units };
    this.saveToStorage();
    this.notifyListeners();
  }

  setPreset(presetName) {
    if (UnitPresets[presetName]) {
      this.units = { ...UnitPresets[presetName] };
      this.saveToStorage();
      this.notifyListeners();
    }
  }

  getUnit(type) {
    return this.units[type];
  }

  convert(value, type, targetUnit = null) {
    const unit = targetUnit || this.units[type];
    const config = UnitConfig[type]?.[unit];
    
    if (!config) {
      console.warn(`Unknown unit: ${type}.${unit}`);
      return value;
    }
    
    return config.convert(value);
  }

  getUnitLabel(type) {
    const unit = this.units[type];
    return UnitConfig[type]?.[unit]?.label || '';
  }

  // ============ TIME ============
  
  setTimezone(timezone) {
    this.timezone = timezone;
    this.saveToStorage();
    this.notifyListeners();
  }

  getTimezone() {
    return this.timezone;
  }

  setDateFormat(format) {
    this.dateFormat = format;
    this.saveToStorage();
    this.notifyListeners();
  }

  getDateFormat() {
    return this.dateFormat;
  }

  // ============ STORAGE & SUBSCRIBERS ============
  
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  notifyListeners() {
    this.listeners.forEach(callback => callback(this.currentLanguage));
  }

  getStoredConfig() {
    const stored = localStorage.getItem('uiConfig');
    return stored ? JSON.parse(stored) : null;
  }

  saveToStorage() {
    const config = {
      language: this.currentLanguage,
      units: this.units,
      timezone: this.timezone,
      dateFormat: this.dateFormat,
    };
    localStorage.setItem('uiConfig', JSON.stringify(config));
  }

  loadFromStorage() {
    const config = this.getStoredConfig();
    
    if (!config) return;
    
    // Load units
    if (config.units) {
      this.units = config.units;
    }
    
    // Load timezone
    if (config.timezone) {
      this.timezone = config.timezone;
    }
    
    // Load date format
    if (config.dateFormat) {
      this.dateFormat = config.dateFormat;
    }
  }
}

export const uiConfigManager = new UiConfigManager();
