// mappers/SolicitacaoMapper.ts

import { Utilizador } from "../../models/user/Utilizador";

export interface CreatedByMapped {
  nome: string;
  email: string;
  telefone: string;
  departamento: string;
  papel: string,
  restricao: string;
  sigla_departamento: string;
  direcao: string;
  sigla_direcao: string;
  gabinete?: string | null;
  sigla_gabinete?: string | null;
}

export class SolicitacaoMapper {
  /**
   * Mapeia um utilizador completo (com perfil, departamento, direcção e gabinete)
   * para um formato resumido e seguro para envio ao cliente.
   */
  static mapCreatedBy(utilizador: Utilizador | any): CreatedByMapped {
    const perfil = utilizador?.perfil ?? {};
    const departamento = perfil?.departamento ?? {};
    const direcao = departamento?.direcao ?? {};
    const gabinete = departamento?.gabinete ?? {};

    return {
      nome: utilizador?.nome ?? '',
      email: utilizador?.email ?? '',
      telefone: utilizador?.telefone ?? '',
      departamento: departamento?.nome ?? 'N/A',
      papel: perfil.papel,
      restricao: perfil.restricao,
      sigla_departamento: departamento?.sigla ?? 'N/A',
      direcao: direcao?.nome ?? 'N/A',
      sigla_direcao: direcao?.sigla ?? 'N/A',
      gabinete: gabinete?.nome ?? null,
      sigla_gabinete: gabinete?.sigla ?? null,
    };
  }
}
