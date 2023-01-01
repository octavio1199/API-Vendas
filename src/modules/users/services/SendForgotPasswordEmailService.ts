import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../typeorm/repositories/UserRepository';
import UserTokensReponsitory from '../typeorm/repositories/UserTokensRepository';

interface IRequest {
  email: string;
}

class SendForgotPasswordEmailService {
  async execute({ email }: IRequest): Promise<void> {
    const usersRepository = getCustomRepository(UsersRepository);
    const userTokensRepository = getCustomRepository(UserTokensReponsitory);

    const user = await usersRepository.findByEmail(email);
    if (!user) {
      throw new AppError('User does not exists.', 400);
    }

    const token = await userTokensRepository.generate(user.id);
    console.log(token);
  }
}

export default SendForgotPasswordEmailService;
