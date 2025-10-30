import { AppDataSource } from "../../../../loaders/database";
import { Solicitacao } from "../../../../models/Solicitacao";
import { SolicitacaoDTO, SolicitacaoListItem } from "../../../../types/DTO/solicitacao";
import { CampoOrganizadorService } from "../organization-data";

export class GETAllMaterialMyIDGet {
    private solicitacaoRepo = AppDataSource.getRepository(Solicitacao);


    public async obterSolicitacaoPorId(id: string): Promise<SolicitacaoListItem> {
        const solicitacao = await this.solicitacaoRepo.findOne({
            where: { id },
            relations: [
                'tipoSolicitacao',
                'valores',
                'valores.campoSolicitacao',
                'materiais'
            ]
        });

        if (!solicitacao) {
            throw new Error('Solicitação não encontrada');
        }

        const dto: SolicitacaoListItem = {
            id: solicitacao.id,
                tipoSolicitacaoId: solicitacao?.tipoSolicitacaoId,
                 nomeSolicitacao: solicitacao?.tipoSolicitacao.nome,
                numeroPedido: solicitacao.numeroPedido,
                observacoes: solicitacao.observacoes,
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
            }

        return dto;
    }


}
