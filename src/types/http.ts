import type { Request, Response, NextFunction } from 'express';

/** A single field-level validation problem. */
export interface FieldError {
  field: string;
  message: string;
}

/** Error envelope returned for every non-2xx response. */
export interface ApiError {
  error: {
    message: string;
    details?: FieldError[];
  };
}

/** Envelope wrapping a single resource. */
export interface ApiResource<T> {
  data: T;
}

/** Envelope wrapping a collection of resources, plus its length. */
export interface ApiCollection<T> extends ApiResource<T[]> {
  count: number;
}

/** Health-check response. */
export interface HealthResponse {
  status: 'ok';
}

/**
 * An async Express handler that sends its own response and forwards any error
 * to `next()`. `ResBody` constrains the JSON the handler is allowed to send,
 * so `res.json(...)` is type-checked against the endpoint's contract.
 */
export type AsyncHandler<ResBody> = (
  req: Request,
  res: Response<ResBody>,
  next: NextFunction,
) => Promise<void>;
