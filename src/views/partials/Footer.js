import {appConfig} from '../../lib/AppConfig.js';

export function renderFooter() {
    return `
    <footer class="footer">
        <div class="footer-container">
            <div class="footer-content">
                <p class="footer-text">© 2025-${new Date().getFullYear()} ${appConfig.getAppName()}</p>
            </div>
        </div>
    </footer>
    `
}