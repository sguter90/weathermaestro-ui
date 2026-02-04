/**
 * Reading Data Model
 * Supports both standard and aggregated reading formats
 */
export class ReadingData {
    constructor(data) {
        if (data.min_value) {
            // Aggregated response format
            this.sensorId = data.sensor_id;
            this.dateUTC = data.dateutc ? new Date(data.dateutc) : null;
            this.value = data.value;
            this.count = data.count;
            this.minValue = data.min_value;
            this.maxValue = data.max_value;
            this.isAggregated = true;
        } else {
            // Standard response format
            this.id = data.id;
            this.sensorId = data.sensor_id;
            this.value = data.value;
            this.dateUTC = data.date_utc ? new Date(data.date_utc) : null;
            this.isAggregated = false;
        }
    }

    /**
     * Get formatted date string
     * @param {string} locale - Locale for formatting (default: 'de-DE')
     * @returns {string}
     */
    getFormattedDate(locale = 'de-DE') {
        if (!this.dateUTC) return 'N/A';
        return this.dateUTC.toLocaleString(locale);
    }

    /**
     * Get formatted time string
     * @param {string} locale - Locale for formatting (default: 'de-DE')
     * @returns {string}
     */
    getFormattedTime(locale = 'de-DE') {
        if (!this.dateUTC) return 'N/A';
        return this.dateUTC.toLocaleTimeString(locale);
    }

    /**
     * Get ISO string of the date
     * @returns {string}
     */
    getISOString() {
        return this.dateUTC ? this.dateUTC.toISOString() : '';
    }

    /**
     * Get Unix timestamp
     * @returns {number}
     */
    getTimestamp() {
        return this.dateUTC ? this.dateUTC.getTime() : 0;
    }

    /**
     * Check if reading is recent (within last N minutes)
     * @param {number} minutes - Number of minutes to check (default: 5)
     * @returns {boolean}
     */
    isRecent(minutes = 5) {
        if (!this.dateUTC) return false;
        const now = new Date();
        const diff = now - this.dateUTC;
        return diff < (minutes * 60 * 1000);
    }

    /**
     * Get age of reading in human-readable format
     * @returns {string}
     */
    getAge() {
        if (!this.dateUTC) return 'Unknown';

        const now = new Date();
        const diff = now - this.dateUTC;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        if (minutes > 0) return `${minutes}m ago`;
        return `${seconds}s ago`;
    }

    /**
     * Format value with optional precision
     * @param {number} precision - Number of decimal places
     * @returns {string}
     */
    getFormattedValue(precision = 1) {
        if (typeof this.value !== 'number') return String(this.value);
        return this.value.toFixed(precision);
    }

    /**
     * Get formatted min value (for aggregated data)
     * @param {number} precision - Number of decimal places
     * @returns {string}
     */
    getFormattedMinValue(precision = 1) {
        if (!this.isAggregated || typeof this.minValue !== 'number') return 'N/A';
        return this.minValue.toFixed(precision);
    }

    /**
     * Get formatted max value (for aggregated data)
     * @param {number} precision - Number of decimal places
     * @returns {string}
     */
    getFormattedMaxValue(precision = 1) {
        if (!this.isAggregated || typeof this.maxValue !== 'number') return 'N/A';
        return this.maxValue.toFixed(precision);
    }

    /**
     * Get count of readings in aggregation
     * @returns {number}
     */
    getCount() {
        return this.isAggregated ? this.count : 1;
    }

    /**
     * Check if this is an aggregated reading
     * @returns {boolean}
     */
    isAggregatedReading() {
        return this.isAggregated;
    }

    /**
     * Get value range (for aggregated data)
     * @returns {object|null}
     */
    getValueRange() {
        if (!this.isAggregated) return null;
        return {
            min: this.minValue,
            max: this.maxValue,
            avg: this.value,
            range: this.maxValue - this.minValue
        };
    }
}