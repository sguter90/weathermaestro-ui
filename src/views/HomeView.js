import { viewManager } from '../ViewManager.js';
import { router } from '../Router.js';
import * as api from '../api/client.js';

export async function renderHomeView() {
  viewManager.showLoading('Loading stations...');

  try {
    const stations = await api.getStations();
    
    const html = `
      <div class="home-view">
        <h1>Weather Stations</h1>
        <div class="stations-grid">
          ${stations.map(station => `
            <div class="station-card" onclick="router.navigate('/station/${station.id}')">
              <h3>${station.getDisplayName()}</h3>
              <p>Interval: ${station.getIntervalDisplay()}</p>
              <span class="status ${station.isActive() ? 'active' : 'inactive'}">
                ${station.isActive() ? 'Active' : 'Inactive'}
              </span>
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
