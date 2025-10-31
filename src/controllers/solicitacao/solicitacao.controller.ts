
import { Request, Response } from 'express';
import { SolicitacaoService } from '../../services/solicitacao/solicitacaoService';
import { CriarSolicitacaoDTO, SolicitacaoFiltros } from '../../types/DTO/solicitacao';
import { GETAllMaterialMyIDGet } from '../../services/solicitacao/common/list/getByMaterial';
import { ListagemSolicitacaoServicos } from '../../services/solicitacao/common/list/getAllRequest';
import { FluxoProcessoSolicitacaoService } from '../../services/solicitacao/common/fluxoProcessoSolicitacao';



const solicitacaoService = new SolicitacaoService();
const SolicitacaoMaterial = new GETAllMaterialMyIDGet();
const solicitacaoAll = new ListagemSolicitacaoServicos();
const fluxoProcessoSolicitacaoService = new FluxoProcessoSolicitacaoService();

export class SolicitacaoController {
    async obterEstatisticas(req: Request, res: Response) {
        try {
            const estatisticas = await solicitacaoService.obterEstatisticas();
            res.json({
                success: true,
                data: estatisticas,
                message: 'Estatísticas de solicitações obtidas com sucesso'
            });
        } catch (error) {
            console.error('Erro ao obter estatísticas de solicitações:', error);
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Erro interno do servidor'
            });
        }
    }
    // ✅ CRIAÇÃO
    async criarSolicitacao(req: Request, res: Response) {
        try {
            const dto: CriarSolicitacaoDTO = req.body;
            const resultado = await solicitacaoService.criarSolicitacao(dto);
            res.status(201).json({
                success: true,
                data: resultado,
                message: 'Solicitação criada com sucesso'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error instanceof Error ? error.message : String(error)
            });
        }
    }

    async listarSolicitacoesFiltros(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const filtros: SolicitacaoFiltros = {
                tipoSolicitacaoId: req.query.tipoSolicitacaoId as string,
                status: req.query.status as string,
                nomeSolicitacao: req.query.nomeSolicitacao as string,
                direcaoSigla: req.query.direcaoSigla as string,
                numeroPedido: req.query.numeroPedido as string,
                departamentoSigla: req.query.departamentoSigla as string
            };


            // Limpar filtros vazios
            Object.keys(filtros).forEach(key => {
                const filterKey = key as keyof SolicitacaoFiltros;
                if (filtros[filterKey] === undefined || filtros[filterKey] === '') {
                    delete filtros[filterKey];
                }
            });

            const resultado = await solicitacaoAll.listarSolicitacoes(page, limit, filtros);

            res.json({
                success: true,
                data: resultado.solicitacoes,
                pagination: resultado.pagination
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : String(error)
            });
        }
    }

    // ✅ OBTER POR ID
    async obterSolicitacao(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const resultado = await SolicitacaoMaterial.obterSolicitacaoPorId(id);
            res.json({
                success: true,
                data: resultado
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                error: error instanceof Error ? error.message : String(error)
            });
        }
    }

    // ✅ OBTER POR TIPO
    async obterSolicitacoesPorTipo(req: Request, res: Response) {
        try {
            const tipoId = req.params.tipoId;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const resultado = await solicitacaoService.obterSolicitacoesPorTipo(tipoId, page, limit);
            res.json({
                success: true,
                data: resultado.solicitacoes,
                pagination: resultado.pagination
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error instanceof Error ? error.message : String(error)
            });
        }
    }
    async enviarParaDirector(req: Request, res: Response) {
        const { id } = req.params;
        const result = await fluxoProcessoSolicitacaoService.enviarParaDirector(id);
        return res.json(result);
    }

    async enviarParaAdministrador(req: Request, res: Response) {
        const { id } = req.params;
        const result = await fluxoProcessoSolicitacaoService.enviarParaAdministrador(id);
        return res.json(result);
    }

    async enviarParaDirecao(req: Request, res: Response) {
        const { id } = req.params;
        const result = await fluxoProcessoSolicitacaoService.enviarParaDirecao(id);
        return res.json(result);
    }

    async concluir(req: Request, res: Response) {
        const { id } = req.params;
        const result = await fluxoProcessoSolicitacaoService.concluirSolicitacao(id);
        return res.json(result);
    }
    atualizarSolicitacao = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const updateData = req.body;

            if (!id) {
                res.status(400).json({
                    success: false,
                    message: 'ID da solicitação é obrigatório'
                });
                return;
            }

            const resultado = await solicitacaoService.atualizarSolicitacao(id, updateData);

            res.status(200).json({
                success: true,
                message: 'Solicitação atualizada com sucesso',
                data: resultado
            });
        } catch (error) {
            console.error('Erro ao atualizar solicitação:', error);
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Erro ao atualizar solicitação'
            });
        }
    }


    // ✅ ADICIONAR MATERIAL
    async adicionarMaterial(req: Request, res: Response) {
        try {
            const solicitacaoId = req.params.id;
            const materialDto = req.body;
            const resultado = await solicitacaoService.adicionarMaterial(solicitacaoId, materialDto);
            res.status(201).json({
                success: true,
                data: resultado,
                message: 'Material adicionado com sucesso'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error instanceof Error ? error.message : String(error)
            });
        }
    }

    // ✅ REMOVER MATERIAL
    async removerMaterial(req: Request, res: Response) {
        try {
            const { id, materialId } = req.params;
            await solicitacaoService.removerMaterial(id, materialId);
            res.json({
                success: true,
                message: 'Material removido com sucesso'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error instanceof Error ? error.message : String(error)
            });
        }
    }
    // ✅ EXCLUIR SOLICITAÇÃO
    async excluirSolicitacao(req: Request, res: Response) {
        try {
            const id = req.params.id;
            await solicitacaoService.excluirSolicitacao(id);
            res.json({
                success: true,
                message: 'Solicitação excluída com sucesso'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error instanceof Error ? error.message : String(error)
            });
        }
    }
}
