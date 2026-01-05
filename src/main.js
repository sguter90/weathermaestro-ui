import './styles/main.css';
import * as api from './api/client';
import {router} from './Router.js';
import {updateDynamicContent} from './utils/config.js';
import {renderHomeView} from './views/HomeView.js';
import {renderStationView} from './views/StationView.js';
import {renderHistoryView} from './views/HistoryView.js';
import {OffCanvasManager} from "./components/OffCanvasManager.js";
import {UiConfig} from "./components/UiConfig.js";
import {uiConfigManager} from "./utils/UiConfigManager.js";

// Make API available globally for debugging
window.api = api;
window.router = router;
window.uiConfigManager = uiConfigManager;

document.addEventListener('DOMContentLoaded', () => {
    updateDynamicContent();

    new OffCanvasManager();
    new UiConfig('ui-config');
});

// Define routes
window.router
    .on('/', renderHomeView)
    .on('/station/:id', renderStationView)
    .on('/station/:id/history', renderHistoryView)
    .notFound(() => {
        document.getElementById('app').innerHTML = `
      <div class="not-found">
        <h1>404 - Page Not Found</h1>
        <button onclick="window.router.navigate('/')">Go Home</button>
      </div>
    `;
    });

window.uiConfigManager.subscribe(() => {
    router.handleRoute();
})

// Initialize app
console.log('WeatherMaestro UI initialized');