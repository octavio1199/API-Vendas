import { ICustomersRepository } from '@modules/customers/domain/repositories/ICustomersRepository';
import { IProductsRepository } from '@modules/products/domain/repositories/IProductsRepository';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { IOrder } from '../domain/models/IOrder';
import { IRequestCreateOrder } from '../domain/models/IRequestCreateOrder';
import { IOrdersRepository } from '../domain/repositories/IOrdersRepository';

@injectable()
export default class CreateOrderService {
  constructor(
    @inject('OrdersRepository') private ordersRepository: IOrdersRepository,
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}
  public async execute({
    customer_id,
    products,
  }: IRequestCreateOrder): Promise<IOrder> {
    const customer = await this.customersRepository.findById(customer_id);
    if (!customer) {
      throw new AppError('Could not find any customer with the given id');
    }

    const existentProducts = await this.productsRepository.findAllByIds(
      products,
    );
    if (!existentProducts.length) {
      throw new AppError('Could not find any products with the given ids');
    }

    const existentProductsIds = existentProducts.map(product => product.id);

    const inexistentProducts = products.filter(
      product => !existentProductsIds.includes(product.id),
    );

    if (inexistentProducts.length) {
      throw new AppError(
        `Could not find product(s) with id(s): ${inexistentProducts
          .map(product => product.id)
          .join(', ')}`,
      );
    }

    const productsWithUnavailableQuantity = products.filter(product => {
      const productFound = existentProducts.find(p => p.id === product.id);
      return productFound && productFound.quantity < product.quantity;
    });

    if (productsWithUnavailableQuantity.length) {
      throw new AppError(
        `${productsWithUnavailableQuantity.map(product => {
          return `Unavailable Quantity Error: The quantity ${product.quantity} is not available for ${product.id}`;
        })}`,
      );
    }

    const serializedProducts = products.map(product => ({
      product_id: product.id,
      quantity: product.quantity,
      price: existentProducts.filter(p => p.id === product.id)[0].price,
    }));

    const order = await this.ordersRepository.create({
      customer: customer,
      products: serializedProducts,
    });

    const { order_products } = order;

    const productsWithUpdatedQuantity = order_products.map(product => {
      const productFound = existentProducts.find(
        p => p.id === product.product_id,
      );
      return {
        id: product.product_id,
        quantity: Number(
          productFound && productFound.quantity - product.quantity,
        ),
      };
    });

    await this.productsRepository.updateStock(productsWithUpdatedQuantity);

    return order;
  }
}
