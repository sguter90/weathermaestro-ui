import { uiConfigManager } from './UiConfigManager.js';
import { i18n } from '../i18n/i18n.js';

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
    const timeFormat = uiConfigManager.getTimeFormat();

    const values = this.formatWithIntl(date, tz, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: timeFormat === '12',
    });


    let time = `${values.hour}:${values.minute}:${values.second}`;
    if (timeFormat === '12') {
      time += ' ' + values.dayPeriod;
    }

    return time;
  }

  /**
   * Formats a date object and time combined
   * @param {Date} dateObject The dateObject to format
   * @param {string} timezone Optional timezone (uses configured timezone if not provided)
   * @returns {string} Formatted dateObject and time string
   */
  formatDateTime(dateObject, timezone = null) {
    const formattedDate = this.formatDate(dateObject, timezone)
    const formattedTime = this.formatTime(dateObject, timezone)

    return `${formattedDate} ${formattedTime}`;
  }

  /**
   * Formats a date as relative time (e.g., "2 minutes ago", "in 3 hours")
   * @param {Date} date The date to format
   * @param {Date} baseDate Optional base date to compare against (defaults to now)
   * @returns {string} Relative time string
   */
  formatRelative(date, baseDate = null) {
    const base = baseDate || new Date();
    const diffMs = date - base;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    const isPast = diffMs < 0;
    const absSeconds = Math.abs(diffSeconds);
    const absMinutes = Math.abs(diffMinutes);
    const absHours = Math.abs(diffHours);
    const absDays = Math.abs(diffDays);
    const absWeeks = Math.abs(diffWeeks);
    const absMonths = Math.abs(diffMonths);
    const absYears = Math.abs(diffYears);

    // Just now (within 10 seconds)
    if (absSeconds < 10) {
      return i18n.t('JUST_NOW') || 'Just now';
    }

    // Seconds
    if (absSeconds < 60) {
      const key = isPast ? 'SECONDS_AGO' : 'IN_SECONDS';
      return (i18n.t(key) || (isPast ? '{count} seconds ago' : 'in {count} seconds'))
          .replace('{count}', absSeconds.toString());
    }

    // Minutes
    if (absMinutes < 60) {
      if (absMinutes === 1) {
        const key = isPast ? 'ONE_MINUTE_AGO' : 'IN_ONE_MINUTE';
        return i18n.t(key) || (isPast ? '1 minute ago' : 'in 1 minute');
      }
      const key = isPast ? 'MINUTES_AGO' : 'IN_MINUTES';
      return (i18n.t(key) || (isPast ? '{count} minutes ago' : 'in {count} minutes'))
          .replace('{count}', absMinutes.toString());
    }

    // Hours
    if (absHours < 24) {
      if (absHours === 1) {
        const key = isPast ? 'ONE_HOUR_AGO' : 'IN_ONE_HOUR';
        return i18n.t(key) || (isPast ? '1 hour ago' : 'in 1 hour');
      }
      const key = isPast ? 'HOURS_AGO' : 'IN_HOURS';
      return (i18n.t(key) || (isPast ? '{count} hours ago' : 'in {count} hours'))
          .replace('{count}', absHours.toString());
    }

    // Days
    if (absDays < 7) {
      if (absDays === 1) {
        const key = isPast ? 'YESTERDAY' : 'TOMORROW';
        return i18n.t(key) || (isPast ? 'Yesterday' : 'Tomorrow');
      }
      const key = isPast ? 'DAYS_AGO' : 'IN_DAYS';
      return (i18n.t(key) || (isPast ? '{count} days ago' : 'in {count} days'))
          .replace('{count}', absDays.toString());
    }

    // Weeks
    if (absWeeks < 4) {
      if (absWeeks === 1) {
        const key = isPast ? 'ONE_WEEK_AGO' : 'IN_ONE_WEEK';
        return i18n.t(key) || (isPast ? '1 week ago' : 'in 1 week');
      }
      const key = isPast ? 'WEEKS_AGO' : 'IN_WEEKS';
      return (i18n.t(key) || (isPast ? '{count} weeks ago' : 'in {count} weeks'))
          .replace('{count}', absWeeks.toString());
    }

    // Months
    if (absMonths < 12) {
      if (absMonths === 1) {
        const key = isPast ? 'ONE_MONTH_AGO' : 'IN_ONE_MONTH';
        return i18n.t(key) || (isPast ? '1 month ago' : 'in 1 month');
      }
      const key = isPast ? 'MONTHS_AGO' : 'IN_MONTHS';
      return (i18n.t(key) || (isPast ? '{count} months ago' : 'in {count} months'))
          .replace('{count}', absMonths.toString());
    }

    // Years
    if (absYears === 1) {
      const key = isPast ? 'ONE_YEAR_AGO' : 'IN_ONE_YEAR';
      return i18n.t(key) || (isPast ? '1 year ago' : 'in 1 year');
    }
    const key = isPast ? 'YEARS_AGO' : 'IN_YEARS';
    return (i18n.t(key) || (isPast ? '{count} years ago' : 'in {count} years'))
        .replace('{count}', absYears.toString());
  }

  /**
   * Formats a date as short relative time (e.g., "2m", "3h", "5d")
   * @param {Date} date The date to format
   * @param {Date} baseDate Optional base date to compare against (defaults to now)
   * @returns {string} Short relative time string
   */
  formatRelativeShort(date, baseDate = null) {
    const base = baseDate || new Date();
    const diffMs = date - base;
    const diffSeconds = Math.abs(Math.floor(diffMs / 1000));
    const diffMinutes = Math.abs(Math.floor(diffSeconds / 60));
    const diffHours = Math.abs(Math.floor(diffMinutes / 60));
    const diffDays = Math.abs(Math.floor(diffHours / 24));
    const diffWeeks = Math.abs(Math.floor(diffDays / 7));
    const diffMonths = Math.abs(Math.floor(diffDays / 30));
    const diffYears = Math.abs(Math.floor(diffDays / 365));

    if (diffSeconds < 60) return `${diffSeconds}s`;
    if (diffMinutes < 60) return `${diffMinutes}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    if (diffWeeks < 4) return `${diffWeeks}w`;
    if (diffMonths < 12) return `${diffMonths}mo`;
    return `${diffYears}y`;
  }
}

// Export singleton instance
export const dateFormatter = new DateFormatter();
