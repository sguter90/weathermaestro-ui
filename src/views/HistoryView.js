
import { router } from '../Router.js';
import * as api from '../api/client.js';
import { viewManager } from '../ViewManager.js';
import { getWindDirectionLabel } from '../utils/weather.js';
import { renderBreadcrumbs } from '../components/Breadcrumbs.js';
import { i18n } from "../i18n/i18n.js";
import { formatDateTime } from "../utils/timezones.js";
import { uiConfigManager } from '../utils/UiConfigManager.js';

export async function renderHistoryView(params) {
  const { id } = params;
  viewManager.showLoading('Loading history...');

  try {
    const station = await api.getStation(id);
    const history = await api.getWeatherHistory(id, {
      limit: 24
    });
    
    const html = `
      ${renderBreadcrumbs([
        { label: i18n.t('HOME'), url: '/' },
        { label: station.getDisplayName(), url: `/station/${id}` },
        { label: i18n.t('HISTORY'), url: `/station/${id}/history` }
      ])}
      <div class="history-view">
        <h1>${i18n.t('WEATHER_HISTORY')}</h1>
        
        <div class="history-table">
          <table>
            <thead>
              <tr>
                <th><i class="fa-solid fa-clock"></i> ${i18n.t('DATE')}</th>
                <th><i class="fa-solid fa-temperature-half"></i> ${i18n.t('TEMPERATURE')} (${uiConfigManager.getUnitLabel('temperature')})</th>
                <th><i class="fa-solid fa-droplet"></i> ${i18n.t('HUMIDITY')} (%)</th>
                <th><i class="fa-solid fa-wind"></i> ${i18n.t('WIND')} (${uiConfigManager.getUnitLabel('windSpeed')})</th>
                <th><i class="fa-solid fa-compass"></i> ${i18n.t('WIND_DIR')}</th>
                <th><i class="fa-solid fa-cloud-showers-heavy"></i> ${i18n.t('RAIN')} (${uiConfigManager.getUnitLabel('rain')})</th>
                <th><i class="fa-solid fa-gauge-high"></i> ${i18n.t('PRESSURE')} (${uiConfigManager.getUnitLabel('pressure')})</th>
              </tr>
            </thead>
            <tbody>
              ${history.map(data => `
                <tr>
                  <td>${formatDateTime(data.dateUTC)}</td>
                  <td>${data.tempOutC !== undefined ? uiConfigManager.convert(data.tempOutC, 'temperature').toFixed(1) : 'N/A'}</td>
                  <td>${data.humidityOut !== undefined ? data.humidityOut + '%' : 'N/A'}</td>
                  <td>${data.windSpeedKmH !== undefined ? uiConfigManager.convert(data.windSpeedKmH, 'windSpeed').toFixed(1) : 'N/A'}</td>
                  <td>${data.windDir !== undefined ? getWindDirectionLabel(data.windDir) : 'N/A'}</td>
                  <td>${data.hourlyRainMm !== undefined ? uiConfigManager.convert(data.hourlyRainMm, 'rain').toFixed(1) : 'N/A'}</td>
                  <td>${data.baromAbsHPa !== undefined ? uiConfigManager.convert(data.baromAbsHPa, 'pressure').toFixed(1) : 'N/A'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
    
    viewManager.render(html);
  } catch (error) {
    viewManager.showError(error.message);
  }
}
