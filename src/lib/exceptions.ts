
export class AuthError extends Error {
  constructor(message = 'Authentication error') {
    super(message);
    this.name = 'AuthError';
  }
}
