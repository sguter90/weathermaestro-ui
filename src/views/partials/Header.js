import {appConfig} from '../../lib/AppConfig.js';
import {i18n} from '../../i18n/i18n.js';
import '../../components/SettingsOffCanvas.js';
import {router} from "../../lib/Router.js";

export function renderHeader() {
    const currentPath = router.getCurrentPath();

    return `
        <header class="bg-slate-800/50 border-b border-slate-700 backdrop-blur-sm sticky top-0 z-40">
            <div class="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
                <div class="flex items-center justify-between gap-4">
                    <!-- Logo Section -->
                    <div class="flex items-center gap-4 flex-shrink-0">
                        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
                            <a href="/#/" title="Logo">
                                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/>
                                </svg>
                            </a>
                        </div>
                        <div class="hidden sm:block">
                            <h1 id="dashboard-title" class="text-xl sm:text-2xl font-bold text-white">
                                <a href="/#/">${appConfig.getAppName()}</a>
                            </h1>
                            <p class="text-xs sm:text-sm text-slate-400">${appConfig.getAppDescription()}</p>
                        </div>
                    </div>

                    <!-- Navigation Tabs -->
                    <nav class="flex gap-2 flex-1 justify-center overflow-x-auto scrollbar-none">
                        <a href="/#/" 
                           class="nav-tab"
                           data-route="/">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                            </svg>
                            <span class="hidden sm:inline">${i18n.t('WEATHER_STATIONS') || 'Stations'}</span>
                        </a>
                        <a href="/#/dashboard" 
                           class="nav-tab"
                           data-route="/dashboards">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                      d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 0v10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2z"/>
                            </svg>
                            <span class="hidden sm:inline">${i18n.t('DASHBOARDS') || 'Dashboards'}</span>
                        </a>
                    </nav>

                    <!-- Settings Button -->
                    <button id="settings-btn" class="p-2.5 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors flex-shrink-0">
                        <svg class="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                    </button>
                </div>
            </div>
        </header>
        <wm-settings-offcanvas id="settings-offcanvas" triggeredby="#settings-btn"></wm-settings-offcanvas>
        
        <style>
            .nav-tab {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.5rem 1rem;
                border-radius: 0.75rem;
                font-size: 0.875rem;
                font-weight: 500;
                color: rgb(148, 163, 184);
                text-decoration: none;
                transition: all 0.2s;
                white-space: nowrap;
            }
            
            .nav-tab:hover {
                color: white;
                background: rgba(71, 85, 105, 0.3);
            }
            
            .nav-tab.active {
                color: white;
                background: rgba(59, 130, 246, 0.2);
                border: 1px solid rgba(59, 130, 246, 0.3);
            }
            
            .scrollbar-none {
                scrollbar-width: none;
            }
            
            .scrollbar-none::-webkit-scrollbar {
                display: none;
            }
            
            @media (max-width: 640px) {
                nav {
                    flex: 0 1 auto;
                }
            }
        </style>
    `;
}
