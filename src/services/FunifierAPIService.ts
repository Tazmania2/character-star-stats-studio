/**
 * Service class for interacting with the Funifier API
 */

import axios, { type AxiosInstance, AxiosError } from 'axios';
import type {
  AuthConfig,
  Area,
  Level,
  PlayerStats,
  CreateAreaRequest,
  CreateLevelRequest,
  LevelQueryParams,
} from '../types';
import {
  AuthError,
  ValidationError,
  NetworkError,
} from '../types';

/**
 * Main service class for all Funifier API operations
 */
export class FunifierAPIService {
  private axiosInstance: AxiosInstance;
  private config: AuthConfig;

  /**
   * Creates a new FunifierAPIService instance
   * @param config - Authentication configuration with server URL and bearer token
   */
  constructor(config: AuthConfig) {
    this.config = config;

    // Create axios instance with base configuration
    this.axiosInstance = axios.create({
      baseURL: config.serverUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to inject Authorization header
    this.axiosInstance.interceptors.request.use(
      (config) => {
        config.headers.Authorization = `Bearer ${this.config.bearerToken}`;
        return config;
      },
      (error) => {
        return Promise.reject(this.transformError(error));
      }
    );

    // Add response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        return Promise.reject(this.transformError(error));
      }
    );
  }

  /**
   * Transforms axios errors into application-specific error types
   * @param error - The error to transform
   * @returns Transformed error
   */
  private transformError(error: unknown): Error {
    if (!axios.isAxiosError(error)) {
      return error instanceof Error ? error : new Error('Unknown error occurred');
    }

    const axiosError = error as AxiosError;

    // Handle authentication errors
    if (axiosError.response?.status === 401) {
      return new AuthError('Authentication failed. Please check your credentials.');
    }

    // Handle validation errors
    if (axiosError.response?.status === 400) {
      const message = this.extractErrorMessage(axiosError);
      return new ValidationError(message || 'Validation failed. Please check your input.');
    }

    // Handle not found errors
    if (axiosError.response?.status === 404) {
      return new NetworkError('Resource not found', 404);
    }

    // Handle server errors
    if (axiosError.response?.status && axiosError.response.status >= 500) {
      return new NetworkError(
        'Server error occurred. Please try again later.',
        axiosError.response.status
      );
    }

    // Handle network errors (no response)
    if (!axiosError.response) {
      return new NetworkError(
        'Unable to connect to Funifier API. Please check your network connection and server URL.'
      );
    }

    // Default error
    return new NetworkError(
      this.extractErrorMessage(axiosError) || 'An unexpected error occurred',
      axiosError.response?.status
    );
  }

  /**
   * Extracts error message from axios error response
   * @param error - Axios error
   * @returns Error message or undefined
   */
  private extractErrorMessage(error: AxiosError): string | undefined {
    const data = error.response?.data as any;
    return data?.message || data?.error || error.message;
  }

  // ==================== Area API Methods ====================

  /**
   * Retrieves all areas
   * @returns Promise resolving to array of areas
   */
  async getAreas(): Promise<Area[]> {
    try {
      const response = await this.axiosInstance.get<Area[]>('/v3/characterstarstats');
      return response.data;
    } catch (error) {
      throw this.transformError(error);
    }
  }

  /**
   * Retrieves a specific area by ID
   * @param id - Area ID
   * @returns Promise resolving to the area
   */
  async getArea(id: string): Promise<Area> {
    try {
      const response = await this.axiosInstance.get<Area>(`/v3/characterstarstats/area/${id}`);
      return response.data;
    } catch (error) {
      throw this.transformError(error);
    }
  }

  /**
   * Creates a new area
   * @param area - Area data to create
   * @returns Promise resolving to the created area
   */
  async createArea(area: CreateAreaRequest): Promise<Area> {
    try {
      const response = await this.axiosInstance.post<Area>('/v3/characterstarstats/area', area);
      return response.data;
    } catch (error) {
      throw this.transformError(error);
    }
  }

  /**
   * Deletes an area by ID
   * @param id - Area ID to delete
   * @returns Promise resolving when deletion is complete
   */
  async deleteArea(id: string): Promise<void> {
    try {
      await this.axiosInstance.delete(`/v3/characterstarstats/area/${id}`);
    } catch (error) {
      throw this.transformError(error);
    }
  }

  // ==================== Level API Methods ====================

  /**
   * Retrieves levels with optional filtering and sorting
   * @param params - Query parameters for filtering and sorting
   * @returns Promise resolving to array of levels
   */
  async getLevels(params?: LevelQueryParams): Promise<Level[]> {
    try {
      const response = await this.axiosInstance.get<Level[]>('/v3/characterstarstats/level', {
        params,
      });
      return response.data;
    } catch (error) {
      throw this.transformError(error);
    }
  }

  /**
   * Retrieves a specific level by ID
   * @param id - Level ID
   * @returns Promise resolving to the level
   */
  async getLevel(id: string): Promise<Level> {
    try {
      const response = await this.axiosInstance.get<Level>(`/v3/characterstarstats/level/${id}`);
      return response.data;
    } catch (error) {
      throw this.transformError(error);
    }
  }

  /**
   * Creates a new level
   * @param level - Level data to create
   * @returns Promise resolving to the created level
   */
  async createLevel(level: CreateLevelRequest): Promise<Level> {
    try {
      const response = await this.axiosInstance.post<Level>('/v3/characterstarstats/level', level);
      return response.data;
    } catch (error) {
      throw this.transformError(error);
    }
  }

  /**
   * Deletes a level by ID
   * @param id - Level ID to delete
   * @returns Promise resolving when deletion is complete
   */
  async deleteLevel(id: string): Promise<void> {
    try {
      await this.axiosInstance.delete(`/v3/characterstarstats/level/${id}`);
    } catch (error) {
      throw this.transformError(error);
    }
  }

  // ==================== Player Evaluation Methods ====================

  /**
   * Evaluates a player's progress across all areas
   * @param playerId - Player ID to evaluate
   * @returns Promise resolving to player statistics
   */
  async evaluatePlayer(playerId: string): Promise<PlayerStats> {
    try {
      const response = await this.axiosInstance.get<PlayerStats>(
        `/v3/characterstarstats/player/${playerId}`
      );
      return response.data;
    } catch (error) {
      throw this.transformError(error);
    }
  }
}
