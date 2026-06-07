import { supabase } from '../src/lib/supabase';
import type { ProductInput } from '../src/types/product';

/**
 * Seeds the database with a handful of mock eBay products.
 *
 * Uses the app's own typed Supabase client and `upsert` (on the unique
 * `item_id`), so running it multiple times will not create duplicates.
 */
const SAMPLE_PRODUCTS: ProductInput[] = [
  { title: 'Apple iPhone 13 - 128GB - Blue', price: 429.99, item_id: 'v1|1234567890|0' },
  { title: 'Sony WH-1000XM5 Wireless Headphones', price: 329.0, item_id: 'v1|2233445566|0' },
  { title: 'Nintendo Switch OLED - White', price: 299.5, item_id: 'v1|9988776655|0' },
  { title: 'Logitech MX Master 3S Mouse', price: 99.99, item_id: 'v1|5566778899|0' },
];

async function seed(): Promise<void> {
  console.log(`→ Seeding ${SAMPLE_PRODUCTS.length} products...`);

  const { data, error } = await supabase
    .from('products')
    .upsert(SAMPLE_PRODUCTS, { onConflict: 'item_id' })
    .select();

  if (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }

  console.log(`✅ Seeded ${data?.length ?? 0} products:`);
  for (const product of data ?? []) {
    console.log(`   - ${product.item_id}  ${product.title}  $${product.price}`);
  }
}

seed().catch((err: unknown) => {
  console.error('❌ Seed failed:', err instanceof Error ? err.message : err);
  process.exit(1);
});
