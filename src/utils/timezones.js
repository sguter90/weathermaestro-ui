
import { i18n } from '../i18n/i18n.js';
import { timeManager } from './TimeManager.js';

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

const LANGUAGE_LOCALE_MAP = {
  'de': 'de-DE',
  'en': 'en-US',
};

function getLocale() {
  const currentLanguage = i18n.getLanguage();
  return LANGUAGE_LOCALE_MAP[currentLanguage] || 'en-US';
}

function formatWithIntl(date, timezone, options) {
  const formatter = new Intl.DateTimeFormat(getLocale(), {
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

export function formatDate(date, timezone = null) {
  const tz = timezone || timeManager.getTimezone();
  const dateFormat = timeManager.getDateFormat();
  
  const values = formatWithIntl(date, tz, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  
  return dateFormat
    .replace('DD', values.day)
    .replace('MM', values.month)
    .replace('YYYY', values.year);
}

export function formatTime(date, timezone = null) {
  const tz = timezone || timeManager.getTimezone();
  
  const values = formatWithIntl(date, tz, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  
  return `${values.hour}:${values.minute}:${values.second}`;
}

export function formatDateTime(date, timezone = null) {
  const tz = timezone || timeManager.getTimezone();
  const dateFormat = timeManager.getDateFormat();
  
  const values = formatWithIntl(date, tz, {
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
