import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        VitePWA({
            registerType: 'autoUpdate',
            injectRegister: 'auto',
            manifest: {
                name: 'WeatherMaestro',
                short_name: 'WeatherMaestro',
                description: 'WeatherMaestro UI',
                theme_color: '#0f172a',
                background_color: '#0f172a',
                display: 'standalone',
                start_url: '/',
                icons: [
                    {
                        src: '/logo.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable',
                    },
                ],
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,svg,png,ico,woff,woff2}'],
                globIgnores: ['**/config.js'],
                navigateFallback: '/index.html',
                navigateFallbackDenylist: [/^\/config\.js$/],
                cleanupOutdatedCaches: true,
                clientsClaim: true,
                skipWaiting: true,
                runtimeCaching: [
                    {
                        urlPattern: /\/config\.js$/,
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'runtime-config',
                            expiration: {
                                maxEntries: 1,
                                maxAgeSeconds: 60 * 60 * 24,
                            },
                            networkTimeoutSeconds: 5,
                        },
                    },
                ],
            },
        }),
    ],
});