import './styles/main.css';
import { appConfig } from './lib/AppConfig.js';
import {router} from './lib/Router.js';
import {uiConfigManager} from "./lib/UiConfigManager.js";
import {renderStationListView} from "./views/StationListView.js";
import {renderStationDetailView} from "./views/StationDetailView.js";
import {renderStationHistoryView} from "./views/StationHistoryView.js";
import {renderWidgetShowcaseView} from "./views/WidgetShowcaseView.js";

document.addEventListener('DOMContentLoaded', () => {
    appConfig.init();
});

// Define routes
router
    .on('/', renderStationListView)
    .on('/station/:id', renderStationDetailView)
    .on('/station/:id/history', renderStationHistoryView)
    .on('/widgets', renderWidgetShowcaseView)
    .notFound(() => {
        document.getElementById('app').innerHTML = `
      <div class="not-found">
        <h1>404 - Page Not Found</h1>
        <a href="/">Go Home</a>
      </div>
    `;
    });

let pendingReRender = false;
uiConfigManager.subscribe(() => {
    const settingsOffCanvas = document.querySelector('wm-settings-offcanvas');

    if (settingsOffCanvas) {
        const offCanvas = settingsOffCanvas.shadowRoot?.querySelector('wm-offcanvas');

        if (offCanvas && offCanvas.isOpen) {
            pendingReRender = true;
            return;
        }
    }

    router.handleRoute();
})

document.addEventListener('offcanvas-closed', () => {
    if (pendingReRender) {
        router.handleRoute();
        pendingReRender = false;
    }
})