import { Request, Response } from "express";
import { ModuloService } from "../../services/utilizador/modulo.service";

const moduloService = new ModuloService();

export class ModuloController {
  async listar(req: Request, res: Response) {
    try {
      const modulos = await moduloService.listarTodos();
      return res.json(modulos);
    } catch (error: any) {
      return res.status(500).json({ erro: error.message });
    }
  }

  async listarAtivos(req: Request, res: Response) {
    try {
      const modulos = await moduloService.listarAtivos();
      return res.json(modulos);
    } catch (error: any) {
      return res.status(500).json({ erro: error.message });
    }
  }

  async obterPorId(req: Request, res: Response) {
    try {
      const modulo = await moduloService.obterPorId(req.params.id);
      return res.json(modulo);
    } catch (error: any) {
      return res.status(404).json({ erro: error.message });
    }
  }

  async criar(req: Request, res: Response) {
    try {
      const novoModulo = await moduloService.criar(req.body);
      return res.status(201).json(novoModulo);
    } catch (error: any) {
      return res.status(400).json({ erro: error.message });
    }
  }

  async atualizar(req: Request, res: Response) {
    try {
      const atualizado = await moduloService.atualizar(req.params.id, req.body);
      return res.json(atualizado);
    } catch (error: any) {
      return res.status(400).json({ erro: error.message });
    }
  }

  async remover(req: Request, res: Response) {
    try {
      const resultado = await moduloService.remover(req.params.id);
      return res.json(resultado);
    } catch (error: any) {
      return res.status(400).json({ erro: error.message });
    }
  }
}
