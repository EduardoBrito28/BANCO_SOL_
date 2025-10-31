import { Request, Response } from "express";
import { DirecaoService } from "../../services/utilizador/direcao.service";

const service = new DirecaoService();

export class DirecaoController {
  async listar(req: Request, res: Response) {
    try {
      const direcoes = await service.listar();
      
      return res.json({
        success: true,
        data: direcoes,
        message: 'Direções listadas com sucesso',
      });
    } catch (error) {
      console.error('Erro ao listar direções:', error);
      return res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno do servidor',
      });
    }
  }

  async buscar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const direcao = await service.buscarPorId(id);
      
      return res.json({
        success: true,
        data: direcao,
        message: 'Direção encontrada com sucesso',
      });
    } catch (error) {
      console.error('Erro ao buscar direção:', error);
      return res.status(error instanceof Error && error.message === 'Direção não encontrada' ? 404 : 500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno do servidor',
      });
    }
  }
}

