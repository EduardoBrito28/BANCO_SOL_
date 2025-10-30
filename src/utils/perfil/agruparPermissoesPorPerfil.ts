import { PerfilPermissao } from "../../models/user/PerfilPermissao";

/**
 * Agrupa as permissões por perfil e módulo,
 * retornando uma estrutura com ações em array de siglas.
 *
 * @param permissoes Lista de PerfilPermissao (com relations carregadas)
 * @returns Array de perfis com módulos e ações agrupadas
 */
export function agruparPermissoesPorPerfil(permissoes: PerfilPermissao[]) {
  const mapaPermissoes = new Map<string, any>();

  for (const perm of permissoes) {
    const perfilId = perm.perfil.id;
    const moduloId = perm.modulo.id;

    // inicializa o perfil se não existir
    if (!mapaPermissoes.has(perfilId)) {
      mapaPermissoes.set(perfilId, {
        id: perm.perfil.id,
        papel: perm.perfil.papel,
        descricao: perm.perfil.descricao,
        restricao: perm.perfil.restricao,
        permissoes: [],
      });
    }

    const perfil = mapaPermissoes.get(perfilId);

    // verifica se já existe o módulo
    let moduloPerm = perfil.permissoes.find(
      (p: any) => p.modulo.id === moduloId
    );

    if (!moduloPerm) {
      moduloPerm = {
        modulo: {
          id: perm.modulo.id,
          nome: perm.modulo.nome,
          sigla: perm.modulo.sigla,
        },
        acoes: [],
      };
      perfil.permissoes.push(moduloPerm);
    }

    // 🔸 Filtra ações: só adiciona se pertencer ao módulo ou for global
    const acaoModulo = perm.acao?.modulo?.id ?? null;
    if (acaoModulo === null || acaoModulo === moduloId) {
      if (!moduloPerm.acoes.includes(perm.acao.sigla)) {
        moduloPerm.acoes.push(perm.acao.sigla);
      }
    }
  }

  return Array.from(mapaPermissoes.values());
}
