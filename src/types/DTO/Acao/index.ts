// dtos/AcaoDTO.ts
export interface AcaoDTO {
  id: string;
  nome: string;
  ativo: boolean;
}

export interface AcaoCompletaDTO extends AcaoDTO {
  descricao?: string;
  codigo: string;
  rota?: string;
  modulo_id?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateAcaoDTO {
  nome: string;
  descricao?: string;
  codigo: string;
  rota?: string;
  modulo_id: string;
  ativo?: boolean;
}

export interface UpdateAcaoDTO {
  nome?: string;
  descricao?: string;
  codigo?: string;
  rota?: string;
  ativo?: boolean;
}
