import { tipoSolicitacaoRepository } from '../../../../repositories/request-type/request-typeReposiry';
import { TipoSolicitacao } from './../../../../models/TipoSolicitacao';
import { ILike } from 'typeorm';

export class QuestTypeService {
    async findAll(params: {
        page?: number;
        limit?: number;
        search?: string;
    }): Promise<{ data: TipoSolicitacao[]; total: number; page: number; limit: number, totalPages: number, hasNext:boolean, hasPrev: boolean}> {
        const {
            page = 1,
            limit = 25,
            search,
        } = params;


        const skip = (page - 1) * limit;
        // 🔍 Criar query builder para suportar OR
        const queryBuilder = tipoSolicitacaoRepository.createQueryBuilder('tipo');

        // Selecionar apenas os campos desejados
        queryBuilder.select([
            'tipo.id',
            'tipo.nome',
            'tipo.descricao'
        ]);

        // Aplicar filtro de busca se existir
        if (search) {
            queryBuilder.where('tipo.nome ILIKE :search', { search: `%${search}%` })
                .orWhere('tipo.descricao ILIKE :search', { search: `%${search}%` });
        }
        // Ordenação e paginação
        queryBuilder.orderBy('tipo.nome', 'ASC')
            .skip(skip)
            .take(limit);
        const [tipos, total] = await queryBuilder.getManyAndCount();
        return {
             data: tipos,
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1

        };
    }

    async findById(id: string): Promise<TipoSolicitacao | null> {
        const tipo = await tipoSolicitacaoRepository.findOne({
            where: { id },
            select: ['id', 'nome', 'descricao', 'createdAt']
        });

        if (!tipo) {
            throw new Error('Tipo de solicitação não encontrado');
        }

        return tipo;
    }

}
