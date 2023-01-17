import { CustomersRepository } from '@modules/customers/infra/typeorm/repositories/CustomersRepository';
import { ProductsRepository } from '@modules/products/infra/typeorm/repositories/ProductRepository';
import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import Order from '../infra/typeorm/entities/Order';
import { OrdersRepository } from '../infra/typeorm/repositories/OrderRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

export default class CreateOrderService {
  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const ordersRepository = getCustomRepository(OrdersRepository);
    const customersRepository = getCustomRepository(CustomersRepository);
    const productsRepository = getCustomRepository(ProductsRepository);

    const customer = await customersRepository.findById(customer_id);
    if (!customer) {
      throw new AppError('Could not find any customer with the given id');
    }

    const existentProducts = await productsRepository.findAllByIds(products);
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

    const order = await ordersRepository.createOrder({
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
        quantity: productFound && productFound.quantity - product.quantity,
      };
    });

    await productsRepository.save(productsWithUpdatedQuantity);

    return order;
  }
}
