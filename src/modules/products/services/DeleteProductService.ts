import RedisCache from '@shared/cache/RedisCache';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { IProductsRepository } from '../domain/repositories/IProductsRepository';

interface IRequest {
  id: string;
}

@injectable()
class DeleteProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute({ id }: IRequest): Promise<void> {
    const product = await this.productsRepository.findById(id);

    if (!product) {
      throw new AppError('Product not found.', 400);
    }

    const redisCache = new RedisCache();
    await redisCache.invalidate('api-vendas-PRODUCTS_LIST');

    await this.productsRepository.remove(product);
  }
}

export default DeleteProductService;
