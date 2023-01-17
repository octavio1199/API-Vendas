import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { ICreateCustomer } from '../domain/models/ICreateCustomer';
import { ICustomersRepository } from '../domain/repositories/ICustomersRepository';
import Customer from '../infra/typeorm/entities/Customer';

@injectable()
class CreateCustomerService {
  constructor(
    @inject('CustomersRepository')
    private readonly customersRepository: ICustomersRepository,
  ) {}

  public async execute({ name, email }: ICreateCustomer): Promise<Customer> {
    const customerExists = await this.customersRepository.findByEmail(email);

    if (customerExists) {
      throw new AppError('There is already one customer with this email');
    }

    const customer = await this.customersRepository.create({
      name,
      email,
    });

    return customer;
  }
}

export default CreateCustomerService;
