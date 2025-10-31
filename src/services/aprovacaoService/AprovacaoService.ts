
// services/AprovacaoService.ts
import { Brackets } from 'typeorm';
import { AppDataSource } from '../../loaders/database';
import { AprovacaoSolicitacao, StatusAprovacao } from '../../models/AprovacaoSolicitacao';
import { Solicitacao } from '../../models/Solicitacao';
import { Utilizador } from '../../models/user/Utilizador';
import { AprovacaoDTO } from '../../types/DTO/solicitacao/index';
import { SolicitacaoMapper } from '../Mapear/SolicitacaoMapper.ts';

export class AprovacaoService {
    private solicitacaoRepo = AppDataSource.getRepository(Solicitacao);
    private aprovacaoRepo = AppDataSource.getRepository(AprovacaoSolicitacao);

    /**
     * Iniciar fluxo de aprovação para uma solicitação
     */
    async iniciarFluxoAprovacao(aprovacaoId: string, aprovacaoData: AprovacaoDTO): Promise<void> {
        const solicitacao = await this.solicitacaoRepo.findOne({
            where: { id: aprovacaoData.solicitacaoId }
        });

        if (!solicitacao) {
            throw new Error('Solicitação não encontrada');
        }
        await this.aprovacaoRepo.update(
            { id: aprovacaoId }, // condição
            {
                status: aprovacaoData.status,
                observacoes: aprovacaoData.observacoes ?? ''
            }
        );
    }


