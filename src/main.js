import './styles/main.css';
import * as api from './api/client';
import {router} from './Router.js';
import {updateDynamicContent} from './utils/config.js';
import {renderHomeView} from './views/HomeView.js';
import {renderStationView} from './views/StationView.js';
import {renderHistoryView} from './views/HistoryView.js';
import {OffCanvasManager} from "./components/OffCanvasManager.js";
import {UnitSwitcher} from "./components/UnitSwitcher.js";
import {unitManager} from "./utils/UnitManager.js";
import {timeManager} from "./utils/TimeManager.js";
import {i18n} from "./i18n/i18n.js";

// Make API available globally for debugging
window.api = api;
window.router = router;
window.unitSwitcher = unitManager;
window.timeManager = timeManager;

document.addEventListener('DOMContentLoaded', () => {
    updateDynamicContent();

    new OffCanvasManager();
    new UnitSwitcher('unit-switcher');
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

i18n.subscribe(() => {
    router.handleRoute();
});
window.unitSwitcher.subscribe(() => {
    router.handleRoute();
})

window.timeManager.subscribe(() => {
    router.handleRoute();
})

// Initialize app
console.log('WeatherMaestro UI initialized');