import { apiClient } from "./ApiClient.js";

/**
 * Manages authentication state and token handling
 */
export class AuthManager {
    constructor() {
        this.token = null;
        this.user = null;
        this.tokenExpiresAt = null;
        this.refreshTimer = null;

        // Set reference in apiClient to avoid circular dependency
        apiClient.setAuthManager(this);

        this.loadFromStorage();
        this.setupAutoRefresh();
    }

    /**
     * Load tokens from localStorage
     */
    loadFromStorage() {
        try {
            const stored = localStorage.getItem('auth_tokens');
            if (stored) {
                const data = JSON.parse(stored);
                this.token = data.token;
                this.tokenExpiresAt = data.expiresAt;
                this.user = data.user;
            }
        } catch (error) {
            console.error('Error loading auth tokens:', error);
        }
    }

    /**
     * Save tokens to localStorage
     */
    saveToStorage() {
        try {
            const data = {
                token: this.token,
                expiresAt: this.tokenExpiresAt,
                user: this.user
            };
            localStorage.setItem('auth_tokens', JSON.stringify(data));
        } catch (error) {
            console.error('Error saving auth tokens:', error);
        }
    }

    /**
     * Clear tokens from storage
     */
    clearStorage() {
        localStorage.removeItem('auth_tokens');
        this.token = null;
        this.user = null;
        this.tokenExpiresAt = null;
    }

    /**
     * Login with credentials
     */
    async login(username, password) {
        try {
            const data = await apiClient.login(username, password);

            if (!data.success) {
                throw new Error('Login failed');
            }

            this.setTokens(data);

            return true;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    /**
     * Logout
     */
    async logout() {
        try {
            if (this.token) {
                await apiClient.logout(this.token);
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.clearStorage();
            if (this.refreshTimer) {
                clearTimeout(this.refreshTimer);
            }
        }
    }

    /**
     * Set tokens and schedule refresh
     */
    setTokens(data) {
        this.token = data.token;
        this.tokenExpiresAt = data.expiresAt; // Already a timestamp from server
        this.user = data.user; // { ID, Username }

        this.saveToStorage();
        this.setupAutoRefresh();
    }

    /**
     * Refresh access token
     */
    async refreshAccessToken() {
        if (!this.token) {
            throw new Error('No token available');
        }

        try {
            const data = await apiClient.refreshToken();

            if (!data.success) {
                throw new Error('Token refresh failed');
            }

            this.setTokens(data);

            return true;
        } catch (error) {
            console.error('Token refresh error:', error);
            // If refresh fails, logout user
            await this.logout();
            throw error;
        }
    }

    /**
     * Setup automatic token refresh
     */
    setupAutoRefresh() {
        if (this.refreshTimer) {
            clearTimeout(this.refreshTimer);
        }

        if (!this.tokenExpiresAt) {
            return;
        }

        // Convert server timestamp to milliseconds if needed
        const expiresAt = typeof this.tokenExpiresAt === 'number'
            ? this.tokenExpiresAt * 1000 // Assume seconds, convert to ms
            : new Date(this.tokenExpiresAt).getTime();

        // Refresh 5 minutes before expiration
        const refreshTime = expiresAt - Date.now() - (5 * 60 * 1000);

        if (refreshTime > 0) {
            this.refreshTimer = setTimeout(() => {
                this.refreshAccessToken().catch(console.error);
            }, refreshTime);
        } else {
            // Token already expired or about to expire, refresh immediately
            this.refreshAccessToken().catch(console.error);
        }
    }

    /**
     * Fetch current user info
     */
    async fetchUserInfo() {
        try {
            this.user = await apiClient.getUserInfo(this.token);
            this.saveToStorage();

            return this.user;
        } catch (error) {
            console.error('Error fetching user info:', error);
            throw error;
        }
    }

    /**
     * Get authorization header
     */
    getAuthHeader() {
        return this.token ? `Bearer ${this.token}` : null;
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        if (!this.token) {
            return false;
        }

        if (!this.tokenExpiresAt) {
            return true; // If no expiration, assume valid
        }

        // Convert to milliseconds if needed
        const expiresAt = typeof this.tokenExpiresAt === 'number'
            ? this.tokenExpiresAt * 1000
            : new Date(this.tokenExpiresAt).getTime();

        return expiresAt > Date.now();
    }

    /**
     * Get current user
     */
    getUser() {
        return this.user;
    }

    /**
     * Get user ID
     */
    getUserId() {
        return this.user?.ID || this.user?.id;
    }

    /**
     * Get username
     */
    getUsername() {
        return this.user?.Username || this.user?.username;
    }
}

export const authManager = new AuthManager();