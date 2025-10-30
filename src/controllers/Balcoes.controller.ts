import { Request, Response } from 'express';
import { BalcoesService } from '../services/balcoes/BalcoesService';

const service = new BalcoesService();

export class BalcoesController {
    async getAll(req: Request, res: Response) {
        console.log("Olá tudo perfeito")
        try {
            const {
                page,
                limit,
                search,
                provincia,
                municipio,
                bairro,
            } = req.query as Record<string, string>;

            const data = await service.findAll({
                page: Number(page) || 1,
                limit: Number(limit) || 25,
                search: search || undefined,
                provincia: provincia || undefined,
                municipio: municipio || undefined,
                bairro: bairro || undefined,
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
    async getByCodeReferencia(req: Request, res: Response) {
        const { code_referencia } = req.params;

        const data = await service.findByCodeReferencia(code_referencia);

        if (!data)
            return res.status(404).json({ message: 'Balcão não encontrado.' });

        return res.json(data);
    }

    async create(req: Request, res: Response) {
        try {
            const data = await service.create(req.body);
            return res.status(201).json(data);
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }

    async update(req: Request, res: Response) {
        const id =req.params.id;
        try {
            const data = await service.update(id, req.body);
            return res.json(data);
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        const id = req.params.id;
        try {
            await service.delete(id);
            return res.status(204).send();
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }
}
