// src/middlewares/checkPermission.middleware.ts
import { Request, Response, NextFunction } from 'express';
import UserService from '../../services/users';


type PermissaoInput =
  | string // Ex: 'UTILIZADORES'
  | { modulo: string; acoes: string[] }
  | [string, string[]];


const userService = new UserService();

/**
 * Middleware de verificação de permissões.
 *
 * @param modulo - Exemplo: "utilizadores", "relatorios"
 * @param acao - Exemplo: "criar", "editar", "ver"
 */
export const checkPermission = (...permissoesRequeridas: PermissaoInput[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ success: false, error: 'Não autenticado' });
      }

      const permissoes = await userService.obterPermissoesUtilizador(user.id);
      const isAdmin = permissoes?.resumo?.isAdmin ?? false;

      if (isAdmin) return next();

      // Achatar todas as permissões do usuário (ex: UTILIZADORES.VIEW_ALL)
      const permissoesPlanas = permissoes.permissoes.flatMap(p =>
        p.acoes.map(acao => `${p.modulo.toUpperCase()}.${acao.toUpperCase()}`)
      );

      // Verifica se o usuário tem pelo menos uma das permissões requeridas
      const hasPermission = permissoesRequeridas.some((reqPerm) => {
        if (typeof reqPerm === 'string') {
          // Caso simples: apenas módulo, sem ação específica
          return permissoesPlanas.some(p => p.startsWith(reqPerm.toUpperCase() + '.'));
        }

        if (Array.isArray(reqPerm)) {
          const [modulo, acoes] = reqPerm;
          return acoes.some(acao =>
            permissoesPlanas.includes(`${modulo.toUpperCase()}.${acao.toUpperCase()}`)
          );
        }

        if (typeof reqPerm === 'object') {
          return reqPerm.acoes.some(acao =>
            permissoesPlanas.includes(`${reqPerm.modulo.toUpperCase()}.${acao.toUpperCase()}`)
          );
        }

        return false;
      });

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          error: `Sem permissão necessária para esta rota`,
        });
      }

      next();
    } catch (error) {
      console.error('Erro ao verificar permissões:', error);
      return res.status(500).json({
        success: false,
        error: 'Erro interno ao verificar permissões',
      });
    }
  };
};
