import type { Request, Response, NextFunction } from 'express';
import { HttpError } from '../errors';
import type { ApiError } from '../types/http';

/** 404 handler for any route that didn't match. */
export function notFound(req: Request, res: Response<ApiError>): void {
  res.status(404).json({
    error: { message: `Route ${req.method} ${req.originalUrl} not found` },
  });
}

/**
 * Central error handler. Express identifies it by its four arguments, so
 * `next` must stay in the signature even though it is unused.
 */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response<ApiError>,
  _next: NextFunction,
): void {
  // Body-parser throws this for malformed JSON.
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({ error: { message: 'Invalid JSON payload' } });
    return;
  }

  if (err instanceof HttpError) {
    res.status(err.statusCode).json({
      error: {
        message: err.message,
        ...(err.details ? { details: err.details } : {}),
      },
    });
    return;
  }

  // Anything unexpected: log it server-side, hide internals from the client.
  console.error('Unexpected error:', err);
  res.status(500).json({ error: { message: 'Internal server error' } });
}
