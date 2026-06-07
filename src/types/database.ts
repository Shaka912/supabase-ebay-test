import type { ProductInput, ProductRecord } from './product';

/**
 * Supabase's schema constraint requires each column set to be a
 * `Record<string, unknown>`. TypeScript `interface` types aren't structurally
 * assignable to that (an interface is open to later declaration merging), so we
 * normalize our domain interfaces into closed object types with this identity
 * mapping before handing them to the client.
 */
type Columns<T> = { [K in keyof T]: T[K] };

/**
 * Describes our Supabase schema so the client is fully type-checked:
 * `supabase.from('products')` then knows its Row/Insert shapes, which removes
 * the need for `as` casts in the service layer.
 *
 * In a larger project this file is typically generated with the Supabase CLI
 * (`supabase gen types typescript`); here it is small enough to hand-write.
 */
export interface Database {
  public: {
    Tables: {
      products: {
        Row: Columns<ProductRecord>;
        Insert: Columns<ProductInput>;
        Update: Columns<Partial<ProductInput>>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
