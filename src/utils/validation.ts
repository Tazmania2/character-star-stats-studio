import { ValidationError } from '../types/errors';

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
  field?: string;
}

/**
 * Validates an area ID
 * Requirements: 7.1 - Area ID is required
 */
export function validateAreaId(id: string): ValidationResult {
  if (!id || id.trim() === '') {
    return {
      isValid: false,
      error: 'Area ID is required',
      field: '_id',
    };
  }

  // Check for valid format (kebab-case recommended)
  const kebabCasePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  if (!kebabCasePattern.test(id)) {
    return {
      isValid: false,
      error: 'Area ID must be in kebab-case format (e.g., "my-area-id")',
      field: '_id',
    };
  }

  return { isValid: true };
}

/**
 * Validates an area title
 * Requirements: 7.2 - Area title is required
 */
export function validateAreaTitle(title: string): ValidationResult {
  if (!title || title.trim() === '') {
    return {
      isValid: false,
      error: 'Area title is required',
      field: 'title',
    };
  }

  if (title.length < 2) {
    return {
      isValid: false,
      error: 'Area title must be at least 2 characters long',
      field: 'title',
    };
  }

  if (title.length > 100) {
    return {
      isValid: false,
      error: 'Area title must not exceed 100 characters',
      field: 'title',
    };
  }

  return { isValid: true };
}

/**
 * Level fields interface for validation
 */
export interface LevelFields {
  area: string;
  level: string;
  position: number | string;
  minPoints: number | string;
}

/**
 * Validates all level fields
 * Requirements: 7.3, 7.4 - All level fields are required and must be valid
 */
export function validateLevelFields(fields: LevelFields): ValidationResult {
  // Validate area
  if (!fields.area || fields.area.trim() === '') {
    return {
      isValid: false,
      error: 'Area is required',
      field: 'area',
    };
  }

  // Validate level name
  if (!fields.level || fields.level.trim() === '') {
    return {
      isValid: false,
      error: 'Level name is required',
      field: 'level',
    };
  }

  if (fields.level.length < 2) {
    return {
      isValid: false,
      error: 'Level name must be at least 2 characters long',
      field: 'level',
    };
  }

  // Validate position
  const position = typeof fields.position === 'string' 
    ? parseInt(fields.position, 10) 
    : fields.position;

  if (isNaN(position)) {
    return {
      isValid: false,
      error: 'Position must be a valid number',
      field: 'position',
    };
  }

  if (position < 0) {
    return {
      isValid: false,
      error: 'Position must be a positive integer',
      field: 'position',
    };
  }

  if (!Number.isInteger(position)) {
    return {
      isValid: false,
      error: 'Position must be an integer',
      field: 'position',
    };
  }

  // Validate minPoints
  const minPoints = typeof fields.minPoints === 'string' 
    ? parseInt(fields.minPoints, 10) 
    : fields.minPoints;

  if (isNaN(minPoints)) {
    return {
      isValid: false,
      error: 'Minimum points must be a valid number',
      field: 'minPoints',
    };
  }

  if (minPoints < 0) {
    return {
      isValid: false,
      error: 'Minimum points must be a positive integer',
      field: 'minPoints',
    };
  }

  if (!Number.isInteger(minPoints)) {
    return {
      isValid: false,
      error: 'Minimum points must be an integer',
      field: 'minPoints',
    };
  }

  return { isValid: true };
}

/**
 * Validates a server URL
 * Requirements: 5.5 - Server URL must be valid
 */
export function validateServerUrl(url: string): ValidationResult {
  if (!url || url.trim() === '') {
    return {
      isValid: false,
      error: 'Server URL is required',
      field: 'serverUrl',
    };
  }

  // Check for valid URL format
  try {
    const urlObj = new URL(url);
    
    // Must be HTTP or HTTPS
    if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
      return {
        isValid: false,
        error: 'Server URL must use HTTP or HTTPS protocol',
        field: 'serverUrl',
      };
    }

    // Must have a hostname
    if (!urlObj.hostname) {
      return {
        isValid: false,
        error: 'Server URL must have a valid hostname',
        field: 'serverUrl',
      };
    }

    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error: 'Server URL is not valid',
      field: 'serverUrl',
    };
  }
}

/**
 * Validates a bearer token
 */
export function validateBearerToken(token: string): ValidationResult {
  if (!token || token.trim() === '') {
    return {
      isValid: false,
      error: 'Bearer token is required',
      field: 'bearerToken',
    };
  }

  if (token.length < 10) {
    return {
      isValid: false,
      error: 'Bearer token appears to be invalid (too short)',
      field: 'bearerToken',
    };
  }

  return { isValid: true };
}

/**
 * Throws a ValidationError if validation fails
 */
export function assertValid(result: ValidationResult): void {
  if (!result.isValid) {
    throw new ValidationError(result.error || 'Validation failed', result.field);
  }
}

/**
 * Validates multiple fields and returns all errors
 */
export function validateMultiple(
  validations: Array<() => ValidationResult>
): ValidationResult[] {
  return validations.map(validate => validate()).filter(result => !result.isValid);
}
