import {WeatherData} from './dto/WeatherData.js';
import {StationData} from './dto/StationData.js';
import {getConfig} from "../utils/config.js";

const API_BASE_URL = getConfig('API_BASE_URL')

if (!API_BASE_URL) {
    console.error("API_BASE_URL is not configured. Please set VITE_API_BASE_URL in .env or API_BASE_URL environment variable for Docker.");
}

async function callApi(endpoint, options = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({message: 'Unknown error'}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
}

export async function getStations() {
    const stationsRawData = await callApi('/stations');

    return await Promise.all(
        stationsRawData.map(async (stationRaw) => {
            const station = new StationData(stationRaw);
            try {
                station.latestData = await getStationWeather(station.id);
            } catch (error) {
                console.warn(`Could not fetch latest weather for station ${station.id}:`, error.message);
                station.latestData = null;
            }
            return station;
        })
    );
}

export async function getStation(stationId) {
    const data = await callApi(`/stations/${stationId}`);
    return new StationData(data);
}

export async function getStationWeather(stationId) {
    const data = await callApi(`/stations/${stationId}/weather/current`);
    return new WeatherData(data);
}

export async function getWeatherHistory(stationId, params = {}) {
    const queryParams = new URLSearchParams(params);
    const data = await callApi(`/stations/${stationId}/weather/history?${queryParams}`);
    return data.map(weatherData => new WeatherData(weatherData));
}
