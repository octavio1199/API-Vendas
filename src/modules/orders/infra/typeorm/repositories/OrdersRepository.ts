import { getRepository, Repository } from 'typeorm';
import Order from '../entities/Order';
import { IOrdersRepository } from '@modules/orders/domain/repositories/IOrdersRepository';
import { ICreateOrder } from '@modules/orders/domain/models/ICreateOrder';

export class OrdersRepository implements IOrdersRepository {
  private ormRepository: Repository<Order>;

  constructor() {
    this.ormRepository = getRepository(Order);
  }

  async findById(id: string): Promise<Order | undefined> {
    const order = this.ormRepository.findOne(id, {
      relations: ['customer', 'order_products'],
    });
    return order;
  }

  async create({ customer, products }: ICreateOrder): Promise<Order> {
    const order = this.ormRepository.create({
      customer,
      order_products: products,
    });
    await this.ormRepository.save(order);
    return order;
  }
}
