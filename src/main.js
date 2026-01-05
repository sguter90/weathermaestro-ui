import './styles/main.css';
import { appConfig } from './lib/AppConfig.js';
import {router} from './lib/Router.js';
import {renderHomeView} from './lib/views/HomeView.js';
import {renderStationView} from './lib/views/StationView.js';
import {renderHistoryView} from './lib/views/HistoryView.js';
import {OffCanvasManager} from "./lib/components/OffCanvasManager.js";
import {UiConfig} from "./lib/components/UiConfig.js";
import {uiConfigManager} from "./lib/UiConfigManager.js";

document.addEventListener('DOMContentLoaded', () => {
    appConfig.init();

    new OffCanvasManager();
    new UiConfig('ui-config');
});

// Define routes
router
    .on('/', renderHomeView)
    .on('/station/:id', renderStationView)
    .on('/station/:id/history', renderHistoryView)
    .notFound(() => {
        document.getElementById('app').innerHTML = `
      <div class="not-found">
        <h1>404 - Page Not Found</h1>
        <a href="/">Go Home</a>
      </div>
    `;
    });

uiConfigManager.subscribe(() => {
    router.handleRoute();
})

// Initialize app
console.log('WeatherMaestro UI initialized');