import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';

// Mock the service layer so these tests never touch Supabase, the network,
// or real credentials. We're testing routing, validation, and error mapping.
vi.mock('../src/services/product.service', () => ({
  createProduct: vi.fn(),
  listProducts: vi.fn(),
}));

import { app } from '../src/app';
import { createProduct, listProducts } from '../src/services/product.service';
import { ConflictError } from '../src/errors';

const mockedCreate = vi.mocked(createProduct);
const mockedList = vi.mocked(listProducts);

describe('POST /api/products', () => {
  it('saves a valid product and returns 201', async () => {
    const input = { title: 'Apple iPhone 13', price: 429.99, item_id: 'v1|123|0' };
    mockedCreate.mockResolvedValue({
      id: '11111111-1111-1111-1111-111111111111',
      created_at: '2026-06-07T12:00:00.000Z',
      ...input,
    });

    const res = await request(app).post('/api/products').send(input);

    expect(res.status).toBe(201);
    expect(res.body.data).toMatchObject(input);
    expect(mockedCreate).toHaveBeenCalledWith(input);
  });

  it('rejects missing fields with 400 and lists the offending fields', async () => {
    const res = await request(app).post('/api/products').send({ title: 'Only a title' });

    expect(res.status).toBe(400);
    expect(res.body.error.message).toBe('Validation failed');
    const fields = res.body.error.details.map((d: { field: string }) => d.field);
    expect(fields).toContain('price');
    expect(fields).toContain('item_id');
    expect(mockedCreate).not.toHaveBeenCalled();
  });

  it('rejects a negative price with 400', async () => {
    const res = await request(app)
      .post('/api/products')
      .send({ title: 'Bad', price: -5, item_id: 'x' });

    expect(res.status).toBe(400);
    expect(mockedCreate).not.toHaveBeenCalled();
  });

  it('rejects a non-numeric price with 400', async () => {
    const res = await request(app)
      .post('/api/products')
      .send({ title: 'Bad', price: '10', item_id: 'x' });

    expect(res.status).toBe(400);
    expect(mockedCreate).not.toHaveBeenCalled();
  });

  it('returns 409 when the item_id already exists', async () => {
    mockedCreate.mockRejectedValue(new ConflictError('duplicate item_id'));

    const res = await request(app)
      .post('/api/products')
      .send({ title: 'Dup', price: 1, item_id: 'dup' });

    expect(res.status).toBe(409);
    expect(res.body.error.message).toContain('duplicate');
  });

  it('returns 400 for malformed JSON', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Content-Type', 'application/json')
      .send('{ not valid json');

    expect(res.status).toBe(400);
  });
});

describe('GET /api/products', () => {
  it('returns the list of products with a count', async () => {
    mockedList.mockResolvedValue([
      {
        id: '1',
        title: 'A',
        price: 1,
        item_id: 'a',
        created_at: '2026-06-07T12:00:00.000Z',
      },
    ]);

    const res = await request(app).get('/api/products');

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(1);
    expect(res.body.data).toHaveLength(1);
  });
});

describe('GET /health', () => {
  it('reports ok', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
