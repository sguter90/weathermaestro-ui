import * as api from '../api/client.js';
import { viewManager } from '../ViewManager.js';
import { router } from '../Router.js';
import { getWindDirectionLabel } from '../utils/weather.js';
import {renderBreadcrumbs} from "../components/Breadcrumbs.js";
import {i18n} from "../i18n/i18n.js";

export async function renderHomeView() {
  viewManager.showLoading('Loading stations...');

  try {
    const stations = await api.getStations();
    
    const html = `
      ${renderBreadcrumbs([
        {label: i18n.t('HOME'), url: '/'},
      ])}
      <div class="home-view">
        <h1>${i18n.t('WEATHER_STATIONS')}</h1>
        <div class="stations-grid">
          ${stations.map(station => `
            <div class="station-card" onclick="router.navigate('/station/${station.id}')">
              <h3>${station.getDisplayName()}</h3>
              <span class="status ${station.isActive() ? 'active' : 'inactive'}">
                ${station.isActive() ? i18n.t('ACTIVE') : i18n.t('INACTIVE')}
              </span>
              ${station.latestData ? `
                <div class="station-details">
                  <div class="station-detail-item">
                    <span class="icon"><i class="fa-solid fa-temperature-half"></i></span>
                    <span class="value">${station.latestData.tempOutC.toFixed(1)} °C</span>
                  </div>
                  <div class="station-detail-item">
                    <span class="icon"><i class="fa-solid fa-droplet"></i></span>
                    <span class="value">${station.latestData.humidityOut}%</span>
                  </div>
                  <div class="station-detail-item">
                    <span class="icon"><i class="fa-solid fa-wind"></i></span>
                    <span class="value">${station.latestData.windSpeedKmH.toFixed(1)} km/h (${getWindDirectionLabel(station.latestData.windDir)})</span>
                  </div>
                  <div class="station-detail-item">
                    <span class="icon"><i class="fa-solid fa-gauge-high"></i></span>
                    <span class="value">${station.latestData.baromAbsHPa.toFixed(1)} hPa</span>
                  </div>
                </div>
              ` : `<p class="no-data">${i18n.t('NO_WEATHER_DATA')}</p>`}
            </div>
          `).join('')}
        </div>
      </div>
    `;
    
    viewManager.render(html);
  } catch (error) {
    viewManager.showError(error.message);
  }
}
