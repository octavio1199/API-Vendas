import { EntityRepository, Repository } from 'typeorm';
import Customer from '../entities/Customer';

@EntityRepository(Customer)
export class CustomersRepository extends Repository<Customer> {
  async findById(id: string): Promise<Customer | undefined> {
    const customer = this.findOne(id);
    return customer;
  }

  async findByName(name: string): Promise<Customer | undefined> {
    const customer = this.findOne({ where: { name } });
    return customer;
  }

  async findByEmail(email: string): Promise<Customer | undefined> {
    const customer = this.findOne({ where: { email } });
    return customer;
  }
}
