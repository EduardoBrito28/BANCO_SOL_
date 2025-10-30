import { DataSource } from 'typeorm';
import { Modulo } from '../models/user/Modulo';
import { Departamento } from '../models/user/Departamento';


export default async function seedModulos(dataSource: DataSource) {
  const moduloRepo = dataSource.getRepository(Modulo);
  const departamentoRepo = dataSource.getRepository(Departamento);

  const modulos = [
    { sigla: 'USR', nome: 'Gestão de Utilizadores', descricao: 'Gestão de contas e permissões', departamento: 'DTI' },
    { sigla: 'DEP', nome: 'Gestão de Departamentos', descricao: 'Criação e manutenção de departamentos', departamento: 'DTI' },
    { sigla: 'MOD', nome: 'Gestão de Módulos', descricao: 'Administração de módulos e funcionalidades', departamento: 'DTI' },
    { sigla: 'FIN', nome: 'Gestão Financeira', descricao: 'Processamento financeiro e tesouraria', departamento: 'DCO' },
    { sigla: 'RSC', nome: 'Gestão de Riscos', descricao: 'Gestão de risco de crédito e mercado', departamento: 'DGR' },
    { sigla: 'OPR', nome: 'Gestão de Operações', descricao: 'Controle de operações bancárias', departamento: 'DOP' },
    { sigla: 'CRM', nome: 'Gestão de Clientes', descricao: 'Gestão de perfis e relacionamento com clientes', departamento: 'DPB' },
    { sigla: 'AUD', nome: 'Auditoria Interna', descricao: 'Gestão e monitorização de auditorias', departamento: 'DAI' },
    { sigla: 'HRM', nome: 'Recursos Humanos', descricao: 'Gestão de pessoal e desempenho', departamento: 'DCH' },
    { sigla: 'MKT', nome: 'Marketing e Inovação', descricao: 'Promoção e campanhas de marketing', departamento: 'DMI' },
  ];

  for (const mod of modulos) {
    const exists = await moduloRepo.findOne({ where: { sigla: mod.sigla } });
    if (exists) {
      //console.log(`⚠️ Já existe este modulo->: ${mod.sigla}`);
      continue;
    }

    const departamento = await departamentoRepo.findOne({ where: { sigla: mod.departamento } });
    if (!departamento) {
      //console.log(`❌ Departamento ${mod.departamento} não encontrado!`);
      continue;
    }

    const novo = moduloRepo.create({
      nome: mod.nome,
      sigla: mod.sigla,
      descricao: mod.descricao,
      departamento,
    });

    await moduloRepo.save(novo);
  }

}
