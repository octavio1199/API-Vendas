import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { getCustomRepository } from 'typeorm';
import { ICustomersRepository } from '../domain/repositories/ICustomersRepository';
import Customer from '../infra/typeorm/entities/Customer';
import { CustomersRepository } from '../infra/typeorm/repositories/CustomersRepository';

interface IRequest {
  id: string;
  name: string;
  email: string;
}

@injectable()
class UpdateCustomerService {
  constructor(
    @inject('CustomersRepository')
    private readonly customersRepository: ICustomersRepository,
  ) {}

  public async execute({ id, name, email }: IRequest): Promise<Customer> {
    const customer = await this.customersRepository.findById(id);
    if (!customer) {
      throw new AppError('Customer not found', 400);
    }

    const customerExists = await this.customersRepository.findByEmail(email);

    if (customerExists && customerExists.id !== customer.id) {
      if (customerExists) {
        throw new AppError('There is already one customer with this email');
      }
    }

    customer.name = name;
    customer.email = email;

    await this.customersRepository.save(customer);

    return customer;
  }
}

export default UpdateCustomerService;
