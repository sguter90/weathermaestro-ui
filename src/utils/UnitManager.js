import { UnitConfig, UnitPresets } from './UnitConfig.js';

class UnitManager {
  constructor() {
    this.units = { ...UnitPresets.metric };
    this.subscribers = [];
    this.loadFromStorage();
  }

  setUnits(units) {
    this.units = { ...this.units, ...units };
    this.saveToStorage();
    this.notify();
  }

  setPreset(presetName) {
    if (UnitPresets[presetName]) {
      this.units = { ...UnitPresets[presetName] };
      this.saveToStorage();
      this.notify();
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

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  notify() {
    this.subscribers.forEach(cb => cb());
  }

  saveToStorage() {
    localStorage.setItem('units', JSON.stringify(this.units));
  }

  loadFromStorage() {
    const stored = localStorage.getItem('units');
    if (stored) {
      this.units = JSON.parse(stored);
    }
  }
}

export const unitManager = new UnitManager();
