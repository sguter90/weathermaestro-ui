import {i18n} from "../i18n/i18n.js";
import {
    UNIT_BATTERY,
    UNIT_CO2,
    UNIT_HUMIDITY,
    UNIT_NOISE,
    UNIT_PRESSURE, UNIT_RAIN, UNIT_SIGNAL_STRENGTH, UNIT_SOLAR_RADIATION,
    UNIT_TEMPERATURE, UNIT_UV_INDEX, UNIT_VPD,
    UNIT_WIND_DIRECTION,
    UNIT_WIND_SPEED
} from "./units.js";

export const SENSOR_TYPE_TEMPERATURE = 'Temperature';
export const SENSOR_TYPE_HUMIDITY = 'Humidity';
export const SENSOR_TYPE_PRESSURE = 'Pressure';
export const SENSOR_TYPE_CO2 = 'CO2';
export const SENSOR_TYPE_NOISE = 'Noise';
export const SENSOR_TYPE_WIND_DIRECTION = 'WindDirection';
export const SENSOR_TYPE_WIND_SPEED = 'WindSpeed';
export const SENSOR_TYPE_WIND_SPEED_MAX_DAILY = 'WindSpeedMaxDaily';
export const SENSOR_TYPE_WIND_GUST = 'WindGust';
export const SENSOR_TYPE_WIND_GUST_ANGLE = 'WindGustAngle';
export const SENSOR_TYPE_WIND_GUST_MAX_DAILY = 'WindGustMaxDaily';
export const SENSOR_TYPE_SOLAR_RADIATION = 'SolarRadiation';
export const SENSOR_TYPE_UV_INDEX = 'UVIndex';
export const SENSOR_TYPE_RAINFALL_RATE = 'RainfallRate';
export const SENSOR_TYPE_RAINFALL_EVENT = 'RainfallEvent';
export const SENSOR_TYPE_RAINFALL_HOURLY = 'RainfallHourly';
export const SENSOR_TYPE_RAINFALL_DAILY = 'RainfallDaily';
export const SENSOR_TYPE_RAINFALL_WEEKLY = 'RainfallWeekly';
export const SENSOR_TYPE_RAINFALL_MONTHLY = 'RainfallMonthly';
export const SENSOR_TYPE_RAINFALL_YEARLY = 'RainfallYearly';
export const SENSOR_TYPE_RAINFALL_TOTAL = 'RainfallTotal';
export const SENSOR_TYPE_VPD = 'VPD';
export const SENSOR_TYPE_BATTERY = 'Battery';
export const SENSOR_TYPE_PRESSURE_RELATIVE = 'PressureRelative';
export const SENSOR_TYPE_PRESSURE_ABSOLUTE = 'PressureAbsolute';
export const SENSOR_TYPE_TEMPERATURE_OUTDOOR = 'TemperatureOutdoor';
export const SENSOR_TYPE_HUMIDITY_OUTDOOR = 'HumidityOutdoor';
export const SENSOR_TYPE_SIGNAL_STRENGTH = 'SignalStrength';

