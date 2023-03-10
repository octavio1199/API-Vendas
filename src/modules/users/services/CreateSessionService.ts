import AppError from '@shared/errors/AppError';
import { compare } from 'bcryptjs';
import { Secret, sign } from 'jsonwebtoken';
import authConfig from '@config/auth';
import { inject, injectable } from 'tsyringe';
import { IUsersRepository } from '../domain/repositories/IUsersRepository';
import { IUserAuthenticated } from '../domain/models/IUserAuthenticated';
import { ICreateSession } from '../domain/models/ICreateSession';

@injectable()
export default class CreateSessionService {
  constructor(
    @inject('UsersRepository') private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    email,
    password,
  }: ICreateSession): Promise<IUserAuthenticated> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Invalid email/password combination.', 401);
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new AppError('Invalid email/password combination.', 401);
    }

    const token = sign({}, authConfig.jwt.secret as Secret, {
      subject: user.id,
      expiresIn: authConfig.jwt.expiresIn,
    });

    return { user, token };
  }
}
