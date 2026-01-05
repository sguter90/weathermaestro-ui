import { appConfig } from './AppConfig.js';
import { WeatherData } from './model/WeatherData.js';
import { StationData } from './model/StationData.js';

/**
 * API Client class for handling all API requests
 */
class ApiClient {
  constructor() {
    this.baseUrl = appConfig.getConfig('API_BASE_URL');
    this.apiVersion = '/api/v1';
    this.apiBaseUrl = `${this.baseUrl}${this.apiVersion}`;

    if (!this.baseUrl) {
      console.error("API_BASE_URL is not configured. Please set VITE_API_BASE_URL in .env or API_BASE_URL environment variable for Docker.");
    }
  }

  /**
   * Makes an API call
   * @param {string} endpoint The API endpoint
   * @param {object} options Fetch options
   * @returns {Promise<object>} The JSON response
   * @throws {Error} If the request fails
   */
  async callApi(endpoint, options = {}) {
    const response = await fetch(`${this.apiBaseUrl}${endpoint}`, options);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  /**
   * Fetches all weather stations
   * @returns {Promise<StationData[]>} Array of station data with latest weather
   */
  async getStations() {
    const stationsRawData = await this.callApi('/stations');

    return await Promise.all(
      stationsRawData.map(async (stationRaw) => {
        const station = new StationData(stationRaw);
        try {
          station.latestData = await this.getStationWeather(station.id);
        } catch (error) {
          console.warn(`Could not fetch latest weather for station ${station.id}:`, error.message);
          station.latestData = null;
        }
        return station;
      })
    );
  }

  /**
   * Fetches a single weather station
   * @param {string} stationId The station ID
   * @returns {Promise<StationData>} Station data
   */
  async getStation(stationId) {
    const data = await this.callApi(`/stations/${stationId}`);
    return new StationData(data);
  }

  /**
   * Fetches current weather for a station
   * @param {string} stationId The station ID
   * @returns {Promise<WeatherData>} Current weather data
   */
  async getStationWeather(stationId) {
    const data = await this.callApi(`/stations/${stationId}/weather/current`);
    return new WeatherData(data);
  }

  /**
   * Fetches weather history for a station
   * @param {string} stationId The station ID
   * @param {object} params Query parameters (limit, offset, etc.)
   * @returns {Promise<WeatherData[]>} Array of historical weather data
   */
  async getWeatherHistory(stationId, params = {}) {
    const queryParams = new URLSearchParams(params);
    const data = await this.callApi(`/stations/${stationId}/weather/history?${queryParams}`);
    return data.map(weatherData => new WeatherData(weatherData));
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
