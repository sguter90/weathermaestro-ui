export const showcaseWidgets = {
    'co2-level': {
        name: 'CO₂ Level',
        defaultData: {
            co2Level: 850,
            co2Quality: 'Acceptable',
            unit: 'ppm'
        },
        properties: [
            {key: 'co2Level', type: 'number', label: 'CO₂ Level (ppm)', min: 0, max: 2000, step: 10},
            {
                key: 'co2Quality',
                type: 'select',
                label: 'Quality',
                options: ['Poor', 'Fair', 'Acceptable', 'Good', 'Excellent']
            },
            {key: 'unit', type: 'text', label: 'Unit'}
        ]
    },
    'noise-level': {
        name: 'Noise Level',
        defaultData: {
            noiseLevel: 65,
            noiseCategory: 'Moderate',
            unit: 'dB'
        },
        properties: [
            {key: 'noiseLevel', type: 'number', label: 'Noise Level (dB)', min: 0, max: 130, step: 1},
            {
                key: 'noiseCategory',
                type: 'select',
                label: 'Category',
                options: ['Quiet', 'Normal', 'Moderate', 'Loud', 'Very Loud']
            },
            {key: 'unit', type: 'text', label: 'Unit'}
        ]
    },
    'solar-radiation': {
        name: 'Solar Radiation',
        defaultData: {
            solarRadiation: 750,
            uvIndex: 6,
            unit: 'W/m²'
        },
        properties: [
            {
                key: 'solarRadiation',
                type: 'number',
                label: 'Solar Radiation (W/m²)',
                min: 0,
                max: 1000,
                step: 10
            },
            {key: 'uvIndex', type: 'number', label: 'UV Index', min: 0, max: 11, step: 0.1},
            {key: 'unit', type: 'text', label: 'Unit'}
        ]
    },
    'wind-gauge': {
        name: 'Wind Gauge',
        defaultData: {
            direction: 225,
            speed: 15,
            unit: 'km/h'
        },
        properties: [
            {key: 'direction', type: 'number', label: 'Direction (°)', min: 0, max: 360, step: 1},
            {key: 'speed', type: 'number', label: 'Speed', min: 0, max: 100, step: 0.5},
            {key: 'unit', type: 'text', label: 'Unit'}
        ]
    },
    'wind-rose': {
        name: 'Wind Rose',
        defaultData: {
            windSpeed: 8.5,
            windDirection: 245,
            windUnit: 'mph',
            windDirectionLabel: 'WSW',
            windGust: 12.3,
            windCategory: 'Light Breeze'
        },
        properties: [
            {key: 'windSpeed', type: 'number', label: 'Wind Speed', min: 0, max: 100, step: 0.5},
            {key: 'windDirection', type: 'number', label: 'Wind Direction (°)', min: 0, max: 360, step: 1},
            {key: 'windUnit', type: 'select', label: 'Unit', options: ['mph', 'km/h', 'knots', 'm/s']},
            {key: 'windDirectionLabel', type: 'text', label: 'Direction Label (N, NE, E, etc.)'},
            {key: 'windGust', type: 'number', label: 'Wind Gust', min: 0, max: 150, step: 0.5},
            {
                key: 'windCategory',
                type: 'select',
                label: 'Category',
                options: ['Calm', 'Light Air', 'Light Breeze', 'Gentle Breeze', 'Moderate Breeze', 'Fresh Breeze', 'Strong Breeze', 'Gale', 'Strong Gale', 'Storm', 'Violent Storm', 'Hurricane']
            }
        ]
    },
    'thermometer': {
        name: 'Thermometer',
        defaultData: {
            outdoorTemp: 22.4,
            indoorTemp: 72.5,
            unit: '°F',
            minTemp: 0,
            maxTemp: 100
        },
        properties: [
            {key: 'outdoorTemp', type: 'number', label: 'Outdoor Temperature', min: -50, max: 50, step: 0.1},
            {key: 'indoorTemp', type: 'number', label: 'Indoor Temperature', min: -50, max: 50, step: 0.1},
            {key: 'unit', type: 'select', label: 'Unit', options: ['°C', '°F', 'K']},
            {key: 'minTemp', type: 'number', label: 'Min Temperature', min: -100, max: 0, step: 1},
            {key: 'maxTemp', type: 'number', label: 'Max Temperature', min: 0, max: 150, step: 1}
        ]
    },
    'humidity': {
        name: 'Humidity',
        defaultData: {
            humidity: 50,
            label: 'Relative Humidity',
        },
        properties: [
            {key: 'humidity', type: 'number', label: 'Humidity', min: 0, max: 100, step: 1},
        ]
    },
    'pressure': {
        name: 'Barometric Pressure',
        defaultData: {
            pressure: 1013,
            label: 'hPA',
        },
        properties: [
            {key: 'pressure', type: 'number', label: 'Pressure', min: 950, max: 1050, step: 1},
        ]
    },
    'rain-gauge': {
        name: 'Rain Gauge',
        defaultData: {
            dailyRain: 0.15,
            weeklyRain: 1.28,
            unit: 'in'
        },
        properties: [
            {key: 'dailyRain', type: 'number', label: 'Daily Rain', min: 0, max: 5, step: 0.01},
            {key: 'weeklyRain', type: 'number', label: 'Weekly Rain', min: 0, max: 20, step: 0.1},
            {key: 'unit', type: 'text', label: 'Unit'}
        ]
    },
    'sensor-group': {
        name: 'Sensor Group',
        defaultData: {
            title: 'Indoor Sensors',
            icon: '🏠',
            iconColor: 'blue',
            sensors: [
                {label: 'Temperature', value: '22.5°C', color: 'blue-400'},
                {label: 'Humidity', value: '58%', color: 'cyan-400'},
                {label: 'CO₂', value: '850 ppm', color: 'green-400'}
            ]
        },
        properties: [
            {key: 'title', type: 'text', label: 'Title'},
            {key: 'icon', type: 'text', label: 'Icon (emoji)'},
            {
                key: 'iconColor',
                type: 'select',
                label: 'Icon Color',
                options: ['blue', 'green', 'red', 'amber', 'purple', 'cyan']
            }
        ]
    },
    'chart': {
        name: 'Chart Widget',
        defaultData: {
            title: 'Temperature Trend',
            subtitle: 'Last 7 days',
            type: 'bar',
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            data: [18, 20, 22, 21, 23, 25, 24],
            color: 'blue',
            unit: '°C'
        },
        properties: [
            {key: 'title', type: 'text', label: 'Title'},
            {key: 'subtitle', type: 'text', label: 'Subtitle'},
            {key: 'type', type: 'select', label: 'Chart Type', options: ['bar', 'line']},
            {key: 'color', type: 'select', label: 'Color', options: ['blue', 'green', 'red', 'amber', 'cyan']},
            {key: 'unit', type: 'text', label: 'Unit'}
        ]
    },
    'simple-metric-card': {
        name: 'Simple Metric Card',
        defaultData: {
            icon: '🌡️',
            label: 'Temperature',
            value: '22.5',
            unit: '°C',
            status: 'Normal',
            statusColor: 'blue'
        },
        properties: [
            {key: 'icon', type: 'text', label: 'Icon (emoji)'},
            {key: 'label', type: 'text', label: 'Label'},
            {key: 'value', type: 'text', label: 'Value'},
            {key: 'unit', type: 'text', label: 'Unit'},
            {key: 'status', type: 'text', label: 'Status'},
            {
                key: 'statusColor',
                type: 'select',
                label: 'Status Color',
                options: ['blue', 'green', 'red', 'amber', 'purple', 'cyan']
            }
        ]
    },
};