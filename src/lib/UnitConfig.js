export const UnitConfig = {
  temperature: {
    C: { label: '°C', convert: (val) => val },
    F: { label: '°F', convert: (val) => (val * 9/5) + 32 }
  },
  windSpeed: {
    MS: { label: 'm/s', convert: (val) => val },
    KMH: { label: 'km/h', convert: (val) => val * 3.6 },
    MPH: { label: 'mph', convert: (val) => val * 2.237 },
    KN: { label: 'kn', convert: (val) => val * 1.944 }
  },
  pressure: {
    HPA: { label: 'hPa', convert: (val) => val },
    MBAR: { label: 'mbar', convert: (val) => val },
    MMHG: { label: 'mmHg', convert: (val) => val * 0.75006 },
    INHG: { label: 'inHg', convert: (val) => val * 0.02953 }
  },
  height: {
    M: { label: 'm', convert: (val) => val },
    FT: { label: 'ft', convert: (val) => val * 3.28084 }
  },
  rain: {
    MM: { label: 'mm', convert: (val) => val },
    IN: { label: 'in', convert: (val) => val * 0.03937 }
  }
};

export const UnitPresets = {
  metric: {
    temperature: 'C',
    windSpeed: 'KMH',
    pressure: 'HPA',
    height: 'M',
    rain: 'MM'
  },
  imperial: {
    temperature: 'F',
    windSpeed: 'MPH',
    pressure: 'INHG',
    height: 'FT',
    rain: 'IN'
  },
  aviation: {
    temperature: 'C',
    windSpeed: 'KN',
    pressure: 'HPA',
    height: 'FT',
    rain: 'MM'
  }
};
