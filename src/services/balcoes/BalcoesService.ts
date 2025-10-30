
import { Balcao } from "../../models/Balcao";
import { BalcoesRepository } from "../../repositories/bolcoes/BalcoesRepository";
import { ILike } from 'typeorm';

export class BalcoesService {
    async findAll(params: {
        page?: number;
        limit?: number;
        search?: string;
        provincia?: string;
        municipio?: string;
        bairro?: string;
    }): Promise<{ data: Balcao[]; total: number; page: number; limit: number }> {
        const {
            page = 1,
            limit = 25,
            search,
            provincia,
            municipio,
            bairro,
        } = params;

        const skip = (page - 1) * limit;

        const where: any = {};

        // 🔍 Filtro de busca
        if (search) {
            where.OR = [
                { nome: ILike(`%${search}%`) },
                { code_referencia: ILike(`%${search}%`) },
                { provincia: ILike(`%${search}%`) },
                { municipio: ILike(`%${search}%`) },
                { bairro: ILike(`%${search}%`) },
            ];
        }

        // 🔎 Filtros diretos
        if (provincia) where.provincia = ILike(`%${provincia}%`);
        if (municipio) where.municipio = ILike(`%${municipio}%`);
        if (bairro) where.bairro = ILike(`%${bairro}%`);

        const [data, total] = await BalcoesRepository.findAndCount({
            where,
            order: { createdAt: 'DESC' },
            skip,
            take: limit,
        });

        return { data, total, page, limit };
    }

    async findById(id: string): Promise<Balcao | null> {
        return await BalcoesRepository.findOneBy({ id });
    }

    async findByCodeReferencia(code_referencia: string): Promise<Balcao | null> {
        return await BalcoesRepository.findOne({
            where: { code_referencia },
        });
    }

    async create(data: Partial<Balcao>): Promise<Balcao> {
        const exists = await BalcoesRepository.findOne({
            where: { code_referencia: data.code_referencia },
        });
        if (exists) {
            throw new Error('Já existe um balcão com este código de referência.');
        }

        const balcao = BalcoesRepository.create(data);
        return await BalcoesRepository.save(balcao);
    }

    async update(id: string, data: Partial<Balcao>): Promise<Balcao> {
        const balcao = await BalcoesRepository.findOneBy({ id });
        if (!balcao) {
            throw new Error('Balcão não encontrado.');
        }

        Object.assign(balcao, data);
        return await BalcoesRepository.save(balcao);
    }

    async delete(id: string): Promise<void> {
        const balcao = await BalcoesRepository.findOneBy({ id });
        if (!balcao) {
            throw new Error('Balcão não encontrado.');
        }

        await BalcoesRepository.remove(balcao);
    }
}
