import { z } from 'zod';

/**
 * The shape of an incoming eBay product payload.
 *
 *   {
 *     "title":   "Apple iPhone 13 - 128GB",
 *     "price":   429.99,
 *     "item_id": "v1|1234567890|0"
 *   }
 */
export const productSchema = z.object({
  title: z.string().trim().min(1, 'title is required').max(500),
  price: z
    .number({ invalid_type_error: 'price must be a number' })
    .nonnegative('price must be zero or greater')
    .finite('price must be a finite number'),
  item_id: z.string().trim().min(1, 'item_id is required').max(100),
});

export type ProductInput = z.infer<typeof productSchema>;
