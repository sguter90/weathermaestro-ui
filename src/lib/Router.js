/**
 * Simple hash-based router without dependencies
 */
export class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    this.notFoundHandler = null;
    
    // Listen to hash changes
    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('load', () => this.handleRoute());
  }

  /**
   * Register a route
   * @param {string} path - Route path (e.g., '/home', '/station/:id')
   * @param {Function} handler - Function to handle the route
   */
  on(path, handler) {
    this.routes[path] = handler;
    return this;
  }

  /**
   * Set 404 handler
   */
  notFound(handler) {
    this.notFoundHandler = handler;
    return this;
  }

  /**
   * Navigate to a route
   */
  navigate(path) {
    window.location.hash = path;
  }

  /**
   * Get current hash without #
   */
  getCurrentPath() {
    return window.location.hash.slice(1) || '/';
  }

  /**
   * Parse route parameters
   */
  parseRoute(routePath, actualPath) {
    // Remove query parameters from actualPath
    const cleanPath = actualPath.split('?')[0];

    const routeParts = routePath.split('/').filter(Boolean);
    const actualParts = cleanPath.split('/').filter(Boolean);

    if (routeParts.length !== actualParts.length) {
      return null;
    }

    const params = {};
    for (let i = 0; i < routeParts.length; i++) {
      if (routeParts[i].startsWith(':')) {
        const paramName = routeParts[i].slice(1);
        params[paramName] = actualParts[i];
      } else if (routeParts[i] !== actualParts[i]) {
        return null;
      }
    }

    return params;
  }

  /**
   * Handle route change
   */
  handleRoute() {
    const path = this.getCurrentPath();
    let matched = false;

    // Try to match exact route first
    if (this.routes[path]) {
      this.currentRoute = path;
      this.routes[path]({});
      matched = true;
    } else {
      // Try to match parameterized routes
      for (const routePath in this.routes) {
        const params = this.parseRoute(routePath, path);
        if (params !== null) {
          this.currentRoute = routePath;
          this.routes[routePath](params);
          matched = true;
          break;
        }
      }
    }

    // Handle 404
    if (!matched && this.notFoundHandler) {
      this.notFoundHandler();
    }
  }

  /**
   * Get query parameters from URL
   */
  getQueryParams() {
    const hash = window.location.hash;
    const queryStart = hash.indexOf('?');
    if (queryStart === -1) return {};

    const queryString = hash.slice(queryStart + 1);
    const params = new URLSearchParams(queryString);
    const result = {};
    
    for (const [key, value] of params) {
      result[key] = value;
    }
    
    return result;
  }
}

export const router = new Router();
