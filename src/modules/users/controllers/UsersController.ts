import { Request, Response } from 'express';
import CreateUserService from '../services/CreateUserService';
import DeleteUserService from '../services/DeleteUserService';
import ListUserService from '../services/ListUserService';
import ShowUserService from '../services/ShowUserService';
import UpdateUserService from '../services/UpdateUserService';

export default class UsersController {
  async index(req: Request, response: Response): Promise<Response> {
    const listUsers = new ListUserService();

    const users = await listUsers.execute();
    return response.json(users).status(200);
  }

  async show(req: Request, response: Response): Promise<Response> {
    const { id } = req.params;

    const showUsers = new ShowUserService();

    const user = await showUsers.execute({ id });

    return response.json(user).status(200);
  }

  async create(req: Request, response: Response): Promise<Response> {
    const { name, email, password } = req.body;

    const createUser = new CreateUserService();

    const user = await createUser.execute({
      name,
      email,
      password,
    });

    return response.json(user).status(201);
  }

  async update(req: Request, response: Response): Promise<Response> {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const updateUser = new UpdateUserService();

    const user = await updateUser.execute({
      id,
      name,
      email,
      password,
    });

    return response.json(user).status(200);
  }

  async delete(req: Request, response: Response): Promise<Response> {
    const { id } = req.params;

    const deleteUser = new DeleteUserService();

    await deleteUser.execute({ id });

    return response.status(204).send();
  }
}
