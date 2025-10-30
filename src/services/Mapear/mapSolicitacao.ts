// services/CampoOrganizadorService.ts


import { CreatedByMapped,  } from "../../types/DTO/solicitacao";

export class MapearService {
    public static mapSolicitacao(utelizador: any): CreatedByMapped {
           const perfil = utelizador?.perfil;
           const departamento = perfil?.departamento;
           const direcao = departamento?.direcao;
           const gabinete = departamento?.gabinete;

           return {
               nome: utelizador?.nome || '',
               email: utelizador?.email || '',
               telefone: utelizador?.telefone || '',
               departamento: departamento?.nome || 'N/A',
               sigla_departamento: departamento?.sigla || 'N/A',
               direcao: direcao?.nome || 'N/A',
               sigla_direcao: direcao?.sigla || 'N/A',
               ...(gabinete && {
                   gabinete: gabinete.nome,
                   sigla_gabinete: gabinete.sigla
               })
           }
       };
}
