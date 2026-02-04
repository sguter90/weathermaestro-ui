import {renderHeader} from "../views/partials/Header.js";
import {renderFooter} from "../views/partials/Footer.js";
import {renderContentWrapper} from "../views/partials/ContentWrapper.js";
import {renderBodyWrapper} from "../views/partials/BodyWrapper.js";

/**
 * Manages view rendering and transitions
 */
export class ViewManager {
  constructor(containerId = 'app') {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      throw new Error(`Container with id "${containerId}" not found`);
    }
    this.headerHtml = renderHeader();
    this.footerHtml = renderFooter();
    this.bodyWrapper = renderBodyWrapper;
    this.contentWrapper = renderContentWrapper;
  }

  /**
   * Set the header HTML
   */
  setHeader(html) {
    this.headerHtml = html;
  }

  /**
   * Set the footer HTML
   */
  setFooter(html) {
    this.footerHtml = html;
  }

  /**
   * Clear the header
   */
  clearHeader() {
    this.headerHtml = '';
  }

  /**
   * Clear the footer
   */
  clearFooter() {
    this.footerHtml = '';
  }

  /**
   * Set the content wrapper function
   */
  setContentWrapper(wrapperFunction) {
    this.contentWrapper = wrapperFunction;
  }

  /**
   * Clear the content wrapper function
   */
  clearContentWrapper() {
    this.contentWrapper = (content) => content;
  }

  /**
   * Set the body wrapper function
   */
  setBodyWrapper(wrapperFunction) {
    this.bodyWrapper = wrapperFunction;
  }

  /**
   * Clear the body wrapper function
   */
  clearBodyWrapper() {
    this.bodyWrapper = (content) => content;
  }

  /**
   * Render a view with header and footer
   */
  render(content) {
    const body = `
      ${this.headerHtml}
      <main>
      </main>
      ${this.footerHtml}
    `;

    this.container.innerHTML = this.bodyWrapper(body);

    const mainElement = this.container.querySelector('main');
    const wrapper = document.createElement('div');
    mainElement.appendChild(wrapper)
    this.contentWrapper(wrapper, content);
  }

  /**
   * Render only the main content (without updating header/footer)
   */
  renderContent(html) {
    const mainElement = this.container.querySelector('main');
    if (mainElement) {
      mainElement.innerHTML = html;
    } else {
      // Fallback to full render if main element not found
      this.render(html);
    }
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
      <div class="flex items-center justify-center min-h-[400px]">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p class="text-slate-400">${message}</p>
        </div>
      </div>
    `);
  }

  /**
   * Show error state
   */
  showError(message) {
    this.render(`
      <div class="flex items-center justify-center min-h-[400px]">
        <div class="text-center max-w-md">
          <div class="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h2 class="text-xl font-bold text-white mb-2">Error</h2>
          <p class="text-slate-400">${message}</p>
        </div>
      </div>
    `);
  }
}

export const viewManager = new ViewManager();
