import { Request, Response } from "express";
import { PerfilPermissaoService } from "../../services/utilizador/permissao.service";

const service = new PerfilPermissaoService();

export class PerfilPermissaoController {
  async listar(req: Request, res: Response) {
    const permissoes = await service.listar();
    return res.json(permissoes);
  }

  async listarPorPerfil(req: Request, res: Response) {
    const { perfilId } = req.params;
    const permissoes = await service.listarPorPerfil(perfilId);
    return res.json(permissoes);
  }

  async criar(req: Request, res: Response) {
    const nova = await service.criar(req.body);
    return res.status(201).json(nova);
  }

  async remover(req: Request, res: Response) {
    const { id } = req.params;
    await service.remover(id);
    return res.status(204).send();
  }
}
