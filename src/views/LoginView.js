import { viewManager } from "../lib/ViewManager.js";
import { authManager } from "../lib/AuthManager.js";
import { router } from "../lib/Router.js";
import {LoginForm} from "../components/LoginForm.js";

/**
 * Render Login View
 */
export async function renderLoginView() {
    // Redirect if already authenticated
    if (authManager.isAuthenticated()) {
        router.navigate('/');
        return;
    }

    const container = document.createElement('div');
    container.className = 'login-container';
    
    const loginForm = new LoginForm();
    
    // Handle successful login
    loginForm.addEventListener('login-success', (e) => {
        // Navigate to home or previous page
        const returnUrl = new URLSearchParams(window.location.search).get('returnUrl') || '/';
        router.navigate(returnUrl);
    });
    
    container.appendChild(loginForm);
    viewManager.render(container);
}