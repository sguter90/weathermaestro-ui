import {viewManager} from "../lib/ViewManager.js";
import {i18n} from "../i18n/i18n.js";
import {apiClient} from "../lib/ApiClient.js";
import {StationListItem} from "../components/StationListItem.js";

/**
 * Render summary card
 */
const renderSummaryCard = function (label, value, color) {
    return `
        <div class="summary-card summary-card--${color}">
            <div class="summary-card__icon">
                <span class="summary-card__value">${value}</span>
            </div>
            <p class="summary-card__label">${label}</p>
        </div>
    `;
}


export async function renderStationListView() {
    viewManager.showLoading('Loading stations...');

    try {
        const stations = await apiClient.getStations();
        const container = document.createElement('div');
        container.className = 'page-container';
        container.innerHTML = `
            <!-- Header -->
            <div class="page-header">
                <div>
                    <h1>${i18n.t('WEATHER_STATIONS') || 'Weather Stations'}</h1>
                    <p>${i18n.t('OVERVIEW_ALL_STATIONS') || 'Overview of all registered stations in the network'}</p>
                </div>
            </div>
            
            <!-- Stations List -->
            <div class="station-list list-rows"></div>
            
            <!-- Summary Stats -->
            <div class="summary-stats summary-stats-4">
                ${renderSummaryCard(i18n.t('TOTAL_SUM') || 'Total', stations.length, 'blue')}
                ${renderSummaryCard(i18n.t('STATION_ONLINE') || 'Active', stations.filter(s => s.isActive()).length, 'emerald')}
                ${renderSummaryCard(i18n.t('STATION_DELAYED') || 'Delayed', stations.filter(s => !s.isActive() && s.latestData).length, 'amber')}
                ${renderSummaryCard(i18n.t('STATION_OFFLINE') || 'Offline', stations.filter(s => !s.latestData).length, 'red')}
            </div>
        `;

        const stationListElement = container.querySelector('.station-list');
        stations.map((station) => {
            const card = new StationListItem();
            card.station = station;

            stationListElement.appendChild(card)
        });

        viewManager.render(container);
    } catch (error) {
        console.log(error);
        viewManager.showError(error.message);
    }
}
