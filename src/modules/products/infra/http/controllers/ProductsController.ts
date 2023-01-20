import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateProductService from '../../../services/CreateProductService';
import DeleteProductService from '../../../services/DeleteProductService';
import ListProductService from '../../../services/ListProductService';
import ShowProductService from '../../../services/ShowProductService';
import UpdateProductService from '../../../services/UpdateProductService';

export default class ProductsController {
  async index(req: Request, response: Response): Promise<Response> {
    const listProducts = container.resolve(ListProductService);

    const products = await listProducts.execute();
    return response.json(products).status(200);
  }

  async show(req: Request, response: Response): Promise<Response> {
    const { id } = req.params;

    const showProducts = container.resolve(ShowProductService);

    const product = await showProducts.execute({ id });

    return response.json(product).status(200);
  }

  async create(req: Request, response: Response): Promise<Response> {
    const { name, price, quantity } = req.body;

    const createProduct = container.resolve(CreateProductService);

    const product = await createProduct.execute({
      name,
      price,
      quantity,
    });

    return response.json(product).status(201);
  }

  async update(req: Request, response: Response): Promise<Response> {
    const { id } = req.params;
    const { name, price, quantity } = req.body;

    const updateProduct = container.resolve(UpdateProductService);

    const product = await updateProduct.execute({
      id,
      name,
      price,
      quantity,
    });

    return response.json(product).status(200);
  }

  async delete(req: Request, response: Response): Promise<Response> {
    const { id } = req.params;

    const deleteProduct = container.resolve(DeleteProductService);

    await deleteProduct.execute({ id });

    return response.status(204).send();
  }
}
