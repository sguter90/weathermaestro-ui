import './styles/main.css';
import * as api from './api/client';
import { router } from './Router.js';
import { renderHomeView } from './views/HomeView.js';
import { renderStationView } from './views/StationView.js';
import { renderHistoryView } from './views/HistoryView.js';

// Make API available globally for debugging
window.api = api;
window.router = router;

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

// Initialize app
console.log('WeatherMaestro UI initialized');