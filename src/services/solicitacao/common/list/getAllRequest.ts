import { AppDataSource } from "../../../../loaders/database";
import { Solicitacao } from "../../../../models/Solicitacao";
import { CreatedByMapped, PaginatedResponse, SolicitacaoFiltros, SolicitacaoListItem } from "../../../../types/DTO/solicitacao";
import { CampoOrganizadorService } from "../organization-data";

import {
    Repository,
    FindManyOptions,
    ILike
} from "typeorm";


export class ListagemSolicitacaoServicos {
    private solicitacaoRepo: Repository<Solicitacao> = AppDataSource.getRepository(Solicitacao);


    // ✅ MÉTODO PRINCIPAL MELHORADO
    async listarSolicitacoes(
        page: number = 1,
        limit: number = 10,
        filtros?: SolicitacaoFiltros
    ): Promise<PaginatedResponse<SolicitacaoListItem>> {

        console.log(filtros);

        // Validar parâmetros
        this.validarParametros(page, limit);

        const skip = (page - 1) * limit;

        // ✅ OPÇÃO 1: Usando FindManyOptions (Mais simples e type-safe)
        const options = this.construirOpcoesConsulta(skip, limit, filtros);
        const [solicitacoes, total] = await this.solicitacaoRepo.findAndCount(options);

        const solicitacoesProcessadas = await this.processarSolicitacoes(solicitacoes);

        return {
            solicitacoes: solicitacoesProcessadas,
            pagination: this.calcularPaginacao(page, limit, total)
        };
    }
    private construirOpcoesConsulta(
        skip: number,
        limit: number,
        filtros?: SolicitacaoFiltros
    ): FindManyOptions<Solicitacao> {

        const options: FindManyOptions<Solicitacao> = {
            relations: {
                tipoSolicitacao: true,
                materiais: true,
                createdBy: { perfil: { departamento: { direcao: true } } },
                valores: { campoSolicitacao: true },
                aprovacoes: true,
                balcao: true
            },
            order: { createdAt: 'DESC' },
            skip,
            take: limit,
            where: {}
        };

        if (filtros) {
            const where: any = {};

            // 🔹 Tipo de solicitação
            if (filtros.tipoSolicitacaoId) {
                where.tipoSolicitacao = { id: filtros.tipoSolicitacaoId };
            }

            // 🔹 Filtro aninhado: Departamento e Direção
            if (filtros.departamentoSigla || filtros.direcaoSigla) {
                where.createdBy = {
                    perfil: {
                        departamento: {
                            ...(filtros.departamentoSigla && { sigla: filtros.departamentoSigla }),
                            ...(filtros.direcaoSigla && { direcao: { sigla: filtros.direcaoSigla } })
                        }
                    }
                };
            }

            // 🔹 Filtro por número do pedido
            if (filtros.numeroPedido) {
                where.numeroPedido = ILike(`%${filtros.numeroPedido}%`);
            }

            options.where = where;
        }

        return options;
    }




    // ✅ PROCESSAMENTO DOS DADOS
    private async processarSolicitacoes(solicitacoes: Solicitacao[]): Promise<SolicitacaoListItem[]> {
        return Promise.all(
            solicitacoes.map(async (solicitacao) => ({
                id: solicitacao.id,
                tipoSolicitacaoId: solicitacao?.tipoSolicitacaoId,
                nomeSolicitacao: solicitacao?.tipoSolicitacao.nome,
                numeroPedido: solicitacao.numeroPedido,
                tipoEnvio: solicitacao.tipoEnvio,
                observacoes: solicitacao.observacoes,
                isDirectorDestino: solicitacao.isDirectorDestino,
                 isAdminDestino: solicitacao.isAdminDestino,
                isDirecaoDestino: solicitacao.isDirecaoDestino,
                isConcluida: solicitacao.isConcluida,
                enviadoPor: await this.mapSolicitacao(solicitacao.createdBy),
                balcao: solicitacao.balcao ? await CampoOrganizadorService.formatarBalcao(solicitacao.balcao) : undefined,
                aprovacoes: solicitacao.aprovacoes?.map(aprovacao => ({
                    id: aprovacao.id,
                    status: aprovacao.status,
                    usuarioAprovadorId: aprovacao.usuarioAprovadorId,
                    observacoes: aprovacao.observacoes,
                    dataAprovacao: aprovacao.dataAprovacao
                })) || [],
                campos: CampoOrganizadorService.organizarCamposSolicitacao(solicitacao.valores || []),
                materiais: solicitacao.materiais?.map(material => ({
                    id: material.id,
                    descricao: material.descricao,
                    quantidade: material.quantidade,
                    pn: material.pn,
                    marca: material.marca,
                    modelo: material.modelo,
                    estado: material.estado,
                    proveniencia: material.proveniencia,
                    destino: material.destino
                })) || [],
                totalMateriais: solicitacao.materiais?.length || 0,
                createdAt: solicitacao.createdAt,
                updatedAt: solicitacao.updatedAt
            }))
        );
    }
    private mapSolicitacao(utelizador: any): CreatedByMapped {
        const perfil = utelizador?.perfil;
        const departamento = perfil?.departamento;
        const direcao = departamento?.direcao;
        const gabinete = departamento?.gabinete;

        return {
            nome: utelizador?.nome || '',
            papel: perfil.papel || '',
            restricao: perfil.restricao || '',
            email: utelizador?.email || '',
            telefone: utelizador?.telefone || '',
            departamento: departamento?.nome || 'N/A',
            sigla_departamento: departamento?.sigla || 'N/A',
            direcao: direcao?.nome || 'N/A',
            sigla_direcao: direcao?.sigla || 'N/A',
            ...(gabinete && {
                gabinete: gabinete.nome,
                sigla_gabinete: gabinete.sigla
            })
        }
    };
    // ✅ CÁLCULO DE PAGINAÇÃO
    private calcularPaginacao(page: number, limit: number, total: number) {
        const totalPages = Math.ceil(total / limit);

        return {
            page,
            limit,
            total,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1
        };
    }

    // ✅ VALIDAÇÃO DE PARÂMETROS
    private validarParametros(page: number, limit: number): void {
        if (page < 1) {
            throw new Error('Página deve ser maior que 0');
        }

        if (limit < 1 || limit > 100) {
            throw new Error('Limit deve estar entre 1 e 100');
        }
    }

    // ✅ MÉTODO PARA BUSCAR POR BALCÃO ESPECÍFICO

    /*
    async listarSolicitacoesPorBalcao(
        balcaoId: string,
        page: number = 1,
        limit: number = 10
    ): Promise<PaginatedResponse<SolicitacaoListItem>> {
        return await this.listarSolicitacoes(page, limit, { balcaoId });
    }
        */

}
