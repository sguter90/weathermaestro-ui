import { router } from '../Router.js';

/**
 * Generates the HTML string for a breadcrumb navigation.
 * @param {Array<Object>} items - An array of breadcrumb items.
 *   Each item should contain { label: string, path: string }.
 *   The last item in the array will be rendered as the current path without a link.
 * @returns {string} The HTML string of the breadcrumb navigation.
 */
export function renderBreadcrumbs(items) {
  if (!items || items.length === 0) {
    return '';
  }

  const breadcrumbHtml = items.map((item, index) => {
    const isLast = index === items.length - 1;
    if (isLast) {
      return `
        <li class="breadcrumb-item active" aria-current="page">
          <span class="breadcrumb-label">
              ${item.label}
          </span>   
        </li>`;
    } else {
      return `
        <li class="breadcrumb-item">
          <a class="breadcrumb-label" href="#${item.url}">${item.label}</a>
        </li>
      `;
    }
  }).join('');

  return `
    <nav aria-label="breadcrumb" class="app-breadcrumb">
      <ol class="breadcrumb">
        ${breadcrumbHtml}
      </ol>
    </nav>
  `;
}
