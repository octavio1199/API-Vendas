import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateCustomerService from '../../../services/CreateCustomerService';
import DeleteCustomerService from '../../../services/DeleteCustomerService';
import ListCustomerService from '../../../services/ListCustomerService';
import ShowCustomerService from '../../../services/ShowCustomerService';
import UpdateCustomerService from '../../../services/UpdateCustomerService';

export default class CustomersController {
  async index(req: Request, response: Response): Promise<Response> {
    const listCustomers = container.resolve(ListCustomerService);

    const customers = await listCustomers.execute();
    return response.json(customers).status(200);
  }

  async show(req: Request, response: Response): Promise<Response> {
    const { id } = req.params;

    const showCustomers = container.resolve(ShowCustomerService);

    const customer = await showCustomers.execute({ id });

    return response.json(customer).status(200);
  }

  async create(req: Request, response: Response): Promise<Response> {
    const { name, email } = req.body;

    const createCustomer = container.resolve(CreateCustomerService);

    const customer = await createCustomer.execute({
      name,
      email,
    });

    return response.json(customer).status(201);
  }

  async update(req: Request, response: Response): Promise<Response> {
    const { id } = req.params;
    const { name, email } = req.body;

    const updateCustomer = container.resolve(UpdateCustomerService);

    const customer = await updateCustomer.execute({
      id,
      name,
      email,
    });

    return response.json(customer).status(200);
  }

  async delete(req: Request, response: Response): Promise<Response> {
    const { id } = req.params;

    const deleteCustomer = container.resolve(DeleteCustomerService);

    await deleteCustomer.execute({ id });

    return response.status(204).send();
  }
}