export const SENSOR_TYPES = [
    {
        name: SENSOR_TYPE_TEMPERATURE,
        title: i18n.t('SENSOR_TYPE_TEMPERATURE'),
        unit: '°C',
        unitType: UNIT_TEMPERATURE,
    },
    {
        name: SENSOR_TYPE_HUMIDITY,
        title: i18n.t('SENSOR_TYPE_HUMIDITY'),
        unit: '%',
        unitType: UNIT_HUMIDITY,
    },
    {
        name: SENSOR_TYPE_PRESSURE,
        title: i18n.t('SENSOR_TYPE_PRESSURE'),
        unit: 'hPa',
        unitType: UNIT_PRESSURE,
    },
    {
        name: SENSOR_TYPE_CO2,
        title: i18n.t('SENSOR_TYPE_CO2'),
        unit: 'ppm',
        unitType: UNIT_CO2,
    },
    {
        name: SENSOR_TYPE_NOISE,
        title: i18n.t('SENSOR_TYPE_NOISE'),
        unit: 'dB',
        unitType: UNIT_NOISE,
    },
    {
        name: SENSOR_TYPE_WIND_DIRECTION,
        title: i18n.t('SENSOR_TYPE_WIND_DIRECTION'),
        unit: '°',
        unitType: UNIT_WIND_DIRECTION,
    },
    {
        name: SENSOR_TYPE_WIND_SPEED,
        title: i18n.t('SENSOR_TYPE_WIND_SPEED'),
        unit: 'm/s',
        unitType: UNIT_WIND_SPEED,
    },
    {
        name: SENSOR_TYPE_WIND_SPEED_MAX_DAILY,
        title: i18n.t('SENSOR_TYPE_WIND_SPEED_MAX_DAILY'),
        unit: 'm/s',
        unitType: UNIT_WIND_SPEED,
    },
    {
        name: SENSOR_TYPE_WIND_GUST,
        title: i18n.t('SENSOR_TYPE_WIND_GUST'),
        unit: 'm/s',
        unitType: UNIT_WIND_SPEED,
    },
    {
        name: SENSOR_TYPE_WIND_GUST_ANGLE,
        title: i18n.t('SENSOR_TYPE_WIND_GUST_ANGLE'),
        unit: '°',
        unitType: UNIT_WIND_DIRECTION,
    },
    {
        name: SENSOR_TYPE_WIND_GUST_MAX_DAILY,
        title: i18n.t('SENSOR_TYPE_WIND_GUST_MAX_DAILY'),
        unit: 'm/s',
        unitType: UNIT_WIND_SPEED,
    },
    {
        name: SENSOR_TYPE_SOLAR_RADIATION,
        title: i18n.t('SENSOR_TYPE_SOLAR_RADIATION'),
        unit: 'W/m²',
        unitType: UNIT_SOLAR_RADIATION,
    },
    {
        name: SENSOR_TYPE_UV_INDEX,
        title: i18n.t('SENSOR_TYPE_UV_INDEX'),
        unit: 'Index',
        unitType: UNIT_UV_INDEX,
    },
    {
        name: SENSOR_TYPE_RAINFALL_RATE,
        title: i18n.t('SENSOR_TYPE_RAINFALL_RATE'),
        unit: 'mm/h',
        unitType: UNIT_RAIN,
    },
    {
        name: SENSOR_TYPE_RAINFALL_EVENT,
        title: i18n.t('SENSOR_TYPE_RAINFALL_EVENT'),
        unit: 'mm',
        unitType: UNIT_RAIN,
    },
    {
        name: SENSOR_TYPE_RAINFALL_HOURLY,
        title: i18n.t('SENSOR_TYPE_RAINFALL_HOURLY'),
        unit: 'mm',
        unitType: UNIT_RAIN,
    },
    {
        name: SENSOR_TYPE_RAINFALL_DAILY,
        title: i18n.t('SENSOR_TYPE_RAINFALL_DAILY'),
        unit: 'mm',
        unitType: UNIT_RAIN,
    },
    {
        name: SENSOR_TYPE_RAINFALL_WEEKLY,
        title: i18n.t('SENSOR_TYPE_RAINFALL_WEEKLY'),
        unit: 'mm',
        unitType: UNIT_RAIN,
    },
    {
        name: SENSOR_TYPE_RAINFALL_MONTHLY,
        title: i18n.t('SENSOR_TYPE_RAINFALL_MONTHLY'),
        unit: 'mm',
        unitType: UNIT_RAIN,
    },
    {
        name: SENSOR_TYPE_RAINFALL_YEARLY,
        title: i18n.t('SENSOR_TYPE_RAINFALL_YEARLY'),
        unit: 'mm',
        unitType: UNIT_RAIN,
    },
    {
        name: SENSOR_TYPE_RAINFALL_TOTAL,
        title: i18n.t('SENSOR_TYPE_RAINFALL_TOTAL'),
        unit: 'mm',
        unitType: UNIT_RAIN,
    },
    {
        name: SENSOR_TYPE_VPD,
        title: i18n.t('SENSOR_TYPE_VPD'),
        unit: 'kPa',
        unitType: UNIT_VPD,
    },
    {
        name: SENSOR_TYPE_BATTERY,
        title: i18n.t('SENSOR_TYPE_BATTERY'),
        unit: '%',
        unitType: UNIT_BATTERY,
    },
    {
        name: SENSOR_TYPE_PRESSURE_RELATIVE,
        title: i18n.t('SENSOR_TYPE_PRESSURE_RELATIVE'),
        unit: 'hPa',
        unitType: UNIT_PRESSURE,
    },
    {
        name: SENSOR_TYPE_PRESSURE_ABSOLUTE,
        title: i18n.t('SENSOR_TYPE_PRESSURE_ABSOLUTE'),
        unit: 'hPa',
        unitType: UNIT_PRESSURE,
    },
    {
        name: SENSOR_TYPE_TEMPERATURE_OUTDOOR,
        title: i18n.t('SENSOR_TYPE_TEMPERATURE_OUTDOOR'),
        unit: '°C',
        unitType: UNIT_TEMPERATURE,
    },
    {
        name: SENSOR_TYPE_HUMIDITY_OUTDOOR,
        title: i18n.t('SENSOR_TYPE_HUMIDITY_OUTDOOR'),
        unit: '%',
        unitType: UNIT_HUMIDITY,
    },
    {
        name: SENSOR_TYPE_SIGNAL_STRENGTH,
        title: i18n.t('SENSOR_TYPE_SIGNAL_STRENGTH'),
        unit: 'dBm',
        unitType: UNIT_SIGNAL_STRENGTH,
    },
];

