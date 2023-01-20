import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateOrderService from '../../../services/CreateOrderService';
import ShowOrderService from '../../../services/ShowOrderService';

export default class OrdersController {
  async show(req: Request, response: Response): Promise<Response> {
    const { id } = req.params;

    const showOrder = container.resolve(ShowOrderService);

    const order = await showOrder.execute({ id });

    return response.json(order).status(200);
  }

  async create(req: Request, response: Response): Promise<Response> {
    const { customer_id, products } = req.body;

    const createOrder = container.resolve(CreateOrderService);

    const order = await createOrder.execute({
      customer_id,
      products,
    });

    return response.json(order).status(201);
  }
}
