import { viewManager } from '../ViewManager.js';
import { router } from '../Router.js';
import * as api from '../api/client.js';
import { TemperatureGauge } from "../components/TemperatureGauge.js";
import { CircularGauge } from "../components/CircularGauge.js";
import { WindCompass } from "../components/WindCompass.js";
import { RainGauge } from "../components/RainGauge.js";
import { UVIndexGauge } from "../components/UVIndexGauge.js";
import {renderBreadcrumbs} from "../components/Breadcrumbs.js";
import {i18n} from "../i18n/i18n.js";

export async function renderStationView(params) {
  const { id } = params;
  viewManager.showLoading(i18n.t('LOADING_WEATHER_DATA'));

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
      label: i18n.t('HUMIDITY'),
      color: '#2196F3',
      id: 'humidity-gauge'
    });
    
    const pressureGauge = new CircularGauge({
      value: weatherData.baromRelHPa,
      min: 950,
      max: 1050,
      unit: 'hPa',
      label: i18n.t('PRESSURE'),
      color: '#9C27B0',
      id: 'pressure-gauge'
    });
    
    const rainGauge = new RainGauge({
      value: weatherData.dailyRainMm,
      min: 0,
      max: 100,
      unit: 'mm',
      label: i18n.t('DAILY_RAIN'),
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
        { label: i18n.t('HOME'), url: '/' },
        { label: station.getDisplayName(), url: `/station/${id}` },
      ])}
      <div class="station-view">
        <h1>${i18n.t('CURRENT_WEATHER')}</h1>
        <p class="timestamp">${weatherData.getFormattedDate()}</p>
        
        <section class="current-conditions">
          <h2>${i18n.t('CURRENT_MEASUREMENTS')}</h2>
          <div class="gauges-grid">
            <div class="gauge-container">
              <h3>${i18n.t('TEMPERATURE')}</h3>
              ${tempGauge.render()}
            </div>
            
            <div class="gauge-container">
              <h3>${i18n.t('HUMIDITY')}</h3>
              ${humidityGauge.render()}
            </div>
            
            <div class="gauge-container">
              <h3>${i18n.t('WIND')}</h3>
              ${windCompass.render()}
            </div>
            
            <div class="gauge-container">
              <h3>${i18n.t('PRESSURE')}</h3>
              ${pressureGauge.render()}
            </div>
            
            <div class="gauge-container">
              <h3>${i18n.t('DAILY_RAIN')}</h3>
              ${rainGauge.render()}
            </div>
            
            <div class="gauge-container">
              <h3>${i18n.t('UV_INDEX')}</h3>
              ${uvGauge.render()}
              <p class="gauge-info">${weatherData.getUVCategory()}</p>
            </div>
          </div>
        </section>
        
        <section class="weather-details">
          <h2>${i18n.t('ADDITIONAL_DETAILS')}</h2>
          <div class="details-grid">
            <div class="detail-card">
              <span class="detail-label">${i18n.t('HOURLY_RAIN')}</span>
              <span class="detail-value">${weatherData.hourlyRainMm.toFixed(1)} mm</span>
            </div>
            
            <div class="detail-card">
              <span class="detail-label">${i18n.t('SOLAR_RADIATION')}</span>
              <span class="detail-value">${weatherData.solarRadiation} W/m²</span>
            </div>
            
            <div class="detail-card">
              <span class="detail-label">${i18n.t('INDOOR_TEMP')}</span>
              <span class="detail-value">${weatherData.tempInC.toFixed(1)}°C</span>
            </div>
            
            <div class="detail-card">
              <span class="detail-label">${i18n.t('INDOOR_HUMIDITY')}</span>
              <span class="detail-value">${weatherData.humidityIn}%</span>
            </div>
          </div>
        </section>
        
        <button class="history-button" onclick="router.navigate('/station/${id}/history')">
          ${i18n.t('SHOW_HISTORY')} →
        </button>
      </div>
    `;
    
    viewManager.render(html);
  } catch (error) {
    viewManager.showError(error.message);
  }
}
