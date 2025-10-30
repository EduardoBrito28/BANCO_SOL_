import { Request, Response } from "express";
import { GabineteService } from "../../services/utilizador/gabinete.service";


const gabineteService = new GabineteService();

export class GabineteController {
    async listar(req: Request, res: Response) {
        try {
            const gabinetes = await gabineteService.listar();

            return res.json({
                success: true,
                data: gabinetes,
                message: 'Gabinetes listados com sucesso',
            });
        } catch (error) {
            console.error('Erro ao listar gabinetes:', error);
            return res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Erro interno do servidor',
            });
        }
    }

    async buscar(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const gabinete = await gabineteService.buscarPorId(id);

            return res.json({
                success: true,
                data: gabinete,
                message: 'Gabinete encontrado com sucesso',
            });
        } catch (error) {
            console.error('Erro ao buscar gabinete:', error);
            return res.status(error instanceof Error && error.message === 'Gabinete não encontrado' ? 404 : 500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Erro interno do servidor',
            });
        }
    }
}
