import { Request, Response } from 'express';
import UpdateProfileService from '../../../services/UpdateProfileService';
import ShowProfileService from '../../../services/ShowProfileService';
import { instanceToInstance } from 'class-transformer';

export default class ProfileControler {
  async show(req: Request, response: Response): Promise<Response> {
    const user_id = req.user.id;

    const showProfile = new ShowProfileService();

    const user = await showProfile.execute({ user_id });

    return response.json(instanceToInstance(user));
  }

  async update(req: Request, response: Response): Promise<Response> {
    const user_id = req.user.id;
    const { name, email, password, old_password } = req.body;

    const updateProfile = new UpdateProfileService();

    const user = await updateProfile.execute({
      user_id,
      name,
      email,
      password,
      old_password,
    });

    return response.json(instanceToInstance(user));
  }
}
