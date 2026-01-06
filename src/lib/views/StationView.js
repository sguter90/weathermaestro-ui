import {viewManager} from '../ViewManager.js';
import {TemperatureGauge} from "../components/TemperatureGauge.js";
import {CircularGauge} from "../components/CircularGauge.js";
import {WindCompass} from "../components/WindCompass.js";
import {RainGauge} from "../components/RainGauge.js";
import {UVIndexGauge} from "../components/UVIndexGauge.js";
import {DewPointGauge} from "../components/DewPointGauge.js";
import {WindGustGauge} from "../components/WindGustGauge.js";
import {SolarRadiationGauge} from "../components/SolarRadiationGauge.js";
import {renderBreadcrumbs} from "../components/Breadcrumbs.js";
import {i18n} from "../i18n/i18n.js";
import {dateFormatter} from "../DateFormatter.js";
import {apiClient} from "../ApiClient.js";
import {Tabs} from "../components/Tabs.js";
import {renderIcon} from "../components/Icons.js";

export async function renderStationView(params) {
    const {id} = params;

    viewManager.showLoading(i18n.t('LOADING_WEATHER_DATA'));

    try {
        const station = await apiClient.getStation(id);
        const weatherData = await apiClient.getStationWeather(id);

        const tempGauge = new TemperatureGauge({
            value: weatherData.getOutdoorTemp(),
            min: -40,
            max: 60,
            unit: weatherData.getTempUnit(),
            id: 'temp-gauge'
        });

        const tempGaugeIndoor = new TemperatureGauge({
            value: weatherData.getIndoorTemp(),
            min: -40,
            max: 60,
            unit: weatherData.getTempUnit(),
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

        const humidityGaugeIndoor = new CircularGauge({
            value: weatherData.humidityIn,
            min: 0,
            max: 100,
            unit: '%',
            label: i18n.t('HUMIDITY'),
            color: '#2196F3',
            id: 'humidity-gauge'
        });

        // Apparent temperature (feels like) gauge
        const apparentTempGauge = new TemperatureGauge({
            value: weatherData.getApparentTemp(),
            min: -40,
            max: 60,
            unit: weatherData.getTempUnit(),
            id: 'apparent-temp-gauge'
        });

        const dewPointGauge = new DewPointGauge({
            value: weatherData.getDewPoint(),
            min: -40,
            max: 40,
            unit: weatherData.getTempUnit(),
            id: 'dewpoint-gauge'
        });

        const pressureGauge = new CircularGauge({
            value: weatherData.getPressure(),
            min: 950,
            max: 1050,
            unit: weatherData.getPressureUnit(),
            label: i18n.t('PRESSURE'),
            color: '#9C27B0',
            id: 'pressure-gauge'
        });

        const rainGaugeDaily = new RainGauge({
            value: weatherData.getDailyRain(),
            min: 0,
            max: weatherData.getRainMax(),
            unit: weatherData.getRainUnit(),
            label: i18n.t('DAILY_RAIN'),
            id: 'rain-gauge'
        });

        const rainGaugeWeekly = new RainGauge({
            value: weatherData.getWeeklyRain(),
            min: 0,
            max: weatherData.getRainMax(),
            unit: weatherData.getRainUnit(),
            label: i18n.t('WEEKLY_RAIN'),
            id: 'rain-gauge'
        });

        const rainGaugeMonthly = new RainGauge({
            value: weatherData.getMonthlyRain(),
            min: 0,
            max: weatherData.getRainMax(),
            unit: weatherData.getRainUnit(),
            label: i18n.t('WEEKLY_RAIN'),
            id: 'rain-gauge'
        });

        const rainGaugeYearly = new RainGauge({
            value: weatherData.getYearlyRain(),
            min: 0,
            max: weatherData.getRainMax(),
            unit: weatherData.getRainUnit(),
            label: i18n.t('YEARLY_RAIN'),
            id: 'rain-gauge'
        });

        const rainRateGauge = new CircularGauge({
            value: weatherData.getRainRate(),
            min: 0,
            max: 50,
            unit: weatherData.getRainUnit() + '/h',
            label: i18n.t('RAIN_RATE'),
            id: 'rain-rate-gauge'
        });

        const windCompass = new WindCompass({
            direction: weatherData.windDir,
            speed: weatherData.getWindSpeed(),
            unit: weatherData.getWindUnit(),
            id: 'wind-compass'
        });

        const windGustGauge = new WindGustGauge({
            currentGust: weatherData.getWindGust(),
            maxDailyGust: weatherData.getMaxDailyGust(),
            min: 0,
            max: 100,
            unit: weatherData.getWindUnit(),
            id: 'wind-gust-gauge'
        });

        const uvGauge = new UVIndexGauge({
            value: weatherData.uv,
            id: 'uv-gauge',
        });

        const heatIndexGauge = new TemperatureGauge({
            value: weatherData.getHeatIndex(),
            min: -40,
            max: 60,
            unit: weatherData.getTempUnit(),
            id: 'heat-index-gauge'
        });

        const solarRadiationGauge = new SolarRadiationGauge({
            solarRadiation: weatherData.solarRadiation,
            unit: 'W/m²',
            id: 'solar-radiation-gauge'
        });

        const html = `
      ${renderBreadcrumbs([
            {label: `<span class="icon icon-sm">${renderIcon('home')}</span>`, url: '/'},
            {label: station.getDisplayName(), url: `/station/${id}`},
        ])}
      <div class="view station-view">
        <div class="view-header-container">
          <div>
            <h1 class="view-header">${i18n.t('CURRENT_WEATHER')}</h1>
            <p class="timestamp">${dateFormatter.formatDateTime(weatherData.dateUTC)}</p>
          </div>
          <a href="#/station/${id}/history" class="btn">
            <span class="icon">${renderIcon('wind')}</span>
            ${i18n.t('HISTORY')}
          </a>
        </div>
        <br />
      <!-- TABS CONTAINER -->
          <div class="tabs-container" role="tablist">
            <div class="tabs-header">
              <!-- OUTDOOR TAB -->
              <input 
                type="radio" 
                name="weather-tabs" 
                id="tab-outdoor" 
                checked
                role="tab"
                aria-selected="true"
                aria-controls="outdoor-pane"
              >
              <label for="tab-outdoor">
                <span class="icon">${renderIcon('weather')}</span>
                ${i18n.t('OUTDOOR')}
              </label>
              
              <!-- INDOOR TAB -->
              <input 
                type="radio" 
                name="weather-tabs" 
                id="tab-indoor"
                role="tab"
                aria-selected="false"
                aria-controls="indoor-pane"
              >
              <label for="tab-indoor">
                <span class="icon">${renderIcon('house')}</span>
                ${i18n.t('INDOOR')}
              </label>
              
              <!-- WIND TAB -->
              <input 
                type="radio" 
                name="weather-tabs" 
                id="tab-wind"
                role="tab"
                aria-selected="false"
                aria-controls="wind-pane"
              >
              <label for="tab-wind">
                <span class="icon">${renderIcon('wind')}</span>
                ${i18n.t('WIND')}
              </label>
              
              <!-- RAIN TAB -->
              <input 
                type="radio" 
                name="weather-tabs" 
                id="tab-rain"
                role="tab"
                aria-selected="false"
                aria-controls="rain-pane"
              >
              <label for="tab-rain">
                <span class="icon">${renderIcon('droplet')}</span> 
                ${i18n.t('RAIN')}
              </label>
              
              <!-- ATMOSPHERE TAB -->
              <input 
                type="radio" 
                name="weather-tabs" 
                id="tab-atmosphere"
                role="tab"
                aria-selected="false"
                aria-controls="atmosphere-pane"
              >
              <label for="tab-atmosphere">
                <span class="icon">${renderIcon('sphere')}</span> 
                ${i18n.t('ATMOSPHERE')}
              </label>
            </div>
            
            <div class="tabs-content">
              <!-- OUTDOOR PANE -->
              <div class="tab-pane" id="outdoor-pane" role="tabpanel" aria-labelledby="tab-outdoor">
                <div class="gauges-grid">
                  <div class="gauge-container">
                    <h2>${i18n.t('TEMPERATURE')}</h2>
                    ${tempGauge.render()}
                  </div>
                  
                  <div class="gauge-container">
                    <h2>${i18n.t('HUMIDITY')}</h2>
                    ${humidityGauge.render()}
                  </div>
                  
                  <div class="gauge-container">
                    <h2>${i18n.t('DEW_POINT')}</h2>
                    ${dewPointGauge.render()}
                  </div>
                  
                  <div class="gauge-container">
                    <h2>${i18n.t('APPARENT_TEMPERATURE')}</h2>
                    ${apparentTempGauge.render()}
                  </div>
                  
                  <div class="gauge-container">
                    <h2>${i18n.t('HEAT_INDEX')}</h2>
                    ${heatIndexGauge.render()}
                  </div>
                </div>
              </div>
              
              <!-- INDOOR PANE -->
              <div class="tab-pane" id="indoor-pane" role="tabpanel" aria-labelledby="tab-indoor" hidden>
                <div class="gauges-grid">
                  <div class="gauge-container">
                    <h2>${i18n.t('INDOOR_TEMP')}</h2>
                    ${tempGaugeIndoor.render()}
                  </div>
                  
                  <div class="gauge-container">
                    <h2>${i18n.t('INDOOR_HUMIDITY')}</h2>
                    ${humidityGaugeIndoor.render()}
                  </div>
                </div>
              </div>
              
              <!-- WIND PANE -->
              <div class="tab-pane" id="wind-pane" role="tabpanel" aria-labelledby="tab-wind" hidden>
                <div class="gauges-grid">
                  <div class="gauge-container">
                    <h2>${i18n.t('WIND')}</h2>
                    ${windCompass.render()}
                  </div>
                  
                  <div class="gauge-container">
                    <h2>${i18n.t('WIND_GUST')}</h2>
                    ${windGustGauge.render()}
                  </div>
                </div>
              </div>
              
              <!-- RAIN PANE -->
              <div class="tab-pane" id="rain-pane" role="tabpanel" aria-labelledby="tab-rain" hidden>
                <div class="gauges-grid">
                  <div class="gauge-container">
                    <h2>${i18n.t('DAILY_RAIN')}</h2>
                    ${rainGaugeDaily.render()}
                  </div>
                  
                  <div class="gauge-container">
                    <h2>${i18n.t('WEEKLY_RAIN')}</h2>
                    ${rainGaugeWeekly.render()}
                  </div>
                  
                  <div class="gauge-container">
                    <h2>${i18n.t('MONTHLY_RAIN')}</h2>
                    ${rainGaugeMonthly.render()}
                  </div>
                  
                  <div class="gauge-container">
                    <h2>${i18n.t('YEARLY_RAIN')}</h2>
                    ${rainGaugeYearly.render()}
                  </div>
                  
                  <div class="gauge-container">
                    <h2>${i18n.t('RAIN_RATE')}</h2>
                    ${rainRateGauge.render()}
                  </div>
                </div>
              </div>
              
              <!-- ATMOSPHERE PANE -->
              <div class="tab-pane" id="atmosphere-pane" role="tabpanel" aria-labelledby="tab-atmosphere" hidden>
                <div class="gauges-grid">
                  <div class="gauge-container">
                    <h2>${i18n.t('PRESSURE')}</h2>
                    ${pressureGauge.render()}
                  </div>
                  
                  <div class="gauge-container">
                    <h2>${i18n.t('UV_INDEX')}</h2>
                    ${uvGauge.render()}
                  </div>
                  
                  <div class="gauge-container">
                    <h2>${i18n.t('SOLAR_RADIATION')}</h2>
                    ${solarRadiationGauge.render()}
                  </div>
                </div>
              </div>
          </div>
        </section>
      </div>
    `;

        viewManager.render(html);

        new Tabs('.tabs-container');

    } catch (error) {
        viewManager.showError(error.message);
    }
}
