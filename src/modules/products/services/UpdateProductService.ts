import RedisCache from '@shared/cache/RedisCache';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { IProduct } from '../domain/models/IProduct';
import { IUpdateProduct } from '../domain/models/IUpdateProduct';
import { IProductsRepository } from '../domain/repositories/IProductsRepository';

@injectable()
class UpdateIProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}
  public async execute({
    id,
    name,
    price,
    quantity,
  }: IUpdateProduct): Promise<IProduct> {
    const product = await this.productsRepository.findById(id);
    if (!product) {
      throw new AppError('IProduct not found', 400);
    }

    if (name && name !== product.name) {
      const productExists = await this.productsRepository.findByName(name);
      if (productExists) {
        throw new AppError('There is already one product with this name');
      }
    }

    const redisCache = new RedisCache();
    await redisCache.invalidate('api-vendas-PRODUCTS_LIST');

    product.name = name;
    product.price = price;
    product.quantity = quantity;

    await this.productsRepository.save(product);

    return product;
  }
}

export default UpdateIProductService;
