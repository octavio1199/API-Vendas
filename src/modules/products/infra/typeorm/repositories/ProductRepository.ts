import { ICreateProduct } from '@modules/products/domain/models/ICreateProduct';
import { IFindProduct } from '@modules/products/domain/models/IFindProduct';
import { IProduct } from '@modules/products/domain/models/IProduct';
import { IUpdateStockProduct } from '@modules/products/domain/models/IUpdateStockProduct';
import { IProductsRepository } from '@modules/products/domain/repositories/IProductsRepository';
import { getRepository, In, Repository } from 'typeorm';
import Product from '../entities/Product';

export class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  async findByName(name: string): Promise<Product | undefined> {
    const product = this.ormRepository.findOne({ where: { name } });
    return product;
  }

  async findAll(): Promise<Product[]> {
    const products = this.ormRepository.find();
    return products;
  }

  async findAllByIds(products: IFindProduct[]): Promise<Product[]> {
    const productIds = products.map(product => product.id);
    const existentProducts = await this.ormRepository.find({
      where: {
        id: In(productIds),
      },
    });
    return existentProducts;
  }

  async findById(id: string): Promise<Product | undefined> {
    const product = this.ormRepository.findOne(id);
    return product;
  }

  async create({ name, price, quantity }: ICreateProduct): Promise<Product> {
    const product = this.ormRepository.create({ name, price, quantity });

    await this.ormRepository.save(product);

    return product;
  }

  public async save(product: Product): Promise<Product> {
    await this.ormRepository.save(product);

    return product;
  }

  async remove(product: Product): Promise<void> {
    await this.ormRepository.remove(product);
  }

  async updateStock(products: IUpdateStockProduct[]): Promise<void> {
    await this.ormRepository.save(products);
  }
}
