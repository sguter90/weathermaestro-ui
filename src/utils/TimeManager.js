export class TimeManager {
  constructor() {
    this.timezone = 'UTC';
    this.dateFormat = 'DD/MM/YYYY';
    this.listeners = [];
    this.loadFromStorage();
  }

  setTimezone(timezone) {
    this.timezone = timezone;
    this.saveToStorage();
    this.notify();
  }

  getTimezone() {
    return this.timezone;
  }

  setDateFormat(format) {
    this.dateFormat = format;
    this.saveToStorage();
    this.notify();
  }

  getDateFormat() {
    return this.dateFormat;
  }

  subscribe(callback) {
    this.listeners.push(callback);
  }

  notify() {
    this.listeners.forEach(callback => callback());
  }

  saveToStorage() {
    localStorage.setItem('app-timezone', this.timezone);
    localStorage.setItem('app-date-format', this.dateFormat);
  }

  loadFromStorage() {
    const savedTimezone = localStorage.getItem('app-timezone');
    const savedDateFormat = localStorage.getItem('app-date-format');

    if (savedTimezone) {
      this.timezone = savedTimezone;
    }
    if (savedDateFormat) {
      this.dateFormat = savedDateFormat;
    }
  }
}

export const timeManager = new TimeManager();
