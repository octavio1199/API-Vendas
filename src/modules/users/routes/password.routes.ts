import { Router } from 'express';
import ForgotPasswordsController from '../controllers/ForgotPasswordsController';
import { celebrate, Joi, Segments } from 'celebrate';

const passwordRouter = Router();
const forgotPasswordsController = new ForgotPasswordsController();

passwordRouter.post(
  '/forgot',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
    },
  }),
  forgotPasswordsController.create,
);

passwordRouter.post(
  '/reset',
  celebrate({
    [Segments.BODY]: {
      password: Joi.string().required(),
    },
  }),
);

export default passwordRouter;
