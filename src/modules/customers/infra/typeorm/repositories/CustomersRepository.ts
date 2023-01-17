import { ICreateCustomer } from '@modules/customers/domain/models/ICreateCustomer';
import { ICustomersRepository } from '@modules/customers/domain/repositories/ICustomersRepository';
import { getRepository, Repository } from 'typeorm';
import Customer from '../entities/Customer';

export class CustomersRepository implements ICustomersRepository {
  private ormRepository: Repository<Customer>;

  constructor() {
    this.ormRepository = getRepository(Customer);
  }

  async findById(id: string): Promise<Customer | undefined> {
    const customer = this.ormRepository.findOne(id);
    return customer;
  }

  async findByName(name: string): Promise<Customer | undefined> {
    const customer = this.ormRepository.findOne({ where: { name } });
    return customer;
  }

  async findByEmail(email: string): Promise<Customer | undefined> {
    const customer = this.ormRepository.findOne({ where: { email } });
    return customer;
  }

  async findAll(): Promise<Customer[]> {
    const customers = this.ormRepository.find();
    return customers;
  }

  async create({ name, email }: ICreateCustomer): Promise<Customer> {
    const customer = this.ormRepository.create({ name, email });

    await this.ormRepository.save(customer);
    return customer;
  }

  async save(customer: Customer): Promise<Customer> {
    await this.ormRepository.save(customer);
    return customer;
  }

  async remove(customer: Customer): Promise<void> {
    await this.ormRepository.remove(customer);
  }
}
