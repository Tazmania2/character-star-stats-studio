/**
 * Authentication types and interfaces
 */

/**
 * Configuration for Funifier API authentication
 */
export interface AuthConfig {
  serverUrl: string;
  bearerToken: string;
}

/**
 * Context value for authentication state management
 */
export interface AuthContextValue {
  config: AuthConfig | null;
  isAuthenticated: boolean;
  setAuth: (config: AuthConfig) => void;
  clearAuth: () => void;
}
