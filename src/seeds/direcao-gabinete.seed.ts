import { DataSource } from 'typeorm';
import { Direcao } from '../models/user/direcao';
import { Gabinete } from '../models/user/Gabinete';

export default async function seedDirecoesGabinetes(dataSource: DataSource) {
  const direcaoRepo = dataSource.getRepository(Direcao);
  const gabineteRepo = dataSource.getRepository(Gabinete);

  const direcoes = [
    { sigla: 'DOP', nome: 'Direcção de Operações' },
    { sigla: 'DTI', nome: 'Direcção de Tecnologia e Sistemas de Informação' },
    { sigla: 'DSG', nome: 'Direcção de Património e Serviços' },
    { sigla: 'DAC', nome: 'Direcção de Análise de Crédito' },
    { sigla: 'DRC', nome: 'Direcção de Recuperação e Contencioso de Crédito' },
    { sigla: 'DCO', nome: 'Direcção de Contabilidade' },
    { sigla: 'DGR', nome: 'Direcção de Gestão de Risco' },
    { sigla: 'DAI', nome: 'Direcção de Auditoria Interna' },
    { sigla: 'DCH', nome: 'Direcção de Capital Humano' },
    { sigla: 'DOQ', nome: 'Direcção de Organização e Qualidade' },
    { sigla: 'DCP', nome: 'Direcção de Compliance' },
    { sigla: 'DPN', nome: 'Direcção de Particulares e Negócios' },
    { sigla: 'DGE', nome: 'Direcção de Grandes Empresas e Institucionais' },
    { sigla: 'DMI', nome: 'Direcção de Marketing e Inovação' },
    { sigla: 'DTS', nome: 'Direcção de Tesouraria' },
    { sigla: 'DCI', nome: 'Direcção de Controlo Interno' },
    { sigla: 'DJU', nome: 'Direcção Jurídica' },
    { sigla: 'DMF', nome: 'Direcção Financeira' },
    { sigla: 'DBE', nome: 'Direcção de Banca Electrónica' },
    { sigla: 'DPB', nome: 'Direcção de Private Banking' },
  ];

  const gabinetes = [
    { sigla: 'GCO', nome: 'Gabinete de Compras' },
    { sigla: 'GSC', nome: 'Gabinete de Segurança Cibernética' },
    { sigla: 'GCM', nome: 'Gabinete de Comunicação e Marca' },
    { sigla: 'GRB', nome: 'Gabinete de Reconciliações Bancárias' },
  ];

  for (const dir of direcoes) {
    const exists = await direcaoRepo.findOne({ where: { sigla: dir.sigla } });
    if (!exists) {
      await direcaoRepo.save(direcaoRepo.create(dir));
      //console.log(`✅ Direcção criada: ${dir.sigla}`);
    }
  }

  //console.log('🟩 Inserindo Gabinetes...');
  for (const gab of gabinetes) {
    const exists = await gabineteRepo.findOne({ where: { sigla: gab.sigla } });
    if (!exists) {
      await gabineteRepo.save(gabineteRepo.create(gab));
      //console.log(`✅ Gabinete criado: ${gab.sigla}`);
    }
  }
}
