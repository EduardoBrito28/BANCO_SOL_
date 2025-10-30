// controllers/AprovacaoController.ts
import { Request, Response } from 'express';
import { AprovacaoService } from '../../services/aprovacaoService/AprovacaoService';

export class AprovacaoController {
    private aprovacaoService: AprovacaoService;

    constructor() {
        this.aprovacaoService = new AprovacaoService();
    }

    iniciarFluxoAprovacao = async (req: Request, res: Response): Promise<void> => {
        try {
            const aprovacao = req.body;
            const aprovacaoId = req.params.aprovacaoId;

            await this.aprovacaoService.iniciarFluxoAprovacao(aprovacaoId, aprovacao);
            res.status(200).json({
                success: true,
                message: 'Fluxo de aprovação iniciado com sucesso'
            });
        } catch (error) {
            console.error('Erro ao iniciar fluxo de aprovação:', error);
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Erro ao iniciar fluxo de aprovação'
            });
        }
    }
    listarAprovacoes = async (req: Request, res: Response): Promise<void> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const filtros = {
                solicitacaoId: req.query.solicitacaoId as string,
                status: req.query.status as string,
                departamentoSigla: req.query.departamentoSigla as string,
                direcaoSigla: req.query.direcaoSigla as string,
                usuarioAprovadorId: req.query.usuarioAprovadorId as string,
            };

            const resultado = await this.aprovacaoService.listarUtilizadoresQueAprovaram(page, limit, filtros);

            res.status(200).json({
                success: true,
                data: resultado
            });
        } catch (error) {
            console.error('Erro ao listar aprovações:', error);
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Erro ao listar aprovações'
            });
        }
    }

    processarAprovacao = async (req: Request, res: Response): Promise<void> => {
        try {
            const { solicitacaoId, usuarioAprovadorId, aprovado, observacoes } = req.body;
            const resultado = await this.aprovacaoService.processarAprovacao(
                solicitacaoId,
                usuarioAprovadorId,
                aprovado,
                observacoes
            );

            res.status(200).json({
                success: true,
                message: `Aprovação ${aprovado ? 'concluída' : 'rejeitada'} com sucesso`,
                data: resultado
            });
        } catch (error) {
            console.error('Erro ao processar aprovação:', error);
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Erro ao processar aprovação'
            });
        }
    }

    /**
     * Obter status das aprovações
     */
    obterStatusAprovacao = async (req: Request, res: Response): Promise<void> => {
        try {
            const { solicitacaoId } = req.params;

            const resultado = await this.aprovacaoService.obterStatusAprovacao(solicitacaoId);

            res.status(200).json({
                success: true,
                data: resultado
            });
        } catch (error) {
            console.error('Erro ao obter status de aprovação:', error);
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Erro ao obter status de aprovação'
            });
        }
    }
}
