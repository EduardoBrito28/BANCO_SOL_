import { DataSource } from 'typeorm';
import { Departamento } from '../models/user/Departamento';
import { Direcao } from '../models/user/direcao';
import { Gabinete } from '../models/user/Gabinete';


export default async function seedDepartamentos(dataSource: DataSource) {
  const depRepo = dataSource.getRepository(Departamento);
  const direcaoRepo = dataSource.getRepository(Direcao);
  const gabineteRepo = dataSource.getRepository(Gabinete);

  const getDirecao = async (sigla: string) => await direcaoRepo.findOne({ where: { sigla } });
  const getGabinete = async (sigla: string) => await gabineteRepo.findOne({ where: { sigla } });

  const departamentos: Array<{
    sigla: string;
    nome: string;
    direcao?: string;
    gabinete?: string;
  }> = [
    // -----------------------
    // Gabinetes (associados a Gabinete)
    // -----------------------
    { sigla: 'GCO', nome: 'Gabinete de Compras', gabinete: 'GCO' },
    { sigla: 'GSC', nome: 'Gabinete de Segurança Cibernética', gabinete: 'GSC' },
    { sigla: 'GCM', nome: 'Gabinete de Comunicação e Marca', gabinete: 'GCM' },
    { sigla: 'GRB', nome: 'Gabinete de Reconciliações Bancárias', gabinete: 'GRB' },

    // -----------------------
    // DOP
    // -----------------------
    { sigla: 'RMT', nome: 'Departamento de Manutenção de Contas', direcao: 'DOP' },
    { sigla: 'RCO', nome: 'Departamento de Contabilidade e Fiscalidade', direcao: 'DOP' },
    { sigla: 'ROE', nome: 'Departamento de Operações sobre Estrangeiro', direcao: 'DOP' },
    { sigla: 'RON', nome: 'Departamento de Operações Nacionais', direcao: 'DOP' },
    { sigla: 'RPC', nome: 'Departamento de Processamento de Crédito', direcao: 'DOP' },

    // -----------------------
    // DTI
    // -----------------------
    { sigla: 'RGA', nome: 'Departamento de Gestão Aplicacional e Projectos', direcao: 'DTI' },
    { sigla: 'RSU', nome: 'Departamento de Suporte ao Utilizador', direcao: 'DTI' },
    { sigla: 'ROS', nome: 'Departamento de Operação de Sistemas Centrais', direcao: 'DTI' },
    { sigla: 'RSR', nome: 'Departamento de Sistemas e Redes', direcao: 'DTI' },
    { sigla: 'RSI', nome: 'Departamento de Segurança e Infraestrutura', direcao: 'DTI' },

    // -----------------------
    // DSG
    // -----------------------
    { sigla: 'RAD', nome: 'Departamento de Administração e Documentação', direcao: 'DSG' },
    { sigla: 'RSF', nome: 'Departamento de Serviços e Facilities', direcao: 'DSG' },
    { sigla: 'RIF', nome: 'Departamento de Infraestruturas e Frotas', direcao: 'DSG' },
    { sigla: 'RLG', nome: 'Departamento de Logística e Gestão de Serviços', direcao: 'DSG' },

    // -----------------------
    // DAC
    // -----------------------
    { sigla: 'RAF', nome: 'Departamento de Análise de Crédito de Empresas e Financiamentos', direcao: 'DAC' },
    { sigla: 'RAP', nome: 'Departamento de Análise de Crédito de Particulares', direcao: 'DAC' },
    { sigla: 'RFO', nome: 'Departamento de Formalização e Gestão de Crédito', direcao: 'DAC' },
    { sigla: 'RGI', nome: 'Departamento de Gestão e Inadimplência', direcao: 'DAC' },

    // -----------------------
    // DRC
    // -----------------------
    { sigla: 'REM', nome: 'Departamento de Empresas', direcao: 'DRC' },
    { sigla: 'RNR', nome: 'Departamento Regional Norte', direcao: 'DRC' },
    { sigla: 'RPI', nome: 'Departamento de Pagamento e Imobilizado', direcao: 'DRC' },
    { sigla: 'RPO', nome: 'Departamento de Planeamento e Orçamento', direcao: 'DRC' },

    // -----------------------
    // DCO
    // -----------------------
    { sigla: 'RIG', nome: 'Departamento de Gestão e Investimentos', direcao: 'DCO' },
    { sigla: 'RGO', nome: 'Departamento de Gestão Operacional', direcao: 'DCO' },
    { sigla: 'RLC', nome: 'Departamento de Liquidez e Controlo', direcao: 'DCO' },

    // -----------------------
    // DGR
    // -----------------------
    { sigla: 'RRC', nome: 'Departamento de Risco de Crédito e Imparidades', direcao: 'DGR' },
    { sigla: 'RRO', nome: 'Departamento de Risco Operacional', direcao: 'DGR' },
    { sigla: 'RRL', nome: 'Departamento de Risco de Liquidez e Mercado', direcao: 'DGR' },

    // -----------------------
    // DAI
    // -----------------------
    { sigla: 'RAB', nome: 'Departamento de Auditoria Bancária', direcao: 'DAI' },
    { sigla: 'RAS', nome: 'Departamento de Auditoria de Sistemas', direcao: 'DAI' },
    { sigla: 'RAT', nome: 'Departamento de Testes e Controlo', direcao: 'DAI' },

    // -----------------------
    // DCH
    // -----------------------
    { sigla: 'RGP', nome: 'Departamento de Gestão de Pessoas', direcao: 'DCH' },
    { sigla: 'RFD', nome: 'Departamento de Formação e Desenvolvimento', direcao: 'DCH' },
    { sigla: 'RRS', nome: 'Departamento de Recrutamento e Seleção', direcao: 'DCH' },

    // -----------------------
    // DOQ
    // -----------------------
    { sigla: 'RQL', nome: 'Departamento de Qualidade', direcao: 'DOQ' },
    { sigla: 'RPJ', nome: 'Departamento de Projetos e Inovação', direcao: 'DOQ' },
    { sigla: 'REO', nome: 'Departamento de Eficiência Operacional', direcao: 'DOQ' },

    // -----------------------
    // DCP
    // -----------------------
    { sigla: 'RCF', nome: 'Departamento de Conformidade', direcao: 'DCP' },
    { sigla: 'RPB', nome: 'Departamento de Prevenção de Branqueamento de Capitais', direcao: 'DCP' },
    { sigla: 'RAR', nome: 'Departamento de Avaliação de Risco', direcao: 'DCP' },

    // -----------------------
    // DPN
    // -----------------------
    { sigla: 'RPA', nome: 'Departamento de Particulares', direcao: 'DPN' },
    { sigla: 'RPM', nome: 'Departamento de Micro, Pequenas e Médias Empresas', direcao: 'DPN' },
    { sigla: 'RAA', nome: 'Departamento de Avaliação e Aprovação de Crédito', direcao: 'DPN' },

    // -----------------------
    // DGE
    // -----------------------
    { sigla: 'RIN', nome: 'Departamento de Institucionais', direcao: 'DGE' },
    { sigla: 'RGE', nome: 'Departamento de Grandes Empresas', direcao: 'DGE' },
    { sigla: 'RPG', nome: 'Departamento de Gestão de Carteira Corporativa', direcao: 'DGE' },

    // -----------------------
    // DMI
    // -----------------------
    { sigla: 'RME', nome: 'Departamento de Marketing Estratégico', direcao: 'DMI' },
    { sigla: 'RDC', nome: 'Departamento de Dinamização Comercial', direcao: 'DMI' },

    // -----------------------
    // DTS
    // -----------------------
    { sigla: 'RCP', nome: 'Departamento de Controlo de Posições', direcao: 'DTS' },
    { sigla: 'RCU', nome: 'Departamento de Controlo de Utilização de Recursos', direcao: 'DTS' },

    // -----------------------
    // DCI
    // -----------------------
    { sigla: 'RCI', nome: 'Departamento de Controlo Interno', direcao: 'DCI' },
    { sigla: 'RII', nome: 'Departamento de Investigação e Inspecção', direcao: 'DCI' },

    // -----------------------
    // DJU
    // -----------------------
    { sigla: 'RCN', nome: 'Departamento de Contencioso', direcao: 'DJU' },
    { sigla: 'RAJ', nome: 'Departamento de Assessoria Jurídica', direcao: 'DJU' },

    // -----------------------
    // DMF
    // -----------------------
    { sigla: 'RMR', nome: 'Departamento de Mercados e Rendimento', direcao: 'DMF' },
    { sigla: 'RFI', nome: 'Departamento Financeiro', direcao: 'DMF' },

    // -----------------------
    // DBE
    // -----------------------
    { sigla: 'RAG', nome: 'Departamento de Aplicações e Gestão de Canais', direcao: 'DBE' },
    { sigla: 'RCD', nome: 'Departamento de Canais Digitais', direcao: 'DBE' },

    // -----------------------
    // DPB
    // -----------------------
    { sigla: 'RAC', nome: 'Departamento de Acompanhamento de Clientes Private', direcao: 'DPB' },


      // DPS
    { sigla: 'RIA', nome: 'Departamento de Infraestruturas e Arquivo', direcao: 'DPS' },
    { sigla: 'RLG', nome: 'Departamento de Logística e Gestão de Serviços', direcao: 'DPS' },
    { sigla: 'RSE', nome: 'Departamento de Segurança ', direcao: 'DPS' },

  ];

  for (const dep of departamentos) {
    const exists = await depRepo.findOne({ where: { nome: dep.nome } });
    if (exists) {
      //console.log(`⚠️ Já existe: ${dep.sigla} - ${dep.nome}`);
      continue;
    }

    const direcao = dep.direcao ? await getDirecao(dep.direcao) : null;
    const gabinete = dep.gabinete ? await getGabinete(dep.gabinete) : null;

    const novo = depRepo.create({
      nome: dep.nome,
      sigla: dep.sigla,
      direcao: direcao ?? undefined,
    });

    await depRepo.save(novo);
    //console.log(`✅ Criado: ${dep.sigla} - ${dep.nome} ${direcao ? `(Direção: ${dep.direcao})` : ''} ${gabinete ? `(Gabinete: ${dep.gabinete})` : ''}`);
  }
}
