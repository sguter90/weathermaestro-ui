/**
 * Manages view rendering and transitions
 */
export class ViewManager {
  constructor(containerId = 'app') {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      throw new Error(`Container with id "${containerId}" not found`);
    }
  }

  /**
   * Render a view
   */
  render(html) {
    this.container.innerHTML = html;
  }

  /**
   * Clear the view
   */
  clear() {
    this.container.innerHTML = '';
  }

  /**
   * Show loading state
   */
  showLoading(message = 'Loading...') {
    this.render(`
      <div class="loading">
        <div class="spinner"></div>
        <p>${message}</p>
      </div>
    `);
  }

  /**
   * Show error state
   */
  showError(message) {
    this.render(`
      <div class="error">
        <h2>Error</h2>
        <p>${message}</p>
        <button onclick="history.back()">Go Back</button>
      </div>
    `);
  }
}

export const viewManager = new ViewManager();
