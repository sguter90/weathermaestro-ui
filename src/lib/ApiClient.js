import {appConfig} from './AppConfig.js';
import {StationData} from '../model/StationData.js';
import {SensorData} from '../model/SensorData.js';
import {ReadingData} from '../model/ReadingData.js';

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
            const errorData = await response.json().catch(() => ({message: 'Unknown error'}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        return response.json();
    }

    /**
     * Fetches all weather stations with their latest readings
     * @returns {Promise<StationData[]>} Array of station data with latest readings
     */
    async getStations() {
        const stationsRawData = await this.callApi('/stations');

        return stationsRawData.map(stationRaw => new StationData(stationRaw));
    }

    /**
     * Fetches a single weather station with its latest readings
     * @param {string} stationId The station ID
     * @returns {Promise<StationData>} Station data with latest readings
     */
    async getStation(stationId) {
        const data = await this.callApi(`/stations/${stationId}`);
        const station = new StationData(data);

        // Load latest readings
        try {
            const sensors = await this.getStationSensors(stationId);
            const readingsResponse = await this.getReadings({
                station_id: stationId,
                order: 'desc',
                group_by: 'sensor'
            });

            station.setLatestData(readingsResponse.data);
            station.setSensors(sensors);
        } catch (error) {
            console.error(`Failed to load latest data for station ${stationId}:`, error);
            station.setLatestData(null);
            station.setSensors([]);
        }

        return station;
    }


    /**
     * Fetches all sensors for a station
     * @param {string} stationId The station ID
     * @returns {Promise<SensorData[]>} Array of sensor data
     */
    async getStationSensors(stationId) {
        const response = await this.callApi(`/stations/${stationId}/sensors`);
        return response.map(item => new SensorData(item.sensor));
    }

    /**
     * Fetches readings with flexible query parameters
     * @param {object} params Query parameters
     * @param {string} params.station_id - Filter by station UUID
     * @param {string} params.sensor_id - Filter by sensor UUID (comma-separated)
     * @param {string} params.sensor_type - Filter by sensor type
     * @param {string} params.location - Filter by sensor location
     * @param {string} params.start - Start time (RFC3339 or Unix timestamp)
     * @param {string} params.end - End time (RFC3339 or Unix timestamp)
     * @param {number} params.limit - Max number of results (default: 100, max: 10000)
     * @param {number} params.offset - Pagination offset
     * @param {string} params.order - Sort order (asc/desc, default: desc)
     * @param {string} params.aggregate - Aggregation interval (1m, 5m, 15m, 1h, 6h, 1d, 1w, 1M)
     * @param {string} params.aggregate_func - Aggregation function (avg, min, max, sum, count, first, last)
     * @param {string} params.group_by - Group results by (sensor, sensor_type, location)
     * @returns {Promise<object>} Readings response with data, pagination info
     */
    async getReadings(params = {}) {
        const queryParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                queryParams.append(key, value);
            }
        });

        const response = await this.callApi(`/readings?${queryParams}`);

        return {
            data: response.data.map(reading => new ReadingData(reading)),
            total: response.total,
            page: response.page,
            totalPages: response.total_pages,
            limit: response.limit,
            hasMore: response.has_more,
            isAggregated: response.is_aggregated,
        };
    }

    /**
     * Helper: Group readings by timestamp
     * @private
     */
    groupReadingsByTime(readings) {
        return readings.reduce((acc, reading) => {
            const timestamp = reading.dateUTC.toISOString();
            if (!acc[timestamp]) {
                acc[timestamp] = [];
            }
            acc[timestamp].push(reading);
            return acc;
        }, {});
    }

    /**
     * Fetches aggregated data for charts
     * @param {string} stationId The station ID
     * @param {string} sensorType Sensor type to aggregate
     * @param {string} interval Aggregation interval (1h, 6h, 1d, etc.)
     * @param {string} func Aggregation function (avg, min, max)
     * @param {object} timeRange Time range {start, end}
     * @returns {Promise<Array>} Aggregated data points
     */
    async getAggregatedData(stationId, sensorType, interval = '1h', func = 'avg', timeRange = {}) {
        const readingsResponse = await this.getReadings({
            station_id: stationId,
            sensor_type: sensorType,
            aggregate: interval,
            aggregate_func: func,
            group_by: 'sensor',
            order: 'asc',
            ...timeRange
        });

        return readingsResponse.data;
    }
}

// Export singleton instance
export const apiClient = new ApiClient();