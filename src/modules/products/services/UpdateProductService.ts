import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import Product from '../typeorm/entities/Product';
import { ProductsRepository } from '../typeorm/repositories/ProductRepository';

interface UpdateProductDTO {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

class UpdateProductService {
  public async execute({
    id,
    name,
    price,
    quantity,
  }: UpdateProductDTO): Promise<Product> {
    const productsRepository = getCustomRepository(ProductsRepository);

    const product = await productsRepository.findOne(id);
    if (!product) {
      throw new AppError('Product not found', 400);
    }

    if (name && name !== product.name) {
      const productExists = await productsRepository.findByName(name);
      if (productExists) {
        throw new AppError('There is already one product with this name');
      }
    }

    product.name = name;
    product.price = price;
    product.quantity = quantity;

    await productsRepository.save(product);

    return product;
  }
}

export default UpdateProductService;
