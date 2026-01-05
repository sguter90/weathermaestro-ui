
import { i18n } from '../i18n/i18n.js';
import { unitManager } from '../utils/UnitManager.js';
import { timeManager } from '../utils/TimeManager.js';
import { UnitConfig, UnitPresets } from '../utils/UnitConfig.js';
import { TIMEZONES } from '../utils/timezones.js';
import { translations } from '../i18n/translations.js';

export class UnitSwitcher {
  constructor(containerId = 'unit-switcher') {
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

    // Re-render when language, units or time settings change
    i18n.subscribe(() => this.render());
    unitManager.subscribe(() => this.render());
    timeManager.subscribe(() => this.render());
  }

  renderRegionalSettings() {
    const currentLang = i18n.getLanguage();
    const languages = i18n.getAvailableLanguages();
    const currentTimezone = timeManager.getTimezone();
    const currentDateFormat = timeManager.getDateFormat();

    const dateFormats = [
      { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
      { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
      { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
      { value: 'DD.MM.YYYY', label: 'DD.MM.YYYY' },
      { value: 'DD-MM-YYYY', label: 'DD-MM-YYYY' },
    ];

    return `
      <div class="settings-section">
        <h3>${i18n.t('REGIONAL_SETTINGS')}</h3>
        
        <div class="unit-switcher">
          <!-- Language -->
          <div class="unit-type">
            <label for="lang-select">${i18n.t('LANGUAGE')}</label>
            <select id="lang-select" class="lang-select">
              ${languages.map(lang => `
                <option value="${lang}" ${lang === currentLang ? 'selected' : ''}>
                  ${translations[lang].FLAG} ${i18n.t('LANG_' + lang.toUpperCase())}
                </option>
              `).join('')}
            </select>
          </div>

          <!-- Timezone -->
          <div class="unit-type">
            <label for="timezone-select">${i18n.t('TIMEZONE')}</label>
            <select id="timezone-select">
              ${TIMEZONES.map(tz => `
                <option value="${tz}" ${currentTimezone === tz ? 'selected' : ''}>${tz}</option>
              `).join('')}
            </select>
          </div>

          <!-- Date Format -->
          <div class="unit-type">
            <label for="date-format-select">${i18n.t('DATE_FORMAT')}</label>
            <select id="date-format-select">
              ${dateFormats.map(format => `
                <option value="${format.value}" ${currentDateFormat === format.value ? 'selected' : ''}>${format.label}</option>
              `).join('')}
            </select>
          </div>
        </div>
      </div>
    `;
  }

  renderPresets() {
    return `
      <div class="unit-presets">
        <h4>${i18n.t('UNIT_PRESETS')}</h4>
        <div class="preset-buttons">
          ${Object.entries(UnitPresets).map(([key, preset]) => `
            <button class="preset-btn" data-preset="${key}">
              ${i18n.t(`UNIT_PRESET_${key.toUpperCase()}`)}
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderUnitType(type, label) {
    const options = UnitConfig[type];
    const currentUnit = unitManager.getUnit(type);

    return `
      <div class="unit-type">
        <label>${label}</label>
        <div class="unit-options">
          ${Object.entries(options).map(([key, config]) => `
            <div class="unit-radio">
              <input type="radio" 
                     id="unit-${type}-${key}" 
                     name="unit-${type}" 
                     value="${key}" 
                     ${currentUnit === key ? 'checked' : ''}>
              <label for="unit-${type}-${key}">${config.label}</label>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderUnitSettings() {
    return `
      <div class="settings-section">
        <h3>${i18n.t('UNITS')}</h3>
        
        ${this.renderPresets()}
        
        <div class="unit-switcher">
          ${this.renderUnitType('temperature', i18n.t('TEMPERATURE'))}
          ${this.renderUnitType('windSpeed', i18n.t('WIND'))}
          ${this.renderUnitType('pressure', i18n.t('PRESSURE'))}
          ${this.renderUnitType('height', i18n.t('HEIGHT'))}
          ${this.renderUnitType('rain', i18n.t('RAIN'))}
        </div>
      </div>
    `;
  }

  render() {
    this.container.innerHTML = `
      ${this.renderRegionalSettings()}
      ${this.renderUnitSettings()}
    `;

    // Language select
    document.getElementById('lang-select')?.addEventListener('change', (e) => {
      i18n.setLanguage(e.target.value);
    });

    // Preset buttons
    document.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        unitManager.setPreset(e.target.dataset.preset);
      });
    });

    // Unit type radios
    document.querySelectorAll('input[name^="unit-"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        const type = e.target.name.replace('unit-', '');
        unitManager.setUnits({ [type]: e.target.value });
      });
    });

    // Time settings
    document.getElementById('timezone-select')?.addEventListener('change', (e) => {
      timeManager.setTimezone(e.target.value);
    });

    document.getElementById('date-format-select')?.addEventListener('change', (e) => {
      timeManager.setDateFormat(e.target.value);
    });
  }
}
