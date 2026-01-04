
import { router } from '../Router.js';
import * as api from '../api/client.js';
import { viewManager } from '../ViewManager.js';
import { getWindDirectionLabel } from '../utils/weather.js';
import { renderBreadcrumbs } from '../components/Breadcrumbs.js'; // Importiere die Breadcrumb-Komponente

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
        { label: 'Home', url: '/' },
        { label: station.getDisplayName(), url: `/station/${id}` },
        { label: 'History', url: `/station/${id}/history` }
      ])}
      <div class="history-view">
        <h1>Weather History for ${station.getDisplayName()}</h1>
        
        <div class="history-table">
          <table>
            <thead>
              <tr>
                <th><i class="fa-solid fa-clock"></i> Time</th>
                <th><i class="fa-solid fa-temperature-half"></i> Temp (°C)</th>
                <th><i class="fa-solid fa-droplet"></i> Humidity (%)</th>
                <th><i class="fa-solid fa-wind"></i> Wind (km/h)</th>
                <th><i class="fa-solid fa-compass"></i> Wind Dir</th>
                <th><i class="fa-solid fa-cloud-showers-heavy"></i> Rain (mm)</th>
                <th><i class="fa-solid fa-gauge-high"></i> Pressure (hPa)</th>
              </tr>
            </thead>
            <tbody>
              ${history.map(data => `
                <tr>
                  <td>${data.dateUTC.toLocaleString()}</td>
                  <td>${data.tempOutC !== undefined ? data.tempOutC.toFixed(1) : 'N/A'}</td>
                  <td>${data.humidityOut !== undefined ? data.humidityOut + '%' : 'N/A'}</td>
                  <td>${data.windSpeedKmH !== undefined ? data.windSpeedKmH.toFixed(1) : 'N/A'}</td>
                  <td>${data.windDir !== undefined ? getWindDirectionLabel(data.windDir) : 'N/A'}</td>
                  <td>${data.hourlyRainMm !== undefined ? data.hourlyRainMm.toFixed(1) : 'N/A'}</td>
                  <td>${data.baromAbsHPa !== undefined ? data.baromAbsHPa.toFixed(1) : 'N/A'}</td>
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