    async listarUtilizadoresQueAprovaram(
        page = 1,
        limit = 10,
        filtros?: {
            solicitacaoId?: string;
            status?: string;
            usuarioAprovadorId?: string;
            dataInicio?: Date | string;
            dataFim?: Date | string;
            departamentoSigla?: string;
            direcaoSigla?: string;
        }
    ) {
        const skip = (page - 1) * limit;

        const queryBuilder = this.aprovacaoRepo
            .createQueryBuilder('aprovacao')
            .leftJoinAndSelect('aprovacao.createdBy', 'createdBy')
            .leftJoinAndSelect('createdBy.perfil', 'perfil')
            .leftJoinAndSelect('perfil.departamento', 'departamento')
            .leftJoinAndSelect('departamento.direcao', 'direcao')
            .orderBy('aprovacao.dataAprovacao', 'DESC')
            .skip(skip)
            .take(limit);

        // 🔹 Aplicar filtros dinamicamente
        if (filtros) {
            if (filtros.solicitacaoId) {
                queryBuilder.andWhere('aprovacao.solicitacaoId = :solicitacaoId', {
                    solicitacaoId: filtros.solicitacaoId,
                });
            }

            if (filtros.status) {
                queryBuilder.andWhere('aprovacao.status = :status', {
                    status: filtros.status,
                });
            }

            if (filtros.usuarioAprovadorId) {
                queryBuilder.andWhere('aprovacao.usuarioAprovadorId = :usuarioAprovadorId', {
                    usuarioAprovadorId: filtros.usuarioAprovadorId,
                });
            }

            if (filtros.dataInicio) {
                queryBuilder.andWhere('aprovacao.dataAprovacao >= :dataInicio', {
                    dataInicio: filtros.dataInicio,
                });
            }

            if (filtros.dataFim) {
                queryBuilder.andWhere('aprovacao.dataAprovacao <= :dataFim', {
                    dataFim: filtros.dataFim,
                });
            }
            console.log(filtros.departamentoSigla);
            // 🔹 Novo: filtro por departamento
            if (filtros.departamentoSigla) {

                queryBuilder.andWhere('departamento.sigla = :departamentoSigla', {
                    departamentoSigla: filtros.departamentoSigla,
                });
            }

            // 🔹 Novo: filtro por direção
            if (filtros.direcaoSigla) {
                queryBuilder.andWhere('direcao.sigla = :direcaoSigla', {
                    direcaoSigla: filtros.direcaoSigla,
                });
            }
        }

        const [registros, total] = await queryBuilder.getManyAndCount();

        const data = registros.map(a => ({
            ...a,
            createdBy: SolicitacaoMapper.mapCreatedBy(a.createdBy),
        }));

        return {
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1,
            },
        };
    }


    async processarAprovacao(
        solicitacaoId: string,
        usuarioAprovadorId: string,
        aprovado: boolean,
        observacoes?: string
    ): Promise<AprovacaoSolicitacao> {
        // 1️⃣ Verificar se a solicitação existe
        const solicitacao = await this.solicitacaoRepo.findOne({ where: { id: solicitacaoId } });
        if (!solicitacao) {
            throw new Error('Solicitação não encontrada.');
        }

        // 2️⃣ Criar uma nova aprovação
        const novaAprovacao = this.aprovacaoRepo.create({
            solicitacaoId,
            status: aprovado ? StatusAprovacao.APROVADO : StatusAprovacao.REJEITADO,
            createdBy: { id: usuarioAprovadorId } as Utilizador, // quem deu entrada
            observacoes: observacoes ?? '',
            dataAprovacao: new Date()
        });

        // 3️⃣ Salvar no banco
        const aprovacaoCriada = await this.aprovacaoRepo.save(novaAprovacao);

        // 4️⃣ Atualizar status final da solicitação (se necessário)

        return aprovacaoCriada;
    }




    async obterStatusAprovacao(solicitacaoId: string): Promise<any> {
        return true
    }

    async obterEstatisticas(): Promise<any> {
        const totalAprovacoes = await this.aprovacaoRepo.count();
        
        // Aprovações por status
        const porStatus = await this.aprovacaoRepo
            .createQueryBuilder('aprovacao')
            .select('aprovacao.status', 'status')
            .addSelect('COUNT(aprovacao.id)', 'quantidade')
            .groupBy('aprovacao.status')
            .getRawMany();

        // Solicitações com destino Admin
        const solicitacoesRecebidasAdmin = await this.solicitacaoRepo.count({
            where: { isAdminDestino: true }
        });

        // Solicitações aprovadas pela Admin (status completed ou admin_approved)
        const aprovacoesAdmin = await this.aprovacaoRepo.count({
            where: [
                { status: StatusAprovacao.APROVADO },
                { status: StatusAprovacao.ADM_APROVADO }
            ]
        });

        // Solicitações rejeitadas pela Admin
        const rejeicoesAdmin = await this.aprovacaoRepo.count({
            where: [
                { status: StatusAprovacao.REJEITADO },
                { status: StatusAprovacao.ADM_REJEITADO }
            ]
        });

        // Solicitações pendentes (com aprovação accept aguardando admin)
        const solicitacoesPendentesAdmin = await this.solicitacaoRepo
            .createQueryBuilder('solicitacao')
            .innerJoin('solicitacao.aprovacoes', 'aprovacao')
            .where('solicitacao.isAdminDestino = true')
            .andWhere('aprovacao.status = :status', { status: StatusAprovacao.ACEITE })
            .getCount();

        // Aprovações por departamento
        const porDepartamento = await this.aprovacaoRepo
            .createQueryBuilder('aprovacao')
            .leftJoin('aprovacao.createdBy', 'createdBy')
            .leftJoin('createdBy.perfil', 'perfil')
            .leftJoin('perfil.departamento', 'departamento')
            .select('COALESCE(departamento.sigla, departamento.nome, \'Sem Departamento\')', 'departamento')
            .addSelect('COUNT(aprovacao.id)', 'quantidade')
            .where('departamento.id IS NOT NULL')
            .groupBy('departamento.id, departamento.sigla, departamento.nome')
            .orderBy('COUNT(aprovacao.id)', 'DESC')
            .limit(5)
            .getRawMany();

        // Aprovações por direção
        const porDirecao = await this.aprovacaoRepo
            .createQueryBuilder('aprovacao')
            .leftJoin('aprovacao.createdBy', 'createdBy')
            .leftJoin('createdBy.perfil', 'perfil')
            .leftJoin('perfil.departamento', 'departamento')
            .leftJoin('departamento.direcao', 'direcao')
            .select('COALESCE(direcao.sigla, direcao.nome, \'Sem Direção\')', 'direcao')
            .addSelect('COUNT(aprovacao.id)', 'quantidade')
            .where('direcao.id IS NOT NULL')
            .groupBy('direcao.id, direcao.sigla, direcao.nome')
            .orderBy('COUNT(aprovacao.id)', 'DESC')
            .limit(5)
            .getRawMany();

        return {
            totalAprovacoes,
            solicitacoesRecebidasAdmin,
            aprovacoesAdmin,
            rejeicoesAdmin,
            solicitacoesPendentesAdmin,
            porStatus: porStatus.map(item => ({
                status: item.status,
                quantidade: parseInt(item.quantidade)
            })),
            porDepartamento: porDepartamento.map(item => ({
                departamento: item.departamento,
                quantidade: parseInt(item.quantidade)
            })),
            porDirecao: porDirecao.map(item => ({
                direcao: item.direcao,
                quantidade: parseInt(item.quantidade)
            }))
        };
    }
}
