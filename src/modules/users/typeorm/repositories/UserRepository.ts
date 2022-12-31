import { EntityRepository, Repository } from 'typeorm';
import User from '../entities/User';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async findById(id: string): Promise<User | undefined> {
    const user = this.findOne(id);
    return user;
  }

  async findByName(name: string): Promise<User | undefined> {
    const user = this.findOne({ where: { name } });
    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = this.findOne({ where: { email } });
    return user;
  }
}
