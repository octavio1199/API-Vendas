import { EntityRepository, In, Repository } from 'typeorm';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

@EntityRepository(Product)
export class ProductsRepository extends Repository<Product> {
  async findByName(name: string): Promise<Product | undefined> {
    const product = this.findOne({ where: { name } });
    return product;
  }

  async findAllByIds(products: IFindProducts[]): Promise<Product[]> {
    const productIds = products.map(product => product.id);
    const existentProducts = await this.find({
      where: {
        id: In(productIds),
      },
    });
    return existentProducts;
  }
}