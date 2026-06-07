import type { Request, Response, NextFunction } from 'express';
import { productSchema } from '../validation/product.schema';
import { createProduct, listProducts } from '../services/product.service';
import { HttpError } from '../errors';

/**
 * POST /api/products
 * Validates the body, saves the product, and returns the stored row (201).
 */
export async function postProduct(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsed = productSchema.safeParse(req.body);

    if (!parsed.success) {
      const details = parsed.error.issues.map((issue) => ({
        field: issue.path.join('.') || '(body)',
        message: issue.message,
      }));
      throw new HttpError(400, 'Validation failed', details);
    }

    const product = await createProduct(parsed.data);
    res.status(201).json({ data: product });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/products
 * Returns every saved product (handy for verifying the data / screenshots).
 */
export async function getProducts(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const products = await listProducts();
    res.status(200).json({ data: products, count: products.length });
  } catch (err) {
    next(err);
  }
}
