import { AuthError, ValidationError, NetworkError, AppError } from '../types/errors';
import { AxiosError } from 'axios';

/**
 * Error type enumeration for categorizing errors
 */
export const ErrorType = {
  AUTH: 'auth',
  VALIDATION: 'validation',
  NETWORK: 'network',
  SERVER: 'server',
  UNKNOWN: 'unknown',
} as const;

export type ErrorType = typeof ErrorType[keyof typeof ErrorType];

/**
 * Structured error information
 */
export interface ErrorInfo {
  type: ErrorType;
  message: string;
  originalError?: Error;
  statusCode?: number;
  field?: string;
}

/**
 * Detects the type of error based on the error object
 */
export function detectErrorType(error: unknown): ErrorType {
  if (error instanceof AuthError) {
    return ErrorType.AUTH;
  }
  
  if (error instanceof ValidationError) {
    return ErrorType.VALIDATION;
  }
  
  if (error instanceof NetworkError) {
    return ErrorType.NETWORK;
  }
  
  // Check for Axios errors
  if (isAxiosError(error)) {
    const statusCode = error.response?.status;
    
    if (statusCode === 401 || statusCode === 403) {
      return ErrorType.AUTH;
    }
    
    if (statusCode === 400 || statusCode === 422) {
      return ErrorType.VALIDATION;
    }
    
    if (statusCode && statusCode >= 500) {
      return ErrorType.SERVER;
    }
    
    if (!error.response) {
      return ErrorType.NETWORK;
    }
  }
  
  return ErrorType.UNKNOWN;
}

/**
 * Type guard for Axios errors
 */
function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError).isAxiosError === true;
}

/**
 * Transforms any error into a structured ErrorInfo object
 */
export function transformError(error: unknown): ErrorInfo {
  const type = detectErrorType(error);
  
  // Handle custom app errors
  if (error instanceof ValidationError) {
    return {
      type,
      message: error.message,
      originalError: error,
      field: error.field,
    };
  }
  
  if (error instanceof NetworkError) {
    return {
      type,
      message: error.message,
      originalError: error,
      statusCode: error.statusCode,
    };
  }
  
  if (error instanceof AppError) {
    return {
      type,
      message: error.message,
      originalError: error,
    };
  }
  
  // Handle Axios errors
  if (isAxiosError(error)) {
    const statusCode = error.response?.status;
    const message = getUserFriendlyMessage(type, statusCode, error);
    
    return {
      type,
      message,
      originalError: error,
      statusCode,
    };
  }
  
  // Handle generic errors
  if (error instanceof Error) {
    return {
      type,
      message: getUserFriendlyMessage(type),
      originalError: error,
    };
  }
  
  // Handle unknown error types
  return {
    type: ErrorType.UNKNOWN,
    message: 'An unexpected error occurred',
  };
}

/**
 * Maps error types and status codes to user-friendly messages
 */
export function getUserFriendlyMessage(
  type: ErrorType,
  statusCode?: number,
  error?: AxiosError
): string {
  // Check for specific API error messages
  if (error?.response?.data) {
    const data = error.response.data as any;
    if (data.message) {
      return data.message;
    }
    if (data.error) {
      return data.error;
    }
  }
  
  // Map by error type
  switch (type) {
    case ErrorType.AUTH:
      if (statusCode === 401) {
        return 'Authentication failed. Please check your credentials and try again.';
      }
      if (statusCode === 403) {
        return 'You do not have permission to perform this action.';
      }
      return 'Authentication error occurred. Please log in again.';
    
    case ErrorType.VALIDATION:
      if (statusCode === 400) {
        return 'Invalid data provided. Please check your input and try again.';
      }
      if (statusCode === 422) {
        return 'Validation failed. Please correct the errors and try again.';
      }
      return 'Validation error occurred. Please check your input.';
    
    case ErrorType.NETWORK:
      return 'Unable to connect to the server. Please check your internet connection and try again.';
    
    case ErrorType.SERVER:
      if (statusCode === 500) {
        return 'Server error occurred. Please try again later.';
      }
      if (statusCode === 503) {
        return 'Service temporarily unavailable. Please try again later.';
      }
      return 'Server error occurred. Please contact support if the problem persists.';
    
    case ErrorType.UNKNOWN:
    default:
      return 'An unexpected error occurred. Please try again.';
  }
}

/**
 * Logs error information for debugging purposes
 */
export function logError(error: unknown, context?: string): void {
  const errorInfo = transformError(error);
  
  console.error('[Error Handler]', {
    context,
    type: errorInfo.type,
    message: errorInfo.message,
    statusCode: errorInfo.statusCode,
    field: errorInfo.field,
    originalError: errorInfo.originalError,
  });
}

/**
 * Handles errors by transforming them and optionally logging
 */
export function handleError(error: unknown, context?: string): ErrorInfo {
  logError(error, context);
  return transformError(error);
}
