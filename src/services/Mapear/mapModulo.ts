
import { ModuloCompletoDTO } from "../../types/DTO/modulo/modulo";

// Método para formatar a resposta se necessário
export function formatarModulosParaFrontend(modulos: ModuloCompletoDTO[]) {
    return modulos.map(modulo => ({
        id: modulo.id,
        nome: modulo.nome,
        icone: modulo.icone,
        ordem: modulo.ordem,
        acoes: modulo.acoes.map(acao => ({
            id: acao.id,
            nome: acao.nome,
            ativo: acao.ativo
        }))
    }));
}

