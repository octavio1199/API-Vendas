import { ICreateCustomer } from '../models/ICreateCustomer';
import { ICustomer } from '../models/ICustomer';

export interface ICustomersRepository {
  findById(id: string): Promise<ICustomer | undefined>;
  findByName(name: string): Promise<ICustomer | undefined>;
  findByEmail(email: string): Promise<ICustomer | undefined>;
  findAll(): Promise<ICustomer[]>;
  create(data: ICreateCustomer): Promise<ICustomer>;
  save(customer: ICustomer): Promise<ICustomer>;
  remove(customer: ICustomer): Promise<void>;
}
