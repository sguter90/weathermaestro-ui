
import { viewManager } from '../ViewManager.js';
import { router } from '../Router.js';
import * as api from '../api/client.js';

export async function renderHistoryView(params) {
  const { id } = params;
  viewManager.showLoading('Loading history...');

  try {
    const history = await api.getWeatherHistory(id, { limit: 24 });
    
    const html = `
      <div class="history-view">
        <button onclick="router.navigate('/station/${id}')">← Back to Station</button>
        
        <h1>Weather History</h1>
        
        <div class="history-table">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Temp (°C)</th>
                <th>Humidity</th>
                <th>Wind (km/h)</th>
                <th>Rain (mm)</th>
              </tr>
            </thead>
            <tbody>
              ${history.map(data => `
                <tr>
                  <td>${data.getFormattedDate('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}</td>
                  <td>${data.tempOutC.toFixed(1)}</td>
                  <td>${data.humidityOut}%</td>
                  <td>${data.windSpeedKmH.toFixed(1)}</td>
                  <td>${data.hourlyRainMm.toFixed(1)}</td>
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
