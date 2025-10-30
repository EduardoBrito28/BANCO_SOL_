import { DataSource } from 'typeorm';
import { TipoSolicitacao } from '../models/TipoSolicitacao';

export const seedTiposSolicitacao = async (AppDataSource: DataSource) => {
  const tipoRepo = AppDataSource.getRepository(TipoSolicitacao);

  const tiposExistentes = await tipoRepo.count();
  if (tiposExistentes > 0) {
    console.log('🔸 Tipos de solicitação já existem, seed ignorado.');
    return;
  }

  const tipos = [
    new TipoSolicitacao(),
    new TipoSolicitacao(),
    new TipoSolicitacao(),
    new TipoSolicitacao(),
    new TipoSolicitacao(), // Adicionei o CSI aqui
  ];

  tipos[0].nome = 'Acesso Remoto';
  tipos[0].descricao = 'Solicitação de acesso remoto a sistemas e redes';

  tipos[1].nome = 'Requisição de Material';
  tipos[1].descricao = 'Solicitação de materiais para projetos e manutenções';

  tipos[2].nome = 'Registro Entrada/Saída';
  tipos[2].descricao = 'Controle de entrada e saída de equipamentos/materiais';

  tipos[3].nome = 'Intervenção Técnica';
  tipos[3].descricao = 'Ficha de intervenção técnica para suporte e manutenção';

  tipos[4].nome = 'CSI - Comunicação de Serviço Interno';
  tipos[4].descricao = 'Comunicação interna entre equipas para gestão de serviços.';

  await tipoRepo.save(tipos);
  console.log('✅ Tipos de solicitação criados com sucesso!');
};
