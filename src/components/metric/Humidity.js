import {html, svg} from 'lit';
import {MetricCard} from '../MetricCard.js';
import {i18n} from "../../i18n/i18n.js";
import {Weather} from "../../lib/Weather.js";
import {uiConfigManager} from "../../lib/UiConfigManager.js";
import {UNIT_HUMIDITY} from "../../config/units.js";

/**
 * Humidity Widget - Displays humidity data with animated humidity level
 */
export class Humidity extends MetricCard {
    static properties = {
        humidity: {type: Number},
    };

    constructor() {
        super();
        this.humidity = 0;
    }

    render() {
        const humidityInfo = this.getHumidityInfo(this.humidity);
        const fillLevel = Math.min(Math.max(this.humidity, 0), 100);

        // Convert value for display
        const convertedValue = uiConfigManager.convert(this.humidity, UNIT_HUMIDITY);
        const displayUnit = uiConfigManager.getUnitLabel(UNIT_HUMIDITY);

        return html`
            <div class="metric-card">
                <h4 class="card-header">${i18n.t('HUMIDITY_HEADER')}</h4>
                <div class="text-center">
                    ${this.renderHumidityGauge(humidityInfo, fillLevel)}
                    <div class="metric-row">
                        <p class="metric-value" style="color: ${humidityInfo.color};">${convertedValue}</p>
                        <p class="metric-unit">${displayUnit}</p>
                    </div>
                    <p class="text-label">${i18n.t('HUMIDITY_LABEL')}</p>
                    <p class="text-sub" style="color: ${humidityInfo.color};">
                        ${Weather.getHumidityLabel(this.humidity)}</p>
                </div>
            </div>
        `;
    }

    getHumidityInfo(humidity) {
        if (humidity < 30) {
            return {
                color: '#f59e0b',
                colorLight: '#fbbf24',
                category: 'Zu trocken',
                dropletCount: 2
            };
        } else if (humidity < 40) {
            return {
                color: '#eab308',
                colorLight: '#facc15',
                category: 'Trocken',
                dropletCount: 3
            };
        } else if (humidity <= 60) {
            return {
                color: '#22c55e',
                colorLight: '#4ade80',
                category: 'Optimal',
                dropletCount: 4
            };
        } else if (humidity <= 70) {
            return {
                color: '#3b82f6',
                colorLight: '#60a5fa',
                category: 'Leicht feucht',
                dropletCount: 5
            };
        } else {
            return {
                color: '#8b5cf6',
                colorLight: '#a78bfa',
                category: 'Zu feucht',
                dropletCount: 6
            };
        }
    }

    renderHumidityGauge(humidityInfo, fillLevel) {
        // Calculate particle count based on humidity
        const particleCount = Math.ceil((fillLevel / 100) * 30); // Max 30 particles
        const particles = this.generateParticles(particleCount, fillLevel);

        return svg`
        <svg width="180" height="140" viewBox="0 0 180 140" class="mb-3">
            <defs>
                <linearGradient id="humidityBgGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#1e293b;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#0f172a;stop-opacity:1" />
                </linearGradient>

                <filter id="particleGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>

                <filter id="containerGlow">
                    <feGaussianBlur stdDeviation="2"/>
                    <feComponentTransfer>
                        <feFuncA type="linear" slope="0.3"/>
                    </feComponentTransfer>
                </filter>
            </defs>

            <!-- Background container -->
            <rect x="10" y="10" width="160" height="120" 
                  rx="8" ry="8"
                  fill="url(#humidityBgGradient)" 
                  stroke="${humidityInfo.color}" 
                  stroke-width="2" 
                  opacity="0.4" />

            ${particles.map((particle, index) => {
            const endY = Math.max(particle.y - particle.distance, particle.maxY);
            const endX = Math.max(Math.min(particle.x + particle.drift, particle.maxX), particle.minX);

            // Create the droplet path with transform for animation
            const dropletPath = `M 0 ${-particle.radius * 1.5} 
                                             C ${-particle.radius * 0.7} ${-particle.radius * 0.3},
                                               ${-particle.radius * 0.7} ${particle.radius * 0.5},
                                               0 ${particle.radius * 1.2}
                                             C ${particle.radius * 0.7} ${particle.radius * 0.5},
                                               ${particle.radius * 0.7} ${-particle.radius * 0.3},
                                               0 ${-particle.radius * 1.5} Z`;

            return svg`
                        <g transform="translate(${particle.x}, ${particle.y})">
                            <animateTransform attributeName="transform" type="translate"
                                values="${particle.x},${particle.y};${endX},${endY};${particle.x},${particle.y}" 
                                dur="${particle.duration}s" 
                                begin="${particle.delay}s"
                                repeatCount="indefinite" />
                            <path d="${dropletPath}"
                                  fill="${humidityInfo.colorLight}" 
                                  opacity="${particle.opacity}"
                                  filter="url(#particleGlow)" />
                            <animate attributeName="opacity" 
                                values="${particle.opacity};${particle.opacity * 0.3};${particle.opacity}" 
                                dur="${particle.duration}s" 
                                begin="${particle.delay}s"
                                repeatCount="indefinite" />
                        </g>
                        `
        })}

            <!-- Top border glow effect -->
            <rect x="10" y="10" width="160" height="120" 
                  rx="8" ry="8"
                  fill="none" 
                  stroke="${humidityInfo.color}" 
                  stroke-width="2" 
                  opacity="0.6"
                  filter="url(#containerGlow)" />
        </svg>
    `;
    }

    generateParticles(count, fillLevel) {
        const particles = [];
        const containerX = 10;
        const containerY = 10;
        const containerWidth = 160;
        const containerHeight = 120;
        const padding = 8;

        for (let i = 0; i < count; i++) {
            // Tropfen überall im Container verteilt
            particles.push({
                x: containerX + padding + Math.random() * (containerWidth - padding * 2),
                y: containerY + padding + Math.random() * (containerHeight - padding * 2),
                radius: 3 + Math.random() * 2,
                opacity: 0.3 + Math.random() * 0.5,
                duration: 3 + Math.random() * 3,
                delay: Math.random() * 2,
                distance: 15 + Math.random() * 25,
                drift: -8 + Math.random() * 16,
                maxY: containerY + padding,
                minX: containerX + padding,
                maxX: containerX + containerWidth - padding
            });
        }

        return particles;
    }
}

customElements.define('humidity-metric', Humidity);