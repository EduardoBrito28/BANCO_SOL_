import { Request, Response } from "express";
import { AcaoService } from "../../services/utilizador/acao.service";

const acaoService = new AcaoService();

export class AcaoController {
  async listar(req: Request, res: Response) {
    try {
      const acoes = await acaoService.listarTodos();
      return res.json(acoes);
    } catch (err: any) {
      return res.status(500).json({ erro: err.message });
    }
  }

  async listarAtivos(req: Request, res: Response) {
    try {
      const acoes = await acaoService.listarAtivos();
      return res.json(acoes);
    } catch (err: any) {
      return res.status(500).json({ erro: err.message });
    }
  }

  async obterPorId(req: Request, res: Response) {
    try {
      const acao = await acaoService.obterPorId(req.params.id);
      return res.json(acao);
    } catch (err: any) {
      return res.status(404).json({ erro: err.message });
    }
  }

  async criar(req: Request, res: Response) {
    try {
      const nova = await acaoService.criar(req.body);
      return res.status(201).json(nova);
    } catch (err: any) {
      return res.status(400).json({ erro: err.message });
    }
  }

  async atualizar(req: Request, res: Response) {
    try {
      const atualizada = await acaoService.atualizar(req.params.id, req.body);
      return res.json(atualizada);
    } catch (err: any) {
      return res.status(400).json({ erro: err.message });
    }
  }

  async remover(req: Request, res: Response) {
    try {
      const resultado = await acaoService.remover(req.params.id);
      return res.json(resultado);
    } catch (err: any) {
      return res.status(400).json({ erro: err.message });
    }
  }
}
