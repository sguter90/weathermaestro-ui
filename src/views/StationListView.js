import {viewManager} from "../lib/ViewManager.js";
import {i18n} from "../i18n/i18n.js";
import {apiClient} from "../lib/ApiClient.js";
import {StationListItem} from "../components/StationListItem.js";

/**
 * Render summary card
 */
const renderSummaryCard = function (label, value, color) {
    const colorClasses = {
        blue: 'from-blue-500 to-cyan-500',
        emerald: 'from-emerald-500 to-teal-500',
        amber: 'from-amber-500 to-orange-500',
        red: 'from-red-500 to-pink-500'
    };

    return `
            <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-5 text-center">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} mx-auto mb-3 flex items-center justify-center shadow-lg">
                    <span class="text-2xl font-bold text-white">${value}</span>
                </div>
                <p class="text-sm text-slate-400">${label}</p>
            </div>
        `;
}


export async function renderStationListView() {
    viewManager.showLoading('Loading stations...');

    try {
        const stations = await apiClient.getStations();
        const container = document.createElement('div');
        container.className = 'space-y-6';
        container.innerHTML = `
            <!-- Header -->
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-white mb-2">${i18n.t('WEATHER_STATIONS') || 'Weather Stations'}</h2>
                <p class="text-sm text-slate-400">${i18n.t('OVERVIEW_ALL_STATIONS') || 'Overview of all registered stations in the network'}</p>
            </div>
            
            <!-- Stations List -->
            <div class="station-list space-y-3"></div>
            
            <!-- Summary Stats -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
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
