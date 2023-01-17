import { inject, injectable } from 'tsyringe';
import { ICustomersRepository } from '../domain/repositories/ICustomersRepository';
import Customer from '../infra/typeorm/entities/Customer';

@injectable()
class ListCustomerService {
  constructor(
    @inject('CustomersRepository')
    private readonly customersRepository: ICustomersRepository,
  ) {}

  public async execute(): Promise<Customer[]> {
    const customers = this.customersRepository.findAll();

    return customers;
  }
}

export default ListCustomerService;
