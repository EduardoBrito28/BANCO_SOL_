import { StatusAprovacao } from "../../../models/AprovacaoSolicitacao";

export class SolicitacaoDTO {
    id: string;
    codeBalcao: string;
    enviadoPor: string;
    numeroPedido?: string;
    direcao?: string;
    observacoes?: string;
    tipoSolicitacaoId: string;
    tipoSolicitacaoNome?: string;
    campos: any;
    materiais: MaterialSolicitacaoDTO[] = [];
    aprovacoes: AprovacaoDTO[] = []; // Adicionar informações de aprovação se necessário
}

export interface AprovacaoDTOCreate {
    solicitacaoId: string;
    status: StatusAprovacao;
    usuarioAprovadorId: string;
    observacoes?: string;
    dataAprovacao: Date;
}


export interface AprovacaoDTO {
    id: string;
    solicitacaoId: string;
    status: StatusAprovacao;
    usuarioAprovadorId: string | null;
    observacoes: string | null;
    dataCriacao: Date;
    dataAprovacao: Date | null;
}

export class CampoValorDTO {
    nomeCampo: string;
    tipoCampo: string;
    obrigatorio: boolean;
    ordem: number;
    valor?: any;
    opcoes?: string[];
}

export class CriarSolicitacaoDTO {
    tipoSolicitacaoId: string;
    tipoEnvio: boolean;
    enviadoPor: string;
    direcao: string;
    numeroPedido?: string;
    codeBalcao: any | null;
    observacoes?: string;
    aprovacao: AprovacaoDTOCreate;
    campos: CampoValorInputDTO[] = [];
    materiais: MaterialSolicitacaoDTO[] = [];
}

export class CampoValorInputDTO {
    nomeCampo: string;
    valor: any;
}

export class MaterialSolicitacaoDTO {
    id?: string;
    descricao: string;
    quantidade: number = 1;
    pn?: string;
    marca?: string;
    modelo?: string;
    referencia?: string;
    estado?: string;
    proveniencia?: string;
    destino?: string;
}



// ✅ Interfaces Type-Safe
export interface SolicitacaoFiltros {
    tipoSolicitacaoId?: string;
    status?: string;
    nomeSolicitacao?: string;
    numeroPedido?: string;
    departamentoSigla?: string;
    direcaoSigla:string
}


export interface SolicitacaoListagemResult {
    solicitacoes: any[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}



export interface CreatedByMapped {
    nome: string;
    departamento: string;
    sigla_departamento: string;
    direcao: string;
    sigla_direcao: string;
    gabinete?: string;
    sigla_gabinete?: string;
}

export interface SolicitacaoListItem {
    id: string;
    tipoSolicitacaoId: string;
    numeroPedido: string;
    tipoEnvio: boolean;
    observacoes: string;
    nomeSolicitacao: string;
    enviadoPor: CreatedByMapped;
    balcao?: {
        id: string;
        nome: string;
        code_referencia: string;
        provincia?: string;
        municipio?: string;
        enderecoCompleto: string;
        coordenada: string;
    };
    aprovacoes: Array<{
        id: string;
        status: string;
        usuarioAprovadorId: string;
        observacoes: string;
        dataAprovacao: Date;
    }>;
    campos: any; // Ou defina uma interface específica
    materiais: Array<{
        id: string;
        descricao: string;
        quantidade: number;
        pn: string;
        marca: string;
        modelo: string;
        estado: string;
        proveniencia: string;
        destino: string;
    }>;
    totalMateriais: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface PaginatedResponse<T> {
    solicitacoes: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

