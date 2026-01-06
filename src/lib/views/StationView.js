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
            {label: i18n.t('HOME'), url: '/'},
            {label: station.getDisplayName(), url: `/station/${id}`},
        ])}
      <div class="station-view">
        <h1 class="view-header">${i18n.t('CURRENT_WEATHER')}</h1>
        <p class="timestamp">${dateFormatter.formatDateTime(weatherData.dateUTC)}</p>
        
        <section class="current-conditions">
          <h2>${i18n.t('CURRENT_MEASUREMENTS')}</h2>
          <div class="gauges-grid">
            <div class="gauge-container">
              <h3>${i18n.t('TEMPERATURE')}</h3>
              ${tempGauge.render()}
            </div>
            
            <div class="gauge-container">
              <h3>${i18n.t('INDOOR_TEMP')}</h3>
              ${tempGaugeIndoor.render()}
            </div>
            
            <div class="gauge-container">
              <h3>${i18n.t('HUMIDITY')}</h3>
              ${humidityGauge.render()}
            </div>
            
            <div class="gauge-container">
              <h3>${i18n.t('INDOOR_HUMIDITY')}</h3>
              ${humidityGaugeIndoor.render()}
            </div>
            
            <div class="gauge-container">
              <h3>${i18n.t('DEW_POINT')}</h3>
              ${dewPointGauge.render()}
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
              ${rainGaugeDaily.render()}
            </div>
            
            <div class="gauge-container">
              <h3>${i18n.t('WEEKLY_RAIN')}</h3>
              ${rainGaugeWeekly.render()}
            </div>
            
            <div class="gauge-container">
              <h3>${i18n.t('MONTHLY_RAIN')}</h3>
              ${rainGaugeMonthly.render()}
            </div>
            
            <div class="gauge-container">
              <h3>${i18n.t('YEARLY_RAIN')}</h3>
              ${rainGaugeYearly.render()}
            </div>
            
            <div class="gauge-container">
              <h3>${i18n.t('RAIN_RATE')}</h3>
              ${rainRateGauge.render()}
            </div>
            
            <div class="gauge-container">
              <h3>${i18n.t('UV_INDEX')}</h3>
              ${uvGauge.render()}
            </div>
            
            <div class="gauge-container">
              <h3>${i18n.t('APPARENT_TEMPERATURE')}</h3>
              ${apparentTempGauge.render()}
            </div>
            
            <div class="gauge-container">
              <h3>${i18n.t('HEAT_INDEX')}</h3>
              ${heatIndexGauge.render()}
            </div>
            
            <div class="gauge-container">
              <h3>${i18n.t('WIND_GUST')}</h3>
              ${windGustGauge.render()}
            </div>
            
            <div class="gauge-container">
              <h3>${i18n.t('SOLAR_RADIATION')}</h3>
              ${solarRadiationGauge.render()}
            </div>
          </div>
        </section>
        
        <a class="btn btn-block" href="#/station/${id}/history">
          ${i18n.t('SHOW_HISTORY')} →
        </a>
      </div>
    `;

        viewManager.render(html);
    } catch (error) {
        viewManager.showError(error.message);
    }
}
