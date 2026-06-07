import { supabase } from '../lib/supabase';
import { ConflictError } from '../errors';
import type { ProductInput } from '../validation/product.schema';

/** A product row as stored in Supabase (input fields plus DB-generated ones). */
export interface ProductRecord extends ProductInput {
  id: string;
  created_at: string;
}

const TABLE = 'products';

/** Postgres error code for a unique-constraint violation. */
const UNIQUE_VIOLATION = '23505';

/**
 * Inserts a product and returns the stored row.
 * Throws ConflictError(409) if the item_id already exists.
 */
export async function createProduct(input: ProductInput): Promise<ProductRecord> {
  const { data, error } = await supabase
    .from(TABLE)
    .insert(input)
    .select()
    .single();

  if (error) {
    if (error.code === UNIQUE_VIOLATION) {
      throw new ConflictError(`A product with item_id "${input.item_id}" already exists`);
    }
    throw new Error(`Failed to save product: ${error.message}`);
  }

  return data as ProductRecord;
}

/** Returns all stored products, newest first. */
export async function listProducts(): Promise<ProductRecord[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch products: ${error.message}`);
  }

  return (data ?? []) as ProductRecord[];
}
