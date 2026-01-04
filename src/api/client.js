import {WeatherData} from './dto/WeatherData.js';
import {StationData} from './dto/StationData.js';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8059/api/v1';

export async function getStations() {
    const response = await fetch(`${API_BASE}/stations`);
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch stations: ${response.status} ${response.statusText} - ${errorText}`);
    }
    const stationsRawData = await response.json();

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
    const response = await fetch(`${API_BASE}/stations/${stationId}`);
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch stations: ${response.status} ${response.statusText} - ${errorText}`);
    }
    const data = await response.json();
    return new StationData(data);
}

export async function getStationWeather(stationId) {
    const response = await fetch(`${API_BASE}/stations/${stationId}/weather/current`);
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch weather data for station ${stationId}: ${response.status} ${response.statusText} - ${errorText}`);
    }
    const data = await response.json();
    return new WeatherData(data);
}

export async function getWeatherHistory(stationId, params = {}) {
    const queryParams = new URLSearchParams(params);
    const response = await fetch(
        `${API_BASE}/stations/${stationId}/weather/history?${queryParams}`
    );
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch history for station ${stationId}: ${response.status} ${response.statusText} - ${errorText}`);
    }
    const data = await response.json();
    return data.map(weatherData => new WeatherData(weatherData));
}
