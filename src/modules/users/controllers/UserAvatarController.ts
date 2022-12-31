import { Request, Response } from 'express';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';

export default class UserAvatarController {
  async update(req: Request, res: Response): Promise<Response> {
    const updateUserAvatar = new UpdateUserAvatarService();

    const user = updateUserAvatar.execute({
      userId: req.user.id,
      avatarFileName: req.file?.filename as string,
    });

    return res.json(user).status(200);
  }
}
