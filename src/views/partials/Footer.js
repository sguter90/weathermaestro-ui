import {appConfig} from '../../lib/AppConfig.js';

export function renderFooter() {
    return `
    <footer class="bg-slate-800/50 border-t border-slate-700/50 py-4 mt-auto">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
                <p style="font-size: 16px;">© 2025-${new Date().getFullYear()} ${appConfig.getAppName()}</p>
            </div>
        </div>
    </footer>
    `
}