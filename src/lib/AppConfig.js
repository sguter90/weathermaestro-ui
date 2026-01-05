
/**
 * AppConfig class for managing application configuration
 * Prioritizes runtime config (window.appConfig) over build-time env vars
 */
class AppConfig {
  constructor() {
    this.defaultAppName = 'WeatherMaestro';
    this.defaultAppDescription = this.defaultAppName;
    this.allowedConfigKeys = ['APP_NAME', 'APP_DESCRIPTION'];
  }

  /**
   * Retrieves a configuration value
   * Prioritizes window.appConfig (runtime Docker env vars) over import.meta.env (build-time)
   *
   * @param {string} key The configuration key (e.g., 'API_BASE_URL', 'APP_NAME')
   * @returns {string | undefined} The configuration value or undefined if not found
   */
  getConfig(key) {
    // Check if window.appConfig exists and contains a non-placeholder value
    if (window.appConfig && window.appConfig[key] && window.appConfig[key] !== `\${${key}}`) {
      return window.appConfig[key];
    }

    // Fallback to Vite's import.meta.env variables
    const viteKey = `VITE_${key}`;
    if (import.meta.env[viteKey]) {
      return import.meta.env[viteKey];
    }

    return undefined;
  }

  /**
   * Gets the application name
   * @returns {string} The app name or default value
   */
  getAppName() {
    return this.getConfig('APP_NAME') || this.defaultAppName;
  }

  /**
   * Gets the application description
   * @returns {string} The app description or default value
   */
  getAppDescription() {
    return this.getConfig('APP_DESCRIPTION') || this.defaultAppDescription;
  }

  /**
   * Updates the document title and meta description
   */
  updateDocumentMetadata() {
    const appName = this.getAppName();
    const appDescription = this.getAppDescription();

    // Update document title
    document.title = appName;

    // Update meta description
    const metaDescriptionElement = document.querySelector('meta[name="description"]');
    if (metaDescriptionElement) {
      metaDescriptionElement.setAttribute('content', appDescription);
    }
  }

  /**
   * Updates all elements with 'js-config-value' class
   */
  updateConfigElements() {
    const configElements = document.querySelectorAll('.js-config-value');

    configElements.forEach(element => {
      // Skip meta and title tags
      if (element.tagName === 'TITLE' || element.tagName === 'META') {
        return;
      }

      const configKey = element.dataset.configKey;
      if (!configKey || !this.allowedConfigKeys.includes(configKey)) {
        return;
      }

      const value = this.getConfig(configKey);
      if (value) {
        element.textContent = value;
      }
    });
  }

  /**
   * Initializes the app configuration
   * Updates document metadata and config elements
   */
  init() {
    this.updateDocumentMetadata();
    this.updateConfigElements();
  }
}

// Export singleton instance
export const appConfig = new AppConfig();
