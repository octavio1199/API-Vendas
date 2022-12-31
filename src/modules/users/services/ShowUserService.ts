import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import User from '../typeorm/entities/User';
import { UsersRepository } from '../typeorm/repositories/UserRepository';

interface IRequest {
  id: string;
}

class ShowUserService {
  public async execute({ id }: IRequest): Promise<User> {
    const usersRepository = getCustomRepository(UsersRepository);

    const user = await usersRepository.findOne(id);

    if (!user) {
      throw new AppError('User not found.', 400);
    }

    return user;
  }
}

export default ShowUserService;
