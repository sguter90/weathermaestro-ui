# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Reload/refresh button to dashboard detail view and dashboard list view for re-fetching fresh data from the API
- German translations for reload button labels (`RELOAD_DASHBOARD`, `RELOAD_DASHBOARDS`)
- `.btn-secondary.loading` CSS class with spinner animation for loading states
- Reload button visible to all users (not restricted to authenticated users)
- Accessibility support (aria-label, keyboard accessibility) for reload buttons
