import { uiConfigManager } from './UiConfigManager.js';

export const TIMEZONES = [
  'UTC',
  'Europe/London',
  'Europe/Berlin',
  'Europe/Paris',
  'Europe/Amsterdam',
  'Europe/Rome',
  'Europe/Madrid',
  'Europe/Vienna',
  'Europe/Prague',
  'Europe/Warsaw',
  'Europe/Moscow',
  'Europe/Istanbul',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Bangkok',
  'Asia/Singapore',
  'Asia/Hong_Kong',
  'Asia/Tokyo',
  'Asia/Seoul',
  'Australia/Sydney',
  'Australia/Melbourne',
  'Pacific/Auckland',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Anchorage',
  'Pacific/Honolulu',
  'America/Toronto',
  'America/Mexico_City',
  'America/Sao_Paulo',
  'America/Buenos_Aires',
  'Africa/Cairo',
  'Africa/Johannesburg',
  'Africa/Lagos',
];

/**
 * DateFormatter class for handling date/time formatting with timezone support
 */
class DateFormatter {
  constructor() {
    this.languageLocaleMap = {
      'de': 'de-DE',
      'en': 'en-US',
    };
  }

  /**
   * Gets the locale based on current language
   * @returns {string} The locale string (e.g., 'de-DE', 'en-US')
   */
  getLocale() {
    const currentLanguage = uiConfigManager.getLanguage();
    return this.languageLocaleMap[currentLanguage] || 'en-US';
  }

  /**
   * Formats a date using Intl API with timezone support
   * @param {Date} date The date to format
   * @param {string} timezone The timezone to use
   * @param {object} options Intl.DateTimeFormat options
   * @returns {object} Object with formatted parts (year, month, day, hour, minute, second)
   */
  formatWithIntl(date, timezone, options) {
    const formatter = new Intl.DateTimeFormat(this.getLocale(), {
      timeZone: timezone,
      ...options,
    });

    const parts = formatter.formatToParts(date);
    const values = {};

    parts.forEach(part => {
      if (part.type !== 'literal') {
        values[part.type] = part.value;
      }
    });

    return values;
  }

  /**
   * Formats a date according to the configured date format
   * @param {Date} date The date to format
   * @param {string} timezone Optional timezone (uses configured timezone if not provided)
   * @returns {string} Formatted date string
   */
  formatDate(date, timezone = null) {
    const tz = timezone || uiConfigManager.getTimezone();
    const dateFormat = uiConfigManager.getDateFormat();

    const values = this.formatWithIntl(date, tz, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    return dateFormat
      .replace('DD', values.day)
      .replace('MM', values.month)
      .replace('YYYY', values.year);
  }

  /**
   * Formats a time in 24-hour format
   * @param {Date} date The date to format
   * @param {string} timezone Optional timezone (uses configured timezone if not provided)
   * @returns {string} Formatted time string (HH:MM:SS)
   */
  formatTime(date, timezone = null) {
    const tz = timezone || uiConfigManager.getTimezone();

    const values = this.formatWithIntl(date, tz, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    return `${values.hour}:${values.minute}:${values.second}`;
  }

  /**
   * Formats a date and time combined
   * @param {Date} date The date to format
   * @param {string} timezone Optional timezone (uses configured timezone if not provided)
   * @returns {string} Formatted date and time string
   */
  formatDateTime(date, timezone = null) {
    const tz = timezone || uiConfigManager.getTimezone();
    const dateFormat = uiConfigManager.getDateFormat();

    const values = this.formatWithIntl(date, tz, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    const formattedDate = dateFormat
      .replace('DD', values.day)
      .replace('MM', values.month)
      .replace('YYYY', values.year);

    const formattedTime = `${values.hour}:${values.minute}:${values.second}`;

    return `${formattedDate} ${formattedTime}`;
  }
}

// Export singleton instance
export const dateFormatter = new DateFormatter();
