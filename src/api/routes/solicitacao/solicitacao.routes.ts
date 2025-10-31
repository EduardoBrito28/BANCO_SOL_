import { Router } from 'express';
import { SolicitacaoController } from '../../../controllers/solicitacao/solicitacao.controller';
const router = Router();
const solicitacaoController = new SolicitacaoController();

export default (app: Router) => {
    app.use('/request', router); // prefixo geral

    router.put('/:id', solicitacaoController.atualizarSolicitacao);
    router.post('/', solicitacaoController.criarSolicitacao);
    router.get('/', solicitacaoController.listarSolicitacoesFiltros);
    router.get('/estatisticas', solicitacaoController.obterEstatisticas);
    router.get('/:id', solicitacaoController.obterSolicitacao);
    router.delete('/:id', solicitacaoController.excluirSolicitacao);

    //Fluxo de envio das solicitaçẽos
    router.patch("/:id/enviar/director", solicitacaoController.enviarParaDirector);
    router.patch("/:id/enviar/administrador", solicitacaoController.enviarParaAdministrador);
    router.patch("/:id/enviar/direcao", solicitacaoController.enviarParaDirecao);
    router.patch("/:id/concluir", solicitacaoController.concluir);

    // ROTAS POR TIPO
    router.get('/type/:tipoId', solicitacaoController.obterSolicitacoesPorTipo);
    // ROTAS DE MATERIAIS
    router.post('/:id/materiais', solicitacaoController.adicionarMaterial);
    router.delete('/:id/materiais/:materialId', solicitacaoController.removerMaterial);
}
