import { z } from 'zod';
import type { ProductInput } from '../types/product';

/**
 * Validates an incoming eBay product payload.
 *
 * `satisfies z.ZodType<ProductInput>` binds the schema to the ProductInput
 * interface at compile time: if the two ever drift apart, this file stops
 * compiling. The concrete ZodObject type is preserved for `safeParse`.
 */
export const productSchema = z.object({
  title: z.string().trim().min(1, 'title is required').max(500),
  price: z
    .number({ invalid_type_error: 'price must be a number' })
    .nonnegative('price must be zero or greater')
    .finite('price must be a finite number'),
  item_id: z.string().trim().min(1, 'item_id is required').max(100),
}) satisfies z.ZodType<ProductInput>;
