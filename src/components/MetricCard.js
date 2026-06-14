import {css, LitElement} from 'lit';

/**
 * Base Metric Card Widget - Provides common styling and structure for all metric cards
 */
export class MetricCard extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
            }

            .metric-card {
                border-radius: 1rem;
                padding: 1.1rem;
                background: linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.8));
                border: 1px solid rgba(71, 85, 105, 0.3);
            }

            .card-header {
                text-align: center;
                margin: 0.7rem 0;
            }

            .card-header h4 {
                font-size: 0.875rem;
                font-weight: 600;
                color: white;
                margin: 0;
            }

            .metric-row {
                display: flex;
                align-items: baseline;
                justify-content: center;
                gap: 0.25rem;
                margin-bottom: 0.5rem;
                margin-top: 0.1rem;
            }

            .metric-value {
                font-size: 1.5rem;
                font-weight: bold;
                font-family: 'JetBrains Mono', monospace;
            }

            .metric-unit {
                font-size: 0.875rem;
                color: rgb(148, 163, 184);
                font-weight: 500;
            }

            .content-wrapper {
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            p {
                margin: 0;
            }

            .text-center {
                text-align: center;
            }

            .text-label {
                font-size: .9rem;
                color: rgb(194, 203, 216);
                margin-bottom: 0.25rem;
            }
            
            .text-sub {
                font-size: 0.75rem;
            }

            /*
             * Mobile (<= 640px): compact sizing so two metric widgets fit
             * side by side on phones. These rules apply to every component
             * that inherits or spreads MetricCard.styles (all metric widgets do),
             * because each lives in its own Shadow DOM and global CSS cannot
             * reach inside.
             */
            @media (max-width: 640px) {
                .metric-card    { padding: 0.6rem; border-radius: 0.75rem; }
                .card-header    { margin: 0.35rem 0; }
                .card-header h4 { font-size: 0.75rem; }
                .metric-value   { font-size: 1.15rem; }
                .metric-unit    { font-size: 0.7rem; }
                .text-label     { font-size: 0.7rem; }
                .text-sub       { font-size: 0.65rem; }
                .metric-row     { gap: 0.15rem; margin-bottom: 0.25rem; }

                /*
                 * Generic SVG shrink. Every metric SVG defines a viewBox, so
                 * constraining the box and letting the other dimension be auto
                 * scales it down proportionally without distortion. We cap BOTH
                 * max-width and max-height: wide SVGs (gauges) are limited by
                 * width, tall/narrow SVGs (e.g. the thermometer, 80x140) are
                 * limited by height — which max-width alone could not shrink.
                 */
                .metric-card svg {
                    max-width: 100px;
                    max-height: 110px;
                    width: auto;
                    height: auto;
                }
            }
        `];
}