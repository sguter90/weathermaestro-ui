import {css, html, LitElement} from 'lit';
import {authManager} from '../lib/AuthManager.js';
import {appConfig} from "../lib/AppConfig.js";
import {i18n} from "../i18n/i18n.js";

export class LoginForm extends LitElement {
    static properties = {
        loading: {type: Boolean},
        error: {type: String}
    };

    static styles = css`
        :host {
            display: block;
        }

        .login-container {
            max-width: 400px;
            margin: 0 auto;
            padding: 2rem;
        }

        .login-card {
            background: linear-gradient(145deg, #1e293b 0%, #0f172a 100%);
            border-radius: 1rem;
            padding: 2rem;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        }

        .logo {
            text-align: center;
            margin-bottom: 2rem;
        }

        .logo-icon {
            width: 64px;
            height: 64px;
            margin: 0 auto 1rem;
            background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
            border-radius: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        h2 {
            color: #f1f5f9;
            margin: 0 0 0.5rem 0;
            font-size: 1.5rem;
            font-weight: 600;
        }

        .subtitle {
            color: #94a3b8;
            font-size: 0.875rem;
        }

        .form-group {
            margin-bottom: 1.5rem;
        }

        label {
            display: block;
            color: #f1f5f9;
            font-size: 0.875rem;
            font-weight: 500;
            margin-bottom: 0.5rem;
        }

        input {
            width: 100%;
            padding: 0.75rem 1rem;
            background: #0f172a;
            border: 1px solid #334155;
            border-radius: 0.5rem;
            color: #f1f5f9;
            font-size: 1rem;
            transition: all 0.2s;
            box-sizing: border-box;
        }

        input:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .error-message {
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.3);
            color: #fca5a5;
            padding: 0.75rem 1rem;
            border-radius: 0.5rem;
            font-size: 0.875rem;
            margin-bottom: 1rem;
        }

        button {
            width: 100%;
            padding: 0.875rem 1rem;
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            color: white;
            border: none;
            border-radius: 0.5rem;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        }

        button:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
        }

        button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }

        .loading-spinner {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
            to {
                transform: rotate(360deg);
            }
        }
    `;

    constructor() {
        super();
        this.loading = false;
        this.error = '';
    }

    async handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const username = formData.get('username');
        const password = formData.get('password');

        if (!username || !password) {
            this.error = i18n.t('ERROR_USERNAME_AND_PASSWORD_REQUIRED');
            return;
        }

        this.loading = true;
        this.error = '';

        try {
            await authManager.login(username, password);

            // Dispatch success event
            this.dispatchEvent(new CustomEvent('login-success', {
                bubbles: true,
                composed: true,
                detail: {user: authManager.getUser()}
            }));
        } catch (error) {
            this.error = error.message || i18n.t('ERROR_LOGIN_FAILED');
        } finally {
            this.loading = false;
        }
    }

    render() {
        return html`
            <div class="login-container">
                <div class="login-card">
                    <div class="logo">
                        <div class="logo-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                      d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/>
                            </svg>
                        </div>
                        <h2>${appConfig.getAppName()}</h2>
                    </div>

                    ${this.error ? html`
                        <div class="error-message">
                            ${this.error}
                        </div>
                    ` : ''}

                    <form @submit=${this.handleSubmit}>
                        <div class="form-group">
                            <label for="username">${i18n.t('USERNAME')}</label>
                            <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    autocomplete="username"
                                    ?disabled=${this.loading}
                                    required
                            />
                        </div>

                        <div class="form-group">
                            <label for="password">${i18n.t('PASSWORD')}</label>
                            <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    autocomplete="current-password"
                                    ?disabled=${this.loading}
                                    required
                            />
                        </div>

                        <button type="submit" ?disabled=${this.loading}>
                            ${this.loading ? html`
                                <span class="loading-spinner"></span>
                            ` : i18n.t('LOGIN')}
                        </button>
                    </form>
                </div>
            </div>
        `;
    }
}

customElements.define('login-form', LoginForm);