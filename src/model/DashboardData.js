/**
 * Dashboard Data Model
 * Represents a dashboard configuration
 */
export class DashboardData {
    constructor(data = {}) {
        this.id = data.id || null;
        this.name = data.name || '';
        this.description = data.description || '';
        this.config = data.config || { sections: [] };
        this.isDefault = data.is_default || false;
        this.createdAt = data.created_at ? new Date(data.created_at) : null;
        this.updatedAt = data.updated_at ? new Date(data.updated_at) : null;
    }

    /**
     * Convert to API format
     */
    toApiFormat() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            config: this.config,
            is_default: this.isDefault
        };
    }

    /**
     * Get sections
     */
    getSections() {
        return this.config.sections || [];
    }

    /**
     * Add section
     */
    addSection(section) {
        if (!this.config.sections) {
            this.config.sections = [];
        }
        this.config.sections.push({
            id: crypto.randomUUID(),
            name: section.name || 'New Section',
            widgets: []
        });
    }

    /**
     * Update section
     */
    updateSection(sectionId, updates) {
        const section = this.config.sections.find(s => s.id === sectionId);
        if (section) {
            Object.assign(section, updates);
        }
    }

    /**
     * Remove section
     */
    removeSection(sectionId) {
        this.config.sections = this.config.sections.filter(s => s.id !== sectionId);
    }

    /**
     * Add widget to section
     */
    addWidget(sectionId, widget) {
        const section = this.config.sections.find(s => s.id === sectionId);
        if (section) {
            if (!section.widgets) {
                section.widgets = [];
            }
            section.widgets.push({
                id: crypto.randomUUID(),
                type: widget.type,
                sensorId: widget.sensorId,
                stationId: widget.stationId,
                config: widget.config || {}
            });
        }
    }

    /**
     * Remove widget from section
     */
    removeWidget(sectionId, widgetId) {
        const section = this.config.sections.find(s => s.id === sectionId);
        if (section) {
            section.widgets = section.widgets.filter(w => w.id !== widgetId);
        }
    }

    /**
     * Check if dashboard is valid for saving
     */
    isValid() {
        return this.name && this.name.trim().length > 0;
    }

    /**
     * Clone dashboard
     */
    clone() {
        return new DashboardData({
            ...this.toApiFormat(),
            id: null,
            created_at: null,
            updated_at: null
        });
    }
}