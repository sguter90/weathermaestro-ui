# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Space-saving mobile layout: metric widgets now display two per row on phones (mobile-first `.widgets-grid`), with compact widget sizing (fonts, padding, proportional SVG scaling) so all information still fits
- SensorGroup widgets remain full-width on mobile for readability; they scale to the multi-column grid on tablet/desktop

### Changed

- `.widgets-grid` is now mobile-first: 2-column base, scaling to 2 columns at ≥768px and 3 columns at ≥1024px (replaces the previous `auto-fill minmax(300px)` layout)
- `MetricCard` base styles cap SVG visualizations to `max-width: 100px` / `max-height: 110px` on mobile so both wide gauges and the tall thermometer shrink proportionally

## [2.1.1] - 2026-06-14

### Fixed

- Pull-to-refresh now works reliably: the gesture was binding to the dynamically re-rendered `.body-wrapper` element, which did not exist at init time and was replaced on every route change. PTR now binds to the persistent `#app` container, looks up the scroll container dynamically at touch time, and uses a viewport-anchored (`position: fixed`) indicator.

## [2.1.0] - 2026-06-14

### Added

- Pull-to-refresh gesture for mobile devices on all data views (DashboardListView, DashboardDetailView, StationListView, StationDetailView)
- Central `PullToRefreshManager` service attached to the `.body-wrapper` scroll container
- Visual indicator with arrow (rotates at threshold) and spinner during refresh
- Smooth snap-back animation via `.ptr-indicator--snap` CSS class (no drag lag)
- `overscroll-behavior-y: none` on `.body-wrapper` to suppress native browser pull-to-refresh on Android
- Reload/refresh button to dashboard detail view and dashboard list view for re-fetching fresh data from the API
- German translations for reload button labels (`RELOAD_DASHBOARD`, `RELOAD_DASHBOARDS`)
- `.btn-secondary.loading` CSS class with spinner animation for loading states
- Reload button visible to all users (not restricted to authenticated users)
- Accessibility support (aria-label, keyboard accessibility) for reload buttons

### Changed

- `handleReloadDashboards` and `handleReloadDashboard` are now exported for use by `PullToRefreshManager`
- `StationListView` and `StationDetailView` now export `handleReloadStations` / `handleReloadStation` reload callbacks
