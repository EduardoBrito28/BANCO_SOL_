import { Router } from 'express';

import { checkPermission } from '../../middlewares/auth.middleware';
import UserController from '../../../controllers/userController.controller';
import { authenticate } from '../../middlewares/src/middlewares/auth.middleware';

const userController = new UserController();
const router = Router();

export default (app: Router) => {
    app.use('/user', authenticate, router); // prefixo geral

    // 👥 ROTAS DE UTILIZADORES
    router.get('/',
        userController.listarUtilizadores
    );

    router.get('/estatisticas',
        checkPermission('utilizadores', 'view_all'),
        userController.obterEstatisticas
    );

    router.get('/me',
        checkPermission('utilizadores', 'view_direcao'),
        userController.obterMeuPerfil
    );

    router.get('/find-dep/:departamento',
        checkPermission('utilizadores', 'view_direcao'),
        userController.obterPorDepartamento
    );

    router.get('/find/:direcao',
        checkPermission('utilizadores', 'view_direcao'),
        userController.obterPorDirecao
    );

    router.get('/:id',
        checkPermission('utilizadores', 'view_all'),
        userController.obterUtilizador
    );

    router.get('/:id/permissoes',
        checkPermission('utilizadores', 'view_all'),
        userController.obterPermissoes
    );

    router.post('/',
        userController.criarUtilizador
    );

    router.put('/:id',
        checkPermission('utilizadores', 'edit'),
        userController.atualizarUtilizador
    );

    router.patch('/:id/senha',
        userController.atualizarSenha
    );

    router.patch('/:id/estado',
        checkPermission('utilizadores', 'toggle_active'),
        userController.atualizarEstado
    );

    router.delete('/:id',
        checkPermission('utilizadores', 'delete'),
        userController.eliminarUtilizador
    );

}
