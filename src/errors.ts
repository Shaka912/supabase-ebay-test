/**
 * Lightweight error types that carry an HTTP status code.
 *
 * Services throw these; the central error handler turns them into responses.
 * This keeps controllers free of try/catch-to-status plumbing.
 */
export class HttpError extends Error {
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(statusCode: number, message: string, details?: unknown) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.details = details;
  }
}

/** 409 — the resource already exists (e.g. a duplicate item_id). */
export class ConflictError extends HttpError {
  constructor(message: string) {
    super(409, message);
  }
}
