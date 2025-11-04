/**
 * API request and response types for Funifier API
 */

import type { Area, Level } from './models';

/**
 * Request payload for creating a new area
 */
export interface CreateAreaRequest {
  _id: string;
  title: string;
}

/**
 * Request payload for creating a new level
 */
export interface CreateLevelRequest {
  area: string;
  level: string;
  position: number;
  minPoints: number;
}

/**
 * Query parameters for fetching levels
 */
export interface LevelQueryParams {
  area?: string;      // Filter by area ID
  orderby?: string;   // Field to sort by
  reverse?: boolean;  // Reverse sort order
}

/**
 * Response from area endpoints
 */
export type AreaResponse = Area;

/**
 * Response from level endpoints
 */
export type LevelResponse = Level;

/**
 * Response from areas list endpoint
 */
export type AreasListResponse = Area[];

/**
 * Response from levels list endpoint
 */
export type LevelsListResponse = Level[];
