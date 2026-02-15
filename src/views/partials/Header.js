import {appConfig} from '../../lib/AppConfig.js';
import {i18n} from '../../i18n/i18n.js';
import '../../components/SettingsOffCanvas.js';
import {router} from "../../lib/Router.js";

export function renderHeader() {
    return `
        <header class="header">
            <div class="header-container">
                <div class="header-content">
                    <!-- Logo Section -->
                    <div class="header-logo-section">
                        <div class="header-logo">
                            <a href="/#/" title="Logo">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/>
                                </svg>
                            </a>
                        </div>
                        <div class="header-title-section">
                            <h1 id="dashboard-title" class="header-title">
                                <a href="/#/">${appConfig.getAppName()}</a>
                            </h1>
                            <p class="header-description">${appConfig.getAppDescription()}</p>
                        </div>
                    </div>

                    <!-- Navigation Tabs -->
                    <nav class="header-nav">
                        <a href="/#/" 
                           class="nav-tab"
                           data-route="/">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                            </svg>
                            <span>${i18n.t('WEATHER_STATIONS') || 'Stations'}</span>
                        </a>
                        <a href="/#/dashboard" 
                           class="nav-tab"
                           data-route="/dashboards">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                      d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 0v10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2z"/>
                            </svg>
                            <span>${i18n.t('DASHBOARDS') || 'Dashboards'}</span>
                        </a>
                    </nav>

                    <!-- Settings Button -->
                    <button id="settings-btn" class="header-settings-btn">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                    </button>
                </div>
            </div>
        </header>
        <wm-settings-offcanvas id="settings-offcanvas" triggeredby="#settings-btn"></wm-settings-offcanvas>
    `;
}
