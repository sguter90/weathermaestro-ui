import { Units, UnitPresets } from '../config/units.js';
import {translations} from "../i18n/translations.js";

class UiConfigManager {
  constructor() {
    // Units
    this.presetName = 'metric';
    this.units = { ...UnitPresets.metric };
    
    // Language
    this.currentLanguage = this.loadLanguage();
    this.availableLanguages = Object.keys(translations);
    
    // Time
    this.timezone = 'UTC';
    this.dateFormat = 'DD/MM/YYYY';
    this.timeFormat = 24;
    
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
    this.presetName = presetName;
    this.saveToStorage();
    this.notifyListeners();
  }

  getPresetName() {
    return this.presetName;
  }

  getUnit(type) {
    return this.units[type] || Object.keys(Units[type])[0];
  }

  convert(value, type, targetUnit = null) {
    const unit = targetUnit || this.getUnit(type);
    const config = Units[type]?.[unit];
    
    if (!config) {
      console.warn(`Unknown unit: ${type}.${unit}`);
      return value;
    }
    
    return config.convert(value);
  }

  getUnitLabel(type) {
    const unit = this.getUnit(type);
    return Units[type]?.[unit]?.label || '';
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

  setTimeFormat(format) {
    this.timeFormat = format;
    this.saveToStorage();
    this.notifyListeners();
  }

  getTimeFormat() {
    return this.timeFormat;
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
      timeFormat: this.timeFormat,
      presetName: this.presetName,
    };
    localStorage.setItem('uiConfig', JSON.stringify(config));
  }

  loadFromStorage() {
    const config = this.getStoredConfig();
    
    if (!config) return;

    if (config.units) {
      this.units = config.units;
    }

    if (config.timezone) {
      this.timezone = config.timezone;
    }

    if (config.dateFormat) {
      this.dateFormat = config.dateFormat;
    }

    if (config.timeFormat) {
      this.timeFormat = config.timeFormat;
    }
  }
}

export const uiConfigManager = new UiConfigManager();
