/**
 * Application Context for managing global state
 */

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { FunifierAPIService } from '../services/FunifierAPIService';
import type { Area, Level, PlayerStats } from '../types';

/**
 * Application state interface
 */
export interface AppState {
  areas: Area[];
  levels: Level[];
  selectedAreaId: string | null;
  playerStats: PlayerStats | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Application context value interface
 */
export interface AppContextValue extends AppState {
  setSelectedAreaId: (areaId: string | null) => void;
  setPlayerStats: (stats: PlayerStats | null) => void;
  refreshAreas: () => Promise<void>;
  refreshLevels: () => Promise<void>;
  refreshAll: () => Promise<void>;
}

/**
 * React Context for application state
 */
const AppContext = createContext<AppContextValue | undefined>(undefined);

/**
 * Props for AppProvider component
 */
interface AppProviderProps {
  children: ReactNode;
}

/**
 * Provider component that manages application state
 */
export function AppProvider({ children }: AppProviderProps) {
  const { config } = useAuth();
  const [areas, setAreas] = useState<Area[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Refresh areas from API
   */
  const refreshAreas = useCallback(async () => {
    if (!config) return;

    setIsLoading(true);
    setError(null);

    try {
      const apiService = new FunifierAPIService(config);
      const areasData = await apiService.getAreas();
      setAreas(areasData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load areas';
      setError(errorMessage);
      console.error('Error refreshing areas:', err);
    } finally {
      setIsLoading(false);
    }
  }, [config]);

  /**
   * Refresh levels from API
   */
  const refreshLevels = useCallback(async () => {
    if (!config) return;

    setIsLoading(true);
    setError(null);

    try {
      const apiService = new FunifierAPIService(config);
      const levelsData = await apiService.getLevels();
      setLevels(levelsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load levels';
      setError(errorMessage);
      console.error('Error refreshing levels:', err);
    } finally {
      setIsLoading(false);
    }
  }, [config]);

  /**
   * Refresh both areas and levels from API
   */
  const refreshAll = useCallback(async () => {
    if (!config) return;

    setIsLoading(true);
    setError(null);

    try {
      const apiService = new FunifierAPIService(config);
      const [areasData, levelsData] = await Promise.all([
        apiService.getAreas(),
        apiService.getLevels(),
      ]);
      setAreas(areasData);
      setLevels(levelsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
      setError(errorMessage);
      console.error('Error refreshing data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [config]);

  const value: AppContextValue = {
    areas,
    levels,
    selectedAreaId,
    playerStats,
    isLoading,
    error,
    setSelectedAreaId,
    setPlayerStats,
    refreshAreas,
    refreshLevels,
    refreshAll,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/**
 * Hook to access application context
 * @returns Application context value
 * @throws Error if used outside of AppProvider
 */
export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
