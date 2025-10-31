import { Request, Response } from "express";
import { DepartamentoService } from "../../services/utilizador/departamento.service";

const service = new DepartamentoService();

export class DepartamentoController {
  async listar(req: Request, res: Response) {
    try {
      const direcaoId = req.query.direcao as string | undefined;
      const departamentos = direcaoId 
        ? await service.listarPorDirecao(direcaoId)
        : await service.listar();
      
      return res.json({
        success: true,
        data: departamentos,
        message: 'Departamentos listados com sucesso',
      });
    } catch (error) {
      console.error('Erro ao listar departamentos:', error);
      return res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno do servidor',
      });
    }
  }

  async buscar(req: Request, res: Response) {
    const { id } = req.params;

    const departamento = await service.buscarPorId(id);
    if (!departamento) return res.status(404).json({ message: "Departamento não encontrado." });
    return res.json(departamento);
  }

  async criar(req: Request, res: Response) {
    try {
      const novo = await service.criar(req.body);
      return res.status(201).json(novo);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async atualizar(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const atualizado = await service.atualizar(id, req.body);
      return res.json(atualizado);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async remover(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await service.remover(id);
      return res.status(204).send();
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
}
