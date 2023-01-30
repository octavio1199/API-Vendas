import AppError from '@shared/errors/AppError';
import { FakeCustomersRepository } from '../domain/repositories/fakes/FakeCustomersRepository';
import CreateCustomerService from './CreateCustomerService';

let fakeCustomersRepository: FakeCustomersRepository;
let createCustomer: CreateCustomerService;

describe('CreateCustomer', () => {
  beforeEach(() => {
    fakeCustomersRepository = new FakeCustomersRepository();
    createCustomer = new CreateCustomerService(fakeCustomersRepository);
  });

  it('should be able to create a new customer', async () => {
    const customer = await createCustomer.execute({
      name: 'John Doe',
      email: 'john@email.com',
    });
    expect(customer).toHaveProperty('id');
  });

  it('should not be able to create a customer with an email already in use', async () => {
    await createCustomer.execute({
      name: 'John Doe',
      email: 'john@email.com',
    });

    expect(
      createCustomer.execute({
        name: 'John Doe',
        email: 'john@email.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
