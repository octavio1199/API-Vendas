import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import Product from '../typeorm/entities/Product';
import { ProductsRepository } from '../typeorm/repositories/ProductRepository';

interface IRequest {
  name: string;
  price: number;
  quantity: number;
}

class CreateProductService {
  public async execute({ name, price, quantity }: IRequest): Promise<Product> {
    const productsRepository = getCustomRepository(ProductsRepository);
    const findProduct = await productsRepository.findByName(name);
    if (findProduct) {
      throw new AppError('There is already one product with this name');
    }
    const product = productsRepository.create({
      name,
      price,
      quantity,
    });
    await productsRepository.save(product);
    return product;
  }
}

export default CreateProductService;
