import { Router } from 'express';
import { postProduct, getProducts } from '../controllers/product.controller';

export const productRouter = Router();

productRouter.post('/', postProduct);
productRouter.get('/', getProducts);