export const SENSOR_GROUPS = {
    climate: {
        title: i18n.t('SENSOR_GROUP_CLIMATE'),
        icon: '🌡️',
        iconColor: 'orange',
        types: [SENSOR_TYPE_TEMPERATURE, SENSOR_TYPE_HUMIDITY, SENSOR_TYPE_CO2, SENSOR_TYPE_NOISE, SENSOR_TYPE_TEMPERATURE_OUTDOOR, SENSOR_TYPE_HUMIDITY_OUTDOOR],
    },
    rain: {
        title: i18n.t('SENSOR_GROUP_RAIN'),
        icon: '🌧️',
        iconColor: 'blue',
        types: [SENSOR_TYPE_RAINFALL_RATE, SENSOR_TYPE_RAINFALL_EVENT, SENSOR_TYPE_RAINFALL_HOURLY, SENSOR_TYPE_RAINFALL_DAILY, SENSOR_TYPE_RAINFALL_WEEKLY, SENSOR_TYPE_RAINFALL_MONTHLY, SENSOR_TYPE_RAINFALL_YEARLY, SENSOR_TYPE_RAINFALL_TOTAL]
    },
    wind: {
        title: i18n.t('SENSOR_GROUP_WIND'),
        icon: '💨',
        iconColor: 'cyan',
        types: [SENSOR_TYPE_WIND_DIRECTION, SENSOR_TYPE_WIND_SPEED, SENSOR_TYPE_WIND_SPEED_MAX_DAILY, SENSOR_TYPE_WIND_GUST, SENSOR_TYPE_WIND_GUST_ANGLE, SENSOR_TYPE_WIND_GUST_MAX_DAILY]
    },
    pressure: {
        title: i18n.t('SENSOR_GROUP_PRESSURE'),
        icon: '🔽',
        iconColor: 'purple',
        types: [SENSOR_TYPE_PRESSURE, SENSOR_TYPE_PRESSURE_RELATIVE, SENSOR_TYPE_PRESSURE_ABSOLUTE]
    },
    solar: {
        title: i18n.t('SENSOR_GROUP_SOLAR'),
        icon: '☀️',
        iconColor: 'amber',
        types: [SENSOR_TYPE_SOLAR_RADIATION, SENSOR_TYPE_UV_INDEX, SENSOR_TYPE_VPD]
    },
    device: {
        title: i18n.t('SENSOR_GROUP_DEVICE'),
        icon: '🔋',
        iconColor: 'slate',
        types: [SENSOR_TYPE_BATTERY, SENSOR_TYPE_SIGNAL_STRENGTH]
    },
};