/**
 * Custom error classes for the application
 */

/**
 * Base error class for application errors
 */
export class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Error thrown when authentication fails
 */
export class AuthError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message);
  }
}

/**
 * Error thrown when validation fails
 */
export class ValidationError extends AppError {
  public field?: string;

  constructor(message: string, field?: string) {
    super(message);
    this.field = field;
  }
}

/**
 * Error thrown when network requests fail
 */
export class NetworkError extends AppError {
  public statusCode?: number;

  constructor(message: string = 'Network request failed', statusCode?: number) {
    super(message);
    this.statusCode = statusCode;
  }
}
