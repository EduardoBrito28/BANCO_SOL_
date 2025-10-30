
import { Router } from 'express';
import auth from './utilizador/auth';
import users from './utilizador';
import solictacaoRoute from './solicitacao/solicitacao.routes';
import balcoesRoute from './bolcoes/balcoes.routes';
import aprovacaoRoute from './aprovacao/aprovacao.route';
import requestTypeRoute from './quest-type/request-type.routes';
import perfil from './utilizador/perfil/perfil';
import perfilPermissao from './utilizador/perfil/perfil-permissao';
import departamento from './utilizador/departamento/departamento';
import modulo from './utilizador/modulo';
import acao from './utilizador/acao';
import gabinete from './utilizador/gabinete/gabinete';
import uploadRoutes from './solicitacao/upload.routes';
const router = Router();


auth(router);
users(router);
perfil(router)
perfilPermissao(router)
departamento(router);
modulo(router);
acao(router)
solictacaoRoute(router)
uploadRoutes(router);
balcoesRoute(router)
aprovacaoRoute(router)
requestTypeRoute(router)
gabinete(router)


export default router;
