import {Weather} from "./Weather.js";
import {Temperature} from "../components/metric/Temperature.js";
import {Humidity} from "../components/metric/Humidity.js";
import {Pressure} from "../components/metric/Pressure.js";
import {CO2} from "../components/metric/CO2.js";
import {Noise} from "../components/metric/Noise.js";
import {Solar} from "../components/metric/Solar.js";
import {WindRose} from "../components/metric/WindRose.js";
import {WindSpeed} from "../components/metric/WindSpeed.js";
import {Rain} from "../components/metric/Rain.js";
import {
    SENSOR_TYPE_HUMIDITY,
    SENSOR_TYPE_HUMIDITY_OUTDOOR, SENSOR_TYPE_RAINFALL_HOURLY,
    SENSOR_TYPE_UV_INDEX, SENSOR_TYPE_WIND_GUST,
    SENSOR_TYPE_WIND_SPEED
} from "../config/sensor_types.js";

export class MetricReader {
    constructor(sensors, readings) {
        this.sensors = sensors;
        this.readings = readings;
    }

    /**
     * Get sensor object by type and location
     * @param {string} sensorType - Sensor type to find
     * @param {string} location - Location to match
     * @returns {SensorData} Sensor object or null if not found
     */
    getSensorByTypeAndLocation(sensorType, location) {
        return this.sensors.find(s =>
            s.sensorType === sensorType && s.location === location
        );
    }

    /**
     * Get value from a sensor by type and location
     * @param {string} sensorType - Sensor type to find
     * @param {string} location - Location to match
     * @returns {number} Sensor value or 0 if not found
     */
    getSensorValueForTypeAndLocation(sensorType, location) {
        const sensor = this.getSensorByTypeAndLocation(sensorType, location)
        if (!sensor) {
            return 0;
        }

        const reading = this.readings.find(r => r.sensorId === sensor.id);

        return reading ? parseFloat(reading.getFormattedValue(1)) : 0;
    }

    /**
     * Get reading object by sensor ID
     * @param {string} sensorId - Sensor ID to find
     * @returns {ReadingData|null} Reading object or null if not found
     */
    getSensorReadingBySensorId(sensorId) {
        return this.readings.find(r => r.sensorId === sensorId);
    }

    /**
     * Create a metric component based on the sensor type
     * @param sensor
     * @returns {Rain|Temperature|Humidity|Noise|Solar|null|WindSpeed|WindRose|CO2|Pressure|null}
     */
    createComponent(sensor) {
        const reading = this.getSensorReadingBySensorId(sensor.id)
        if (!reading) {
            return null;
        }

        const value = reading.getFormattedValue(1);
        const displayName = sensor.getDisplayName();

        let component = null;
        switch (sensor.sensorType) {
            case 'Temperature':
            case 'TemperatureOutdoor':
                const humidity = this.getSensorByTypeAndLocation(SENSOR_TYPE_HUMIDITY, sensor.location) || this.getSensorByTypeAndLocation(SENSOR_TYPE_HUMIDITY_OUTDOOR, sensor.location);
                const windSpeedMS = this.getSensorByTypeAndLocation(SENSOR_TYPE_WIND_SPEED, sensor.location);
                const windSpeedKmH = windSpeedMS * 3.6;

                component = new Temperature();
                component.actual = parseFloat(value);
                component.feelsLike = Weather.getApparentTemp(value, windSpeedKmH, humidity);
                component.unit = '°C';
                component.minTemp = -10;
                component.maxTemp = 50;
                return component;
            case 'Humidity':
            case 'HumidityOutdoor':
                component = new Humidity();
                component.humidity = parseFloat(value);
                component.label = displayName;
                return component;
            case 'Pressure':
                component = new Pressure();
                component.pressure = parseFloat(value);
                component.unit = 'hPa';
                return component;
            case 'PressureRelative':
                component = new Pressure();
                component.pressure = parseFloat(value);
                component.unit = 'hPa';
                return component;
            case 'PressureAbsolute':
                component = new Pressure();
                component.pressure = parseFloat(value);
                component.unit = 'hPa';
                return component;
            case 'CO2':
                component = new CO2();
                component.co2Level = parseFloat(value);
                component.co2Quality = 'Good Air Quality';
                component.unit = 'ppm';
                return component;
            case 'Noise':
                component = new Noise();
                component.noiseLevel = parseFloat(value);
                component.noiseCategory = 'Normal';
                component.unit = 'dB';
                return component;
            case 'SolarRadiation':
                component = new Solar();
                component.solarRadiation = parseFloat(value);
                component.uvIndex = this.getSensorValueForTypeAndLocation(SENSOR_TYPE_UV_INDEX, sensor.location);
                component.unit = 'W/m²';
                return component;
            case 'WindDirection':
                component = new WindRose();
                component.windDirection = parseFloat(value);
                component.windUnit = '°';
                component.windDirectionLabel = Weather.getWindDirectionLabel(parseFloat(value));
                component.windGust = 0;
                component.windCategory = 'Calm';
                return component;
            case 'WindSpeed':
                component = new WindSpeed();
                component.direction = 0;
                component.speed = parseFloat(value);
                component.gust = this.getSensorValueForTypeAndLocation(SENSOR_TYPE_WIND_GUST, sensor.location);
                component.unit = 'm/s';
                return component;
            case 'RainfallDaily':
                component = new Rain();
                component.dailyRain = parseFloat(value);
                component.hourlyRain = this.getSensorValueForTypeAndLocation(SENSOR_TYPE_RAINFALL_HOURLY, sensor.location);
                component.unit = 'mm';
                return component;
        }

        return null;
    }

}