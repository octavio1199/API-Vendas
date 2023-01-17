import { getCustomRepository } from 'typeorm';
import Customer from '../infra/typeorm/entities/Customer';
import { CustomersRepository } from '../infra/typeorm/repositories/CustomersRepository';

class ListCustomerService {
  public async execute(): Promise<Customer[]> {
    const customersRepository = getCustomRepository(CustomersRepository);

    const customers = customersRepository.find({
      take: 4,
      skip: 0,
    });

    return customers;
  }
}

export default ListCustomerService;
