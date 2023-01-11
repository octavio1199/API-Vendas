import { Request, Response } from 'express';
import CreateUserService from '../services/CreateUserService';
import DeleteUserService from '../services/DeleteUserService';
import ListUserService from '../services/ListUserService';
import { instanceToInstance } from 'class-transformer';

export default class UsersController {
  async index(req: Request, response: Response): Promise<Response> {
    const listUsers = new ListUserService();

    const users = await listUsers.execute();
    return response.json(instanceToInstance(users)).status(200);
  }

  async create(req: Request, response: Response): Promise<Response> {
    const { name, email, password } = req.body;

    const createUser = new CreateUserService();

    const user = await createUser.execute({
      name,
      email,
      password,
    });

    return response.json(instanceToInstance(user)).status(201);
  }

  async delete(req: Request, response: Response): Promise<Response> {
    const { id } = req.params;

    const deleteUser = new DeleteUserService();

    await deleteUser.execute({ id });

    return response.status(204).send();
  }
}
