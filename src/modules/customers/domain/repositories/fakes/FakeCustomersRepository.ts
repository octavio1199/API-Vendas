import { ICreateCustomer } from '@modules/customers/domain/models/ICreateCustomer';
import { ICustomersRepository } from '@modules/customers/domain/repositories/ICustomersRepository';
import Customer from '@modules/customers/infra/typeorm/entities/Customer';
import { randomUUID } from 'crypto';

export class FakeCustomersRepository implements ICustomersRepository {
  private repository: Customer[] = [];

  async create({ name, email }: ICreateCustomer): Promise<Customer> {
    const customer = new Customer();
    customer.id = randomUUID();
    customer.name = name;
    customer.email = email;
    this.repository.push(customer);
    return customer;
  }

  async findById(id: string): Promise<Customer | undefined> {
    const customer = this.repository.find(customer => customer.id === id);
    return customer;
  }

  async findByName(name: string): Promise<Customer | undefined> {
    const customer = this.repository.find(customer => customer.name === name);
    return customer;
  }

  async findByEmail(email: string): Promise<Customer | undefined> {
    const customer = this.repository.find(customer => customer.email === email);
    return customer;
  }

  async findAll(): Promise<Customer[]> {
    return this.repository;
  }

  async save(customer: Customer): Promise<Customer> {
    const index = this.repository.findIndex(
      findCustomer => findCustomer.id === customer.id,
    );
    this.repository[index] = customer;
    return customer;
  }

  async remove(customer: Customer): Promise<void> {
    const index = this.repository.findIndex(
      findCustomer => findCustomer.id === customer.id,
    );
    this.repository.splice(index, 1);
  }
}
