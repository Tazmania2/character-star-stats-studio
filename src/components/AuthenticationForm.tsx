/**
 * Authentication form component for Funifier API credentials
 */

import { useState, type FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FunifierAPIService } from '../services/FunifierAPIService';
import type { AuthConfig } from '../types';

/**
 * Form component for authenticating with the Funifier API
 */
export function AuthenticationForm() {
  const { setAuth } = useAuth();
  const [serverUrl, setServerUrl] = useState('https://service2.funifier.com');
  const [bearerToken, setBearerToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form validation errors
  const [urlError, setUrlError] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);

  /**
   * Validates the server URL format
   * @param url - URL to validate
   * @returns true if valid, false otherwise
   */
  const validateUrl = (url: string): boolean => {
    if (!url.trim()) {
      setUrlError('Server URL is required');
      return false;
    }

    try {
      const urlObj = new URL(url);
      if (urlObj.protocol !== 'https:' && urlObj.protocol !== 'http:') {
        setUrlError('URL must use HTTP or HTTPS protocol');
        return false;
      }
      setUrlError(null);
      return true;
    } catch {
      setUrlError('Invalid URL format');
      return false;
    }
  };

  /**
   * Validates the bearer token
   * @param token - Token to validate
   * @returns true if valid, false otherwise
   */
  const validateToken = (token: string): boolean => {
    if (!token.trim()) {
      setTokenError('Bearer token is required');
      return false;
    }
    setTokenError(null);
    return true;
  };

  /**
   * Tests the API connection with provided credentials
   * @param config - Authentication configuration to test
   * @returns Promise resolving to true if connection successful
   */
  const testConnection = async (config: AuthConfig): Promise<boolean> => {
    try {
      const apiService = new FunifierAPIService(config);
      // Test connection by fetching areas
      await apiService.getAreas();
      return true;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to connect to Funifier API');
    }
  };

  /**
   * Handles form submission
   * @param e - Form event
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Reset states
    setError(null);
    setSuccess(false);

    // Validate inputs
    const isUrlValid = validateUrl(serverUrl);
    const isTokenValid = validateToken(bearerToken);

    if (!isUrlValid || !isTokenValid) {
      return;
    }

    setIsLoading(true);

    try {
      const config: AuthConfig = {
        serverUrl: serverUrl.trim(),
        bearerToken: bearerToken.trim(),
      };

      // Test the connection
      await testConnection(config);

      // If successful, save credentials
      setAuth(config);
      setSuccess(true);
      setError(null);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to authenticate. Please check your credentials.');
      }
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Character Star Stats Studio
          </h1>
          <p className="text-gray-600">
            Connect to your Funifier API to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Server URL Input */}
          <div>
            <label
              htmlFor="serverUrl"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Server URL
            </label>
            <input
              type="text"
              id="serverUrl"
              value={serverUrl}
              onChange={(e) => {
                setServerUrl(e.target.value);
                setUrlError(null);
                setError(null);
              }}
              onBlur={() => validateUrl(serverUrl)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                urlError ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="https://service2.funifier.com"
              disabled={isLoading}
            />
            {urlError && (
              <p className="mt-1 text-sm text-red-600">{urlError}</p>
            )}
          </div>

          {/* Bearer Token Input */}
          <div>
            <label
              htmlFor="bearerToken"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Bearer Token
            </label>
            <input
              type="password"
              id="bearerToken"
              value={bearerToken}
              onChange={(e) => {
                setBearerToken(e.target.value);
                setTokenError(null);
                setError(null);
              }}
              onBlur={() => validateToken(bearerToken)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                tokenError ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your API bearer token"
              disabled={isLoading}
            />
            {tokenError && (
              <p className="mt-1 text-sm text-red-600">{tokenError}</p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                Successfully connected to Funifier API!
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition ${
              isLoading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Connecting...
              </span>
            ) : (
              'Connect'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Your credentials are stored locally and never sent to third parties
          </p>
        </div>
      </div>
    </div>
  );
}
