// services/CampoOrganizadorService.ts

import { Balcao } from "../../../../models/Balcao";
import { ValorSolicitacao } from "../../../../models/ValorSolicitacao";
import { SolicitacaoListItem } from "../../../../types/DTO/solicitacao";

export class CampoOrganizadorService {
    /**
     * Organiza os campos de uma solicitação em um objeto chave-valor
     * @param valores Array de valores de solicitação
     * @returns Objeto com campos organizados por nome
     */
    public static organizarCamposSolicitacao(valores: ValorSolicitacao[]): Record<string, any> {
        const campos: Record<string, any> = {};

        valores.forEach(valor => {
            const nomeCampo = valor.campoSolicitacao.nomeCampo;
            const tipoCampo = valor.campoSolicitacao.tipoCampo;

            const valorCampo = this.obterValorPorTipo(valor, tipoCampo);
            campos[nomeCampo] = valorCampo;
        });

        return campos;
    }

    /**
     * Obtém o valor baseado no tipo do campo
     * @param valor Objeto ValorSolicitacao
     * @param tipoCampo Tipo do campo
     * @returns Valor formatado de acordo com o tipo
     */
    private static obterValorPorTipo(valor: ValorSolicitacao, tipoCampo: string): any {
        switch (tipoCampo) {
            case 'texto':
            case 'opcoes':
                return valor.valorTexto;

            case 'numero':
                return valor.valorNumero;

            case 'data':
                return valor.valorData;

            case 'boolean':
                return valor.valorBoolean;

            default:
                return valor.valorTexto;
        }
    }

    /**
     * Organiza campos agrupando por categoria (opcional)
     * @param valores Array de valores de solicitação
     * @param categorias Mapeamento de campos para categorias
     * @returns Objeto com campos agrupados por categoria
     */
    public static organizarCamposPorCategoria(
        valores: ValorSolicitacao[],
        categorias: Record<string, string> = {}
    ): Record<string, Record<string, any>> {
        const resultado: Record<string, Record<string, any>> = {};

        valores.forEach(valor => {
            const nomeCampo = valor.campoSolicitacao.nomeCampo;
            const categoria = categorias[nomeCampo] || 'geral';
            const valorCampo = this.obterValorPorTipo(valor, valor.campoSolicitacao.tipoCampo);

            if (!resultado[categoria]) {
                resultado[categoria] = {};
            }

            resultado[categoria][nomeCampo] = valorCampo;
        });

        return resultado;
    }

    /**
     * Filtra campos por tipo específico
     * @param valores Array de valores de solicitação
     * @param tipo Tipo do campo para filtrar
     * @returns Objeto apenas com campos do tipo especificado
     */
    public static filtrarCamposPorTipo(
        valores: ValorSolicitacao[],
        tipo: string
    ): Record<string, any> {
        const campos: Record<string, any> = {};

        valores
            .filter(valor => valor.campoSolicitacao.tipoCampo === tipo)
            .forEach(valor => {
                const nomeCampo = valor.campoSolicitacao.nomeCampo;
                campos[nomeCampo] = this.obterValorPorTipo(valor, tipo);
            });

        return campos;
    }

    /**
     * Converte campos organizados para formato de array
     * @param campos Objeto com campos organizados
     * @returns Array de campos com nome e valor
     */
    public static camposParaArray(campos: Record<string, any>): Array<{ nome: string; valor: any }> {
        return Object.entries(campos).map(([nome, valor]) => ({
            nome,
            valor
        }));
    }

    /**
     * Obtém apenas campos que possuem valores preenchidos
     * @param valores Array de valores de solicitação
     * @returns Objeto apenas com campos que possuem valores
     */
    public static obterCamposPreenchidos(valores: ValorSolicitacao[]): Record<string, any> {
        const campos: Record<string, any> = {};

        valores.forEach(valor => {
            const nomeCampo = valor.campoSolicitacao.nomeCampo;
            const valorCampo = this.obterValorPorTipo(valor, valor.campoSolicitacao.tipoCampo);

            // Verifica se o valor não é nulo, undefined ou string vazia
            if (valorCampo !== null && valorCampo !== undefined && valorCampo !== '') {
                campos[nomeCampo] = valorCampo;
            }
        });

        return campos;
    }

       // ✅ FORMATAR DADOS DO BALCÃO
    public static async formatarBalcao(balcao: Balcao): Promise<SolicitacaoListItem['balcao']> {
        return {
            id: balcao.id,
            nome: balcao.nome,
            code_referencia: balcao.code_referencia,
            provincia: balcao.provincia ?? '',
            municipio: balcao.municipio?? '',
            coordenada: balcao.coordenada??'',
            enderecoCompleto: this.formatarEnderecoCompleto(balcao)
        };
    }

    public static formatarEnderecoCompleto(balcao: Balcao): string {
        const parts = [
            balcao.rua,
            balcao.bairro,
            balcao.municipio,
            balcao.provincia
        ].filter(part => part && part.trim() !== '');

        return parts.join(', ');
    }
}
