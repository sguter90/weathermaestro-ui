import {appConfig} from './AppConfig.js';
import {StationData} from '../model/StationData.js';
import {SensorData} from '../model/SensorData.js';
import {ReadingData} from '../model/ReadingData.js';
import {DashboardData} from "../model/DashboardData.js";

/**
 * API Client class for handling all API requests
 */
class ApiClient {
    constructor() {
        this.baseUrl = appConfig.getConfig('API_BASE_URL');
        this.apiVersion = '/api/v1';
        this.apiBaseUrl = `${this.baseUrl}${this.apiVersion}`;
        this.authManager = null; // Will be set later to avoid circular dependency

        if (!this.baseUrl) {
            console.error("API_BASE_URL is not configured. Please set VITE_API_BASE_URL in .env or API_BASE_URL environment variable for Docker.");
        }
    }

    /**
     * Set auth manager reference (called from AuthManager)
     * @param {AuthManager} authManager
     */
    setAuthManager(authManager) {
        this.authManager = authManager;
    }

    /**
     * Makes an API call
     * @param {string} endpoint The API endpoint
     * @param {object} options Fetch options
     * @returns {Promise<object>} The JSON response
     * @throws {Error} If the request fails
     */
    async callApi(endpoint, options = {}) {
        // Automatically add Authorization header if token is available
        if (this.authManager && this.authManager.token) {
            options.headers = {
                ...options.headers,
                'Authorization': `Bearer ${this.authManager.token}`
            };
        }
        const response = await fetch(`${this.apiBaseUrl}${endpoint}`, options);
        // Handle 204 No Content - no body to parse
        if (response.status === 204) {
            return null;
        }
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({message: 'Unknown error'}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    /**
     * Login with username and password
     * @param {string} username
     * @param {string} password
     * @returns {Promise<object>} Login response with token and user data
     */
    async login(username, password) {
        return this.callApi('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
    }

    /**
     * Logout current user
     * @param {string} token Authorization token
     * @returns {Promise<object>}
     */
    async logout(token) {
        return this.callApi('/auth/logout', {
            method: 'POST',
        });
    }

    /**
     * Refresh access token
     * @returns {Promise<object>} New token data
     */
    async refreshToken() {
        return this.callApi('/auth/refresh', {
            method: 'POST',
        });
    }

    /**
     * Get current user info
     * @returns {Promise<object>} User data
     */
    async getUserInfo() {
        return this.callApi('/auth/me', {
            headers: {
                'Content-Type': 'application/json'
            },
        });
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

    /**
     * Get all dashboards
     * @returns {Promise<DashboardData[]>} Array of dashboards
     */
    async getDashboards() {
        const response = await this.callApi('/dashboards');
        return response.map(item => new DashboardData(item));
    }

    /**
     * Get single dashboard by ID
     * @param {string} dashboardId Dashboard UUID
     * @returns {Promise<DashboardData>} Dashboard data
     */
    async getDashboard(dashboardId) {
        const response = await this.callApi(`/dashboards/${dashboardId}`);
        return new DashboardData(response);
    }

    /**
     * Create new dashboard (requires auth)
     * @param {DashboardData|object} dashboard Dashboard data
     * @returns {Promise<DashboardData>} Created dashboard
     */
    async createDashboard(dashboard) {
        const data = dashboard instanceof DashboardData
            ? dashboard.toApiFormat()
            : dashboard;

        const response = await this.callApi('/dashboards', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        return new DashboardData(response);
    }

    /**
     * Update existing dashboard (requires auth)
     * @param {string} dashboardId Dashboard UUID
     * @param {DashboardData|object} dashboard Dashboard data
     * @returns {Promise<DashboardData>} Updated dashboard
     */
    async updateDashboard(dashboardId, dashboard) {
        const data = dashboard instanceof DashboardData
            ? dashboard.toApiFormat()
            : dashboard;

        const response = await this.callApi(`/dashboards/${dashboardId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        return new DashboardData(response);
    }

    /**
     * Delete dashboard (requires auth)
     * @param {string} dashboardId Dashboard UUID
     * @returns {Promise<void>}
     */
    async deleteDashboard(dashboardId) {
        await this.callApi(`/dashboards/${dashboardId}`, {
            method: 'DELETE'
        });
    }
}

// Export singleton instance
export const apiClient = new ApiClient();