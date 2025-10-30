import { AcaoDTO } from "../Acao";

export interface ModuloCompletoDTO {
    id: string;
    nome: string;
    icone: string;
    ordem: number
    acoes: AcaoDTO[];
}

// DTO básico do módulo (sem ações)
export interface ModuloBaseDTO {
    id: string;
    nome: string;
    icone: string;
    ordem: number;
}

// DTO para listagem com ações resumidas
export interface ModuloDTO extends ModuloBaseDTO {
    acoes: AcaoDTO[];
}
// DTO para criação de módulo
export interface CreateModuloDTO {
    nome: string;
    descricao?: string;
    icone: string;
    rota: string;
    ordem: number;
    departamento_id?: string;
    parent_id?: string;
    ativo?: boolean;
}

// DTO para atualização de módulo
export interface UpdateModuloDTO {
    nome?: string;
    descricao?: string;
    icone?: string;
    rota?: string;
    ordem?: number;
    departamento_id?: string;
    parent_id?: string;
    ativo?: boolean;
}

// DTO para módulo com estrutura hierárquica
export interface ModuloHierarquicoDTO extends ModuloDTO {
    children?: ModuloHierarquicoDTO[];
    parent?: ModuloBaseDTO;
}

// DTO para resposta da API
export interface ModuloResponseDTO {
    success: boolean;
    data: ModuloDTO | ModuloCompletoDTO | ModuloHierarquicoDTO | ModuloDTO[];
    count?: number;
    message?: string;
}
