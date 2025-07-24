export class ApiError extends Error {
  constructor(
    message: string,
    public readonly details?: string,
    public readonly code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class DatabaseError extends Error {
  constructor(message: string, public readonly details?: string) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class AuthError extends Error {
  constructor(message: string, public readonly details?: string) {
    super(message);
    this.name = 'AuthError';
  }
}