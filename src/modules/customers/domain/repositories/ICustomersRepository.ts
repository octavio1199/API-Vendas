import { ICustomer } from '../models/ICustomer';

export interface ICustomersRepository {
  findByName(name: string): Promise<ICustomer | undefined>;
  findByEmail(email: string): Promise<ICustomer | undefined>;
  create(data: ICustomer): Promise<ICustomer>;
  save(customer: ICustomer): Promise<ICustomer>;
}
