import './styles/main.css';
import '@fontsource/space-grotesk/300.css';
import '@fontsource/space-grotesk/400.css';
import '@fontsource/space-grotesk/500.css';
import '@fontsource/space-grotesk/600.css';
import '@fontsource/space-grotesk/700.css';

import { appConfig } from './lib/AppConfig.js';
import {router} from './lib/Router.js';
import {uiConfigManager} from "./lib/UiConfigManager.js";
import {pullToRefreshManager} from "./lib/PullToRefreshManager.js";
import {renderStationListView} from "./views/StationListView.js";
import {handleReloadStations} from "./views/StationListView.js";
import {renderStationDetailView} from "./views/StationDetailView.js";
import {handleReloadStation} from "./views/StationDetailView.js";
import {renderStationHistoryView} from "./views/StationHistoryView.js";
import {renderWidgetShowcaseView} from "./views/WidgetShowcaseView.js";
import {renderLoginView} from "./views/LoginView.js";
import {renderLogoutView} from "./views/LogoutView.js";
import {renderDashboardListView} from "./views/DashboardListView.js";
import {handleReloadDashboards} from "./views/DashboardListView.js";
import {renderDashboardDetailView} from "./views/DashboardDetailView.js";
import {handleReloadDashboard} from "./views/DashboardDetailView.js";

document.addEventListener('DOMContentLoaded', () => {
    appConfig.init();
    pullToRefreshManager.init();
});

// Define routes
router
    .on('/', (params) => {
        pullToRefreshManager.setReloadCallback(handleReloadStations);
        renderStationListView(params);
    })
    .on('/station/:id', (params) => {
        pullToRefreshManager.setReloadCallback(() => handleReloadStation(params));
        renderStationDetailView(params);
    })
    .on('/station/:id/history', (params) => {
        pullToRefreshManager.clearReloadCallback();
        renderStationHistoryView(params);
    })
    .on('/dashboard', (params) => {
        pullToRefreshManager.setReloadCallback(handleReloadDashboards);
        renderDashboardListView(params);
    })
    .on('/dashboard/:id', (params) => {
        pullToRefreshManager.setReloadCallback(() => handleReloadDashboard({ id: params.id }));
        renderDashboardDetailView(params);
    })
    .on('/widgets', (params) => {
        pullToRefreshManager.clearReloadCallback();
        renderWidgetShowcaseView(params);
    })
    .on('/login', (params) => {
        pullToRefreshManager.clearReloadCallback();
        renderLoginView(params);
    })
    .on('/logout', (params) => {
        pullToRefreshManager.clearReloadCallback();
        renderLogoutView(params);
    })
    .notFound(() => {
        pullToRefreshManager.clearReloadCallback();
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
});
