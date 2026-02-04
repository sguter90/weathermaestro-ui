export const UNIT_TEMPERATURE = 'temperature';
export const UNIT_WIND_SPEED = 'windSpeed';
export const UNIT_PRESSURE = 'pressure';
export const UNIT_HEIGHT = 'height';
export const UNIT_RAIN = 'rain';
export const UNIT_CO2 = 'co2';
export const UNIT_HUMIDITY = 'humidity';
export const UNIT_NOISE = 'noise';
export const UNIT_SOLAR_RADIATION = 'solarRadiation';
export const UNIT_WIND_DIRECTION = 'windDirection';
export const UNIT_UV_INDEX = 'uvIndex';
export const UNIT_VPD = 'vpd';
export const UNIT_BATTERY = 'battery';
export const UNIT_SIGNAL_STRENGTH = 'signalStrength';

export const Units = {
    temperature: {
        C: {label: '°C', convert: (val) => val},
        F: {label: '°F', convert: (val) => (val * 9 / 5) + 32}
    },
    windSpeed: {
        MS: {label: 'm/s', convert: (val) => val},
        KMH: {label: 'km/h', convert: (val) => val * 3.6},
        MPH: {label: 'mph', convert: (val) => val * 2.237},
        KN: {label: 'kn', convert: (val) => val * 1.944}
    },
    pressure: {
        HPA: {label: 'hPa', convert: (val) => val},
        MBAR: {label: 'mbar', convert: (val) => val},
        MMHG: {label: 'mmHg', convert: (val) => val * 0.75006},
        INHG: {label: 'inHg', convert: (val) => val * 0.02953}
    },
    height: {
        M: {label: 'm', convert: (val) => val},
        FT: {label: 'ft', convert: (val) => val * 3.28084}
    },
    rain: {
        MM: {label: 'mm', convert: (val) => val},
        IN: {label: 'in', convert: (val) => val * 0.03937}
    },
    co2: {
        PPM: {label: 'ppm', convert: (val) => val}
    },
    humidity: {
        PERCENT: {label: '%', convert: (val) => val}
    },
    noise: {
        DB: {label: 'dB', convert: (val) => val}
    },
    solarRadiation: {
        WM2: {label: 'W/m²', convert: (val) => val}
    },
    windDirection: {
        DEGREE: {label: '°', convert: (val) => val.toFixed(0)}
    },
    uvIndex: {
        INDEX: {label: '', convert: (val) => val}
    },
    vpd: {
        KPA: {label: 'KPa', convert: (val) => val}
    },
    battery: {
        PERCENT: {label: '%', convert: (val) => val}
    },
    signalStrength: {
        DBM: {label: 'dBm', convert: (val) => val}
    }
};

export const UnitPresets = {
    metric: {
        temperature: 'C',
        windSpeed: 'KMH',
        pressure: 'HPA',
        height: 'M',
        rain: 'MM',
        co2: 'PPM',
        humidity: 'PERCENT',
        noise: 'DB',
        solarRadiation: 'WM2',
        windDirection: 'DEGREE',
        uvIndex: 'INDEX',
        vpd: 'KPA',
        battery: 'PERCENT',
        signalStrength: 'DBM',
    },
    imperial: {
        temperature: 'F',
        windSpeed: 'MPH',
        pressure: 'INHG',
        height: 'FT',
        rain: 'IN',
        co2: 'PPM',
        humidity: 'PERCENT',
        noise: 'DB',
        solarRadiation: 'WM2',
        windDirection: 'DEGREE',
        uvIndex: 'INDEX',
        vpd: 'KPA',
        battery: 'PERCENT',
        signalStrength: 'DBM',
    },
    aviation: {
        temperature: 'C',
        windSpeed: 'KN',
        pressure: 'HPA',
        height: 'FT',
        rain: 'MM',
        co2: 'PPM',
        humidity: 'PERCENT',
        noise: 'DB',
        solarRadiation: 'WM2',
        windDirection: 'DEGREE',
        uvIndex: 'INDEX',
        vpd: 'KPA',
        battery: 'PERCENT',
        signalStrength: 'DBM',
    }
};

export const UnitPresetList = {
    metric: {
        icon: '📏',
    },
    imperial: {
        icon: '🇺🇸',
    },
    aviation: {
        icon: '✈️'
    },
}