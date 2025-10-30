import { Request, Response } from 'express';
import { QuestTypeService } from '../../services/solicitacao/common/list-type';

const service = new QuestTypeService();

export class QuestTypeController {
    async getAll(req: Request, res: Response) {
        console.log("Olá tudo perfeito")
        try {
            const {
                page,
                limit,
                search,
            } = req.query as Record<string, string>;

            const data = await service.findAll({
                page: Number(page) || 1,
                limit: Number(limit) || 25,
                search: search || undefined,
            });

            return res.json(data);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }


    async getById(req: Request, res: Response) {
        const id =req.params.id;
        const data = await service.findById(id);
        if (!data) return res.status(404).json({ message: 'Balcão não encontrado' });
        return res.json(data);
    }

}
