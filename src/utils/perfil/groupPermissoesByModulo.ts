import { PerfilPermissao } from "../../models/user/PerfilPermissao";

export function groupPermissoesByModulo(permissoes: PerfilPermissao[]) {
  const grouped = new Map<
    string,
    {
      modulo: { id: string; nome: string; sigla: string };
      acoes: string[];
    }
  >();

  for (const perm of permissoes) {
    if (!perm.modulo || !perm.acao) continue;

    const moduloId = perm.modulo.id;
    const acaoNome = perm.acao.nome; // Ajusta conforme o campo real (ex: `perm.acao.nome` ou `perm.acao.sigla`)

    if (!grouped.has(moduloId)) {
      grouped.set(moduloId, {
        modulo: {
          id: perm.modulo.id,
          nome: perm.modulo.nome,
          sigla: perm.modulo.sigla,
        },
        acoes: [],
      });
    }

    const moduloGroup = grouped.get(moduloId)!;
    if (!moduloGroup.acoes.includes(acaoNome)) {
      moduloGroup.acoes.push(acaoNome);
    }
  }

  // Retorna como array
  return Array.from(grouped.values());
}
