import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import { isAfter, addHours } from 'date-fns';
import { UsersRepository } from '../typeorm/repositories/UserRepository';
import UserTokensReponsitory from '../typeorm/repositories/UserTokensRepository';
import { hash } from 'bcryptjs';

interface IRequest {
  token: string;
  password: string;
}

class ResetPasswordService {
  async execute({ token, password }: IRequest): Promise<void> {
    const usersRepository = getCustomRepository(UsersRepository);
    const userTokensRepository = getCustomRepository(UserTokensReponsitory);

    const userToken = await userTokensRepository.findByToken(token);
    if (!userToken) {
      throw new AppError('User token does not exists.', 400);
    }

    const user = await usersRepository.findById(userToken.user_id);
    if (!user) {
      throw new AppError('User does not exists.', 400);
    }

    const compareDate = addHours(userToken.created_at, 2);
    if (isAfter(Date.now(), compareDate)) {
      throw new AppError('Token expired.', 403);
    }

    user.password = await hash(password, 8);
    await usersRepository.save(user);

    await userTokensRepository.delete(userToken.id);
  }
}

export default ResetPasswordService;
