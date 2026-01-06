
/**
 * AppConfig class for managing application configuration
 * Prioritizes runtime config (window.appConfig) over build-time env vars
 */
class AppConfig {
  constructor() {
    this.defaultAppName = 'WeatherMaestro';
    this.defaultAppDescription = this.defaultAppName;
    this.allowedConfigKeys = ['APP_NAME', 'APP_DESCRIPTION'];
    this.primaryColor = '#0d529c'; // Fallback, wird von CSS Variable überschrieben
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
   * Extracts the primary color from CSS variables
   * @returns {string} The primary color in hex format
   */
  getPrimaryColor() {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    return computedStyle.getPropertyValue('--primary-color').trim() || this.primaryColor;
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
   * Updates PWA meta tags dynamically
   */
  updatePWAMetaTags() {
    const appName = this.getAppName();
    const primaryColor = this.getPrimaryColor();

    // Theme color
    this.updateOrCreateMetaTag('theme-color', primaryColor);

    // Apple mobile web app title
    this.updateOrCreateMetaTag('apple-mobile-web-app-title', appName);

    // Microsoft tile color
    this.updateOrCreateMetaTag('msapplication-TileColor', primaryColor);
  }

  /**
   * Helper method to update or create a meta tag
   * @param {string} name The meta tag name or property
   * @param {string} content The content value
   * @param {boolean} isProperty Whether to use property instead of name attribute
   */
  updateOrCreateMetaTag(name, content, isProperty = false) {
    const selector = isProperty 
      ? `meta[property="${name}"]` 
      : `meta[name="${name}"]`;
    
    let metaTag = document.querySelector(selector);

    if (!metaTag) {
      metaTag = document.createElement('meta');
      if (isProperty) {
        metaTag.setAttribute('property', name);
      } else {
        metaTag.setAttribute('name', name);
      }
      document.head.appendChild(metaTag);
    }

    metaTag.setAttribute('content', content);
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
   * Updates document metadata, PWA tags and config elements
   */
  init() {
    this.updateDocumentMetadata();
    this.updatePWAMetaTags();
    this.updateConfigElements();
  }
}

// Export singleton instance
export const appConfig = new AppConfig();