/**
 * Authentication Context for managing Funifier API credentials
 */

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { AuthConfig, AuthContextValue } from '../types';

const STORAGE_KEY = 'funifier_auth_config';

/**
 * React Context for authentication state
 */
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Props for AuthProvider component
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Provider component that manages authentication state and persistence
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [config, setConfig] = useState<AuthConfig | null>(null);

  // Load credentials from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AuthConfig;
        setConfig(parsed);
      }
    } catch (error) {
      console.error('Failed to load auth config from localStorage:', error);
      // Clear invalid data
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  /**
   * Sets authentication configuration and persists to localStorage
   * @param newConfig - Authentication configuration to store
   */
  const setAuth = (newConfig: AuthConfig) => {
    try {
      setConfig(newConfig);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
    } catch (error) {
      console.error('Failed to save auth config to localStorage:', error);
      throw new Error('Failed to save authentication configuration');
    }
  };

  /**
   * Clears authentication configuration from state and localStorage
   */
  const clearAuth = () => {
    setConfig(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const value: AuthContextValue = {
    config,
    isAuthenticated: config !== null,
    setAuth,
    clearAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access authentication context
 * @returns Authentication context value
 * @throws Error if used outside of AuthProvider
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
