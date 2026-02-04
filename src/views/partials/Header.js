import {appConfig} from '../../lib/AppConfig.js';
import '../../components/SettingsOffCanvas.js';

export function renderHeader() {
    return `
        <header class="bg-slate-800/50 border-b border-slate-700 backdrop-blur-sm sticky top-0 z-40">
            <div class="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4">
                        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
                            <a href="/#/" title="Logo">
                                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/>
                                </svg>
                            </a>
                        </div>
                        <div>
                            <h1 id="dashboard-title" class="text-xl sm:text-2xl font-bold text-white"><a href="/#/">${appConfig.getAppName()}</a></h1>
                            <p class="text-xs sm:text-sm text-slate-400">${appConfig.getAppDescription()}</p>
                        </div>
                    </div>
                    <button id="settings-btn" class="p-2.5 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors">
                        <svg class="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

