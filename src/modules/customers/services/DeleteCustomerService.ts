import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { getCustomRepository } from 'typeorm';
import { ICustomersRepository } from '../domain/repositories/ICustomersRepository';
import { CustomersRepository } from '../infra/typeorm/repositories/CustomersRepository';

interface IRequest {
  id: string;
}

@injectable()
class DeleteCustomerService {
  constructor(
    @inject('CustomersRepository')
    private readonly customersRepository: ICustomersRepository,
  ) {}

  public async execute({ id }: IRequest): Promise<void> {
    const customer = await this.customersRepository.findById(id);

    if (!customer) {
      throw new AppError('Customer not found.', 400);
    }

    await this.customersRepository.remove(customer);
  }
}

export default DeleteCustomerService;
