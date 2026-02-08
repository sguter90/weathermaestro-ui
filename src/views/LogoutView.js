import { viewManager } from "../lib/ViewManager.js";
import { authManager } from "../lib/AuthManager.js";
import { router } from "../lib/Router.js";
import { i18n } from "../i18n/i18n.js";

/**
 * Render Logout View
 */
export async function renderLogoutView() {
    viewManager.showLoading(i18n.t('LOGGING_OUT') || 'Logging out...');

    try {
        await authManager.logout();
        router.navigate('/login');
        
    } catch (error) {
        console.error('Logout error:', error);
        viewManager.showError(error.message || i18n.t('LOGOUT_ERROR') || 'Logout failed');
        
        // Redirect to login anyway after error
        setTimeout(() => {
            router.navigate('/login');
        }, 3000);
    }
}