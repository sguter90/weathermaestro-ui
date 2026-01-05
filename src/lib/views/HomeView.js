import {viewManager} from '../ViewManager.js';
import {renderBreadcrumbs} from "../components/Breadcrumbs.js";
import {i18n} from "../i18n/i18n.js";
import {uiConfigManager} from '../UiConfigManager.js';
import {apiClient} from "../ApiClient.js";
import {renderIcon} from "../components/Icons.js";

export async function renderHomeView() {
    viewManager.showLoading('Loading stations...');

    try {
        const stations = await apiClient.getStations();

        const html = `
      ${renderBreadcrumbs([
            {label: i18n.t('HOME'), url: '/'},
        ])}
      <div class="home-view">
        <h1>${i18n.t('WEATHER_STATIONS')}</h1>
        <div class="stations-grid">
          ${stations.map(station => `
            <a class="station-card" href="#/station/${station.id}">
              <h3>${station.getDisplayName()}</h3>
              <span class="status ${station.isActive() ? 'active' : 'inactive'}">
                ${station.isActive() ? i18n.t('ACTIVE') : i18n.t('INACTIVE')}
              </span>
              ${station.latestData ? `
                <div class="station-details">
                  <div class="station-detail-item">
                    <span class="icon">${renderIcon('temperatureGauge')}</span>
                    <span class="value">${uiConfigManager.convert(station.latestData.tempOutC, 'temperature').toFixed(1)} ${uiConfigManager.getUnitLabel('temperature')}</span>
                  </div>
                  <div class="station-detail-item">
                    <span class="icon">${renderIcon('droplet')}</span>
                    <span class="value">${station.latestData.humidityOut}%</span>
                  </div>
                  <div class="station-detail-item">
                    <span class="icon">${renderIcon('wind')}</span>
                    <span class="value">${uiConfigManager.convert(station.latestData.windSpeedKmH, 'windSpeed').toFixed(1)} ${uiConfigManager.getUnitLabel('windSpeed')} (${station.latestData.getWindDirection()})</span>
                  </div>
                  <div class="station-detail-item">
                    <span class="icon">${renderIcon('pressure')}</span>
                    <span class="value">${uiConfigManager.convert(station.latestData.baromAbsHPa, 'pressure').toFixed(1)} ${uiConfigManager.getUnitLabel('pressure')}</span>
                  </div>
                </div>
              ` : `<p class="no-data">${i18n.t('NO_WEATHER_DATA')}</p>`}
            </a>
          `).join('')}
        </div>
      </div>
    `;

        viewManager.render(html);
    } catch (error) {
        viewManager.showError(error.message);
    }
}
