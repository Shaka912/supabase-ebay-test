import express, { type Express, type Response } from 'express';
import { productRouter } from './routes/product.routes';
import { errorHandler, notFound } from './middleware/errorHandler';
import type { HealthResponse } from './types/http';

/**
 * Builds the Express application.
 *
 * Kept separate from server startup (index.ts) so tests can import the app
 * with supertest without opening a real port.
 */
export function createApp(): Express {
  const app = express();

  app.use(express.json());

  app.get('/health', (_req, res: Response<HealthResponse>) => {
    res.status(200).json({ status: 'ok' });
  });

  app.use('/api/products', productRouter);

  // 404 + centralized error handling (must be registered last).
  app.use(notFound);
  app.use(errorHandler);

  return app;
}

export const app = createApp();
