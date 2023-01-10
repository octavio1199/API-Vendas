import { Router } from 'express';
import OrdersController from '../controllers/OrdersController';
import { celebrate, Joi, Segments } from 'celebrate';

const ordersRouter = Router();
const ordersController = new OrdersController();

ordersRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  ordersController.show,
);

ordersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      customer_id: Joi.string().uuid().required(),
      products: Joi.array()
        .items({
          id: Joi.string().uuid().required(),
          price: Joi.number().required(),
          quantity: Joi.number().required(),
        })
        .required(),
    },
  }),
  ordersController.create,
);

export default ordersRouter;
