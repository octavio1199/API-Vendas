import { Request, Response } from 'express';
import CreateSessionService from '../../../services/CreateSessionService';
import { instanceToInstance } from 'class-transformer';
import { container } from 'tsyringe';

export default class SessionsController {
  async create(req: Request, response: Response): Promise<Response> {
    const { email, password } = req.body;
    const createSessionService = container.resolve(CreateSessionService);

    const { user, token } = await createSessionService.execute({
      email,
      password,
    });

    return response.json({ user: instanceToInstance(user), token }).status(200);
  }
}
