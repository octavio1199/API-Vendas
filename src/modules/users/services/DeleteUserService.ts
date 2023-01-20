import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { IFindUser } from '../domain/models/IFindUser';
import { IUsersRepository } from '../domain/repositories/IUsersRepository';

@injectable()
class DeleteUserService {
  constructor(
    @inject('UsersRepository') private usersRepository: IUsersRepository,
  ) {}

  public async execute({ id }: IFindUser): Promise<void> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new AppError('User not found.', 400);
    }

    await this.usersRepository.remove(user);
  }
}

export default DeleteUserService;
