
import { viewManager } from '../ViewManager.js';
import { router } from '../Router.js';
import * as api from '../api/client.js';
import { TemperatureGauge } from "../components/TemperatureGauge.js";
import { CircularGauge } from "../components/CircularGauge.js";
import { WindCompass } from "../components/WindCompass.js";
import { RainGauge } from "../components/RainGauge.js";
import { UVIndexGauge } from "../components/UVIndexGauge.js";
import {renderBreadcrumbs} from "../components/Breadcrumbs.js";

export async function renderStationView(params) {
  const { id } = params;
  viewManager.showLoading('Loading weather data...');

  try {
    const station = await api.getStation(id);
    const weatherData = await api.getStationWeather(id);
    
    // Create gauges
    const tempGauge = new TemperatureGauge({
      value: weatherData.tempOutC,
      min: -40,
      max: 60,
      unit: '°C',
      id: 'temp-gauge'
    });
    
    const humidityGauge = new CircularGauge({
      value: weatherData.humidityOut,
      min: 0,
      max: 100,
      unit: '%',
      label: 'Humidity',
      color: '#2196F3',
      id: 'humidity-gauge'
    });
    
    const pressureGauge = new CircularGauge({
      value: weatherData.baromRelHPa,
      min: 950,
      max: 1050,
      unit: 'hPa',
      label: 'Pressure',
      color: '#9C27B0',
      id: 'pressure-gauge'
    });
    
    const rainGauge = new RainGauge({
      value: weatherData.dailyRainMm,
      min: 0,
      max: 100,
      unit: 'mm',
      label: 'Daily Rain',
      id: 'rain-gauge'
    });
    
    const windCompass = new WindCompass({
      direction: weatherData.windDir,
      speed: weatherData.windSpeedKmH,
      unit: 'km/h',
      id: 'wind-compass'
    });
    
    const uvGauge = new UVIndexGauge({
      value: weatherData.uv ,
      id: 'uv-gauge',
    });
    
    const html = `
      ${renderBreadcrumbs([
        { label: 'Home', url: '/' },
        { label: station.getDisplayName(), url: `/station/${id}` },
      ])}
      <div class="station-view">
        <h1>Current Weather</h1>
        <p class="timestamp">${weatherData.getFormattedDate()}</p>
        
        <section class="current-conditions">
          <h2>Current Measurements</h2>
          <div class="gauges-grid">
            <div class="gauge-container">
              <h3>Temperature</h3>
              ${tempGauge.render()}
            </div>
            
            <div class="gauge-container">
              <h3>Humidity</h3>
              ${humidityGauge.render()}
            </div>
            
            <div class="gauge-container">
              <h3>Wind</h3>
              ${windCompass.render()}
            </div>
            
            <div class="gauge-container">
              <h3>Pressure</h3>
              ${pressureGauge.render()}
            </div>
            
            <div class="gauge-container">
              <h3>Daily Rain</h3>
              ${rainGauge.render()}
            </div>
            
            <div class="gauge-container">
              <h3>UV Index</h3>
              ${uvGauge.render()}
              <p class="gauge-info">${weatherData.getUVCategory()}</p>
            </div>
          </div>
        </section>
        
        <section class="weather-details">
          <h2>Additional Details</h2>
          <div class="details-grid">
            <div class="detail-card">
              <span class="detail-label">Rain (Hourly)</span>
              <span class="detail-value">${weatherData.hourlyRainMm.toFixed(1)} mm</span>
            </div>
            
            <div class="detail-card">
              <span class="detail-label">Solar Radiation</span>
              <span class="detail-value">${weatherData.solarRadiation} W/m²</span>
            </div>
            
            <div class="detail-card">
              <span class="detail-label">Indoor Temp</span>
              <span class="detail-value">${weatherData.tempInC.toFixed(1)}°C</span>
            </div>
            
            <div class="detail-card">
              <span class="detail-label">Indoor Humidity</span>
              <span class="detail-value">${weatherData.humidityIn}%</span>
            </div>
          </div>
        </section>
        
        <button class="history-button" onclick="router.navigate('/station/${id}/history')">
          View History →
        </button>
      </div>
    `;
    
    viewManager.render(html);
  } catch (error) {
    viewManager.showError(error.message);
  }
}
