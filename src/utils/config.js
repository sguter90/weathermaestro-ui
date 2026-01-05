/**
 * Retrieves a configuration value, prioritizing `window.appConfig` (for runtime Docker env vars)
 * and falling back to `import.meta.env` (for Vite build-time env vars).
 *
 * @param {string} key The key of the configuration variable (e.g., 'API_BASE_URL', 'APP_NAME').
 * @returns {string | undefined} The configuration value or undefined if not found.
 */
export function getConfig(key) {
    // Check if window.appConfig exists and contains a non-placeholder value for the key
    if (window.appConfig && window.appConfig[key] && window.appConfig[key] !== `\${${key}}`) {
        return window.appConfig[key];
    }

    // Fallback to Vite's import.meta.env variables
    // Vite prefixes all custom env vars with VITE_
    const viteKey = `VITE_${key}`;
    if (import.meta.env[viteKey]) {
        return import.meta.env[viteKey];
    }

    // If neither is found, return undefined
    return undefined;
}


// Function to update dynamic content in index.html using classes and data-attributes
export function updateDynamicContent() {
    // Default values if not found in config
    const defaultAppName = 'WeatherMaestro';
    const defaultAppDescription = `${defaultAppName}`;

    // Handle specific elements first (like title and meta description)
    const appName = getConfig('APP_NAME') || defaultAppName;
    const appDescription = getConfig('APP_DESCRIPTION') || defaultAppDescription;

    // Update document title
    document.title = appName;

    // Update meta description
    const metaDescriptionElement = document.querySelector('meta[name="description"]');
    if (metaDescriptionElement) {
        metaDescriptionElement.setAttribute('content', appDescription);
    }

    // Update all elements with the 'js-config-value' class
    const configElements = document.querySelectorAll('.js-config-value');
    const allowedConfigKeys = ['APP_NAME', 'APP_DESCRIPTION'];

    configElements.forEach(element => {
        if (element.tagName === 'TITLE' || element.tagName === 'META') {
            return;
        }

        const configKey = element.dataset.configKey;
        if (!configKey) {
            return;
        }

        if (!allowedConfigKeys.includes(configKey)) {
            return;
        }

        const value = getConfig(configKey);
        if (!value) {
            return;
        }

        element.textContent = value;
    });
}

// Example usage
// const apiBaseUrl = getConfig('API_BASE_URL');
// const appName = getConfig('APP_NAME');
// console.log('API Base URL:', apiBaseUrl);
// console.log('App Name:', appName);
