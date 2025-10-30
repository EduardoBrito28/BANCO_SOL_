import { Request, Response } from "express";
import { PerfilService } from "../../services/utilizador/perfil.service";

const service = new PerfilService();

export class PerfilController {
  async listar(req: Request, res: Response) {
    const perfis = await service.listar();
    return res.json(perfis);
  }

  async buscar(req: Request, res: Response) {
    const { id } = req.params;
    const perfil = await service.buscarPorId(id);
    if (!perfil) return res.status(404).json({ message: "Perfil não encontrado" });
    return res.json(perfil);
  }

  async criar(req: Request, res: Response) {
    const novo = await service.criar(req.body);
    return res.status(201).json(novo);
  }

  async atualizar(req: Request, res: Response) {
    const { id } = req.params;
    const atualizado = await service.atualizar(id, req.body);
    return res.json(atualizado);
  }

  async remover(req: Request, res: Response) {
    const { id } = req.params;
    await service.remover(id);
    return res.status(204).send();
  }
}
