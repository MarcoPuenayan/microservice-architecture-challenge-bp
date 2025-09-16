import { Product } from '../interfaces/product.interface';

export type CreateDtoProducto = Partial<Omit<Product, 'id'>>;
