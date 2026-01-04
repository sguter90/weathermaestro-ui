import { WeatherData } from './dto/WeatherData.js';
import { StationData } from './dto/StationData.js';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8059/api/v1';

export async function getStations() {
    const response = await fetch(`${API_BASE}/stations`);
    if (!response.ok) throw new Error('Failed to fetch stations');
    const data = await response.json();
    return data.map(station => new StationData(station));
}

export async function getStationWeather(stationId) {
    const response = await fetch(`${API_BASE}/stations/${stationId}/weather/current`);
    if (!response.ok) throw new Error('Failed to fetch weather data');
    const data = await response.json();
    return new WeatherData(data);
}

export async function getWeatherHistory(stationId, params = {}) {
    const queryParams = new URLSearchParams(params);
    const response = await fetch(
        `${API_BASE}/stations/${stationId}/weather/history?${queryParams}`
    );
    if (!response.ok) throw new Error('Failed to fetch history');
    const data = await response.json();
    return data.map(weatherData => new WeatherData(weatherData));
}
