
// ✅ DTO PARA CRIAR UTILIZADOR
export class CriarUtilizadorDTO {
    nome: string;
    email: string;
    telefone?: string;
    senha: string;
    direcaoId?: string;
    gabineteId?: string;
    perfilId?: string;
    estado?: boolean;
    avatar?: string;
}

// ✅ DTO PARA ATUALIZAR UTILIZADOR
export class AtualizarUtilizadorDTO {
    nome?: string;
    email?: string;
    telefone?: string;
    direcaoId?: string;
    gabineteId?: string;
    perfilId?: string;
    estado?: true;
    avatar?: string;
    tipoAdmin?: boolean;
}

// ✅ DTO PARA ATUALIZAR SENHA
export class AtualizarSenhaDTO {
    senhaAtual: string;
    novaSenha: string;
    confirmarNovaSenha: string;
}

// ✅ DTO PARA REDEFINIR SENHA
export class RedefinirSenhaDTO {
    email: string;
    codigoVerificacao: string;
    novaSenha: string;
}

// ✅ DTO PARA FILTROS
export class FiltrosUtilizadorDTO {
    page?: number = 1;
    limit?: number = 10;
    search?: string;
    estado: boolean;
    direcaoId?: string;
    gabineteId?: string;
    perfilId?: string;
    sortBy?: string = 'nome';
    sortOrder?: 'ASC' | 'DESC' = 'ASC';
}

// ✅ DTO DE RESPOSTA
export class UtilizadorDTO {
    id: string;
    nome: string;
    email: string;
    telefone?: string;
    estado: boolean;
    tipoAdmin: boolean;
    avatar?: string;
    ultimoLogin?: Date;
    emailVerificado: boolean;
    createdAt: Date;
    updatedAt: Date;
    perfil?:PerfilLoginMapeado

    permissoes?: string[];
}

// ✅ DTO PARA LISTAGEM
export class UtilizadorListagemDTO {
    id: string;
    nome: string;
    email: string;
    estado: boolean;
    direcaoNome?: string;
    gabineteNome?: string;
    perfilNome?: string;
    ultimoLogin?: Date;
}

// ✅ DTO PARA PERMISSÕES

export class PermissoesUtilizadorDTO {
    permissoes: {
        modulo: string;
        acoes: string[];
    }[];

    resumo: {
        canViewAllSolicitacoes: boolean;
        canApproveSolicitacoes: boolean;
        canManageUsers: boolean;
        canViewReports: boolean;
        canManageMaterials: boolean;
        canAudit: boolean;
        isAdmin: boolean;
    };
}


export interface PerfilLoginMapeado {
    id: string;
    papel: string;
    descricao: string;
    ativo: boolean;
    isAdmin: boolean;
    createdAt: string;
    updatedAt: string;
    nomeDepartamento: string;
    siglaDepartamento: string;
    nomeDirecao: string;
    siglaDirecao: string;
}
