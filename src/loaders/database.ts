
import 'reflect-metadata';
import { DataSource, useContainer } from 'typeorm';
import Container from 'typedi';
import config from '../config';
import { Utilizador } from '../models/user/Utilizador';
import { TipoSolicitacao } from '../models/TipoSolicitacao';
import { Solicitacao } from '../models/Solicitacao';
import { CampoSolicitacao } from '../models/CampoSolicitacao';
import { MaterialSolicitacao } from '../models/MaterialSolicitacao';
import { ValorSolicitacao } from '../models/ValorSolicitacao';
import { Balcao } from '../models/Balcao';
import { AprovacaoSolicitacao } from '../models/AprovacaoSolicitacao';
import { seedTiposSolicitacao } from '../seeds/seedTiposSolicitacao';
import { Direcao } from '../models/user/direcao';
import { Perfil } from '../models/user/Perfil';
import { PerfilPermissao } from '../models/user/PerfilPermissao';
import { Acao } from '../models/user/Acao';
import { Modulo } from '../models/user/Modulo';
import seedDepartamentos from '../seeds/departamento.seed';
import { Departamento } from '../models/user/Departamento';
import seedDirecoesGabinetes from '../seeds/direcao-gabinete.seed';
import { Gabinete } from '../models/user/Gabinete';
import seedModulos from '../seeds/modulo.seed';
import seedAcoes from '../seeds/seed-acoes';
import utilizadorSeed from '../seeds/utilizador.seed';
import perfilPermissaoSeed from '../seeds/perfilPermissao.seed';
import perfilSeed from '../seeds/perfil.seed';
import { FileUpload } from '../models/FileUpload';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: config.database.host,
    port: config.database.port,
    username: config.database.user,
    password: config.database.pass,
    database: config.database.name,
    synchronize: true,
    logging: false,
    entities: [
        Perfil,
        Utilizador,
        Direcao,
        Gabinete,
        Departamento,
        PerfilPermissao,
        Acao,
        Modulo,
        TipoSolicitacao,
        Solicitacao,
        FileUpload,
        CampoSolicitacao,
        ValorSolicitacao,
        MaterialSolicitacao,
        Balcao,
        AprovacaoSolicitacao,
    ],
    migrations: ['src/migrations/*.ts'],
});

export default async () => {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
            console.log('✅ Conexão com o banco de dados estabelecida com sucesso!');
        }

        // Mostrar tabelas existentes
        const queryRunner = AppDataSource.createQueryRunner();
        const result = await queryRunner.query(`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `);

        console.log('\n📦 Tabelas encontradas no banco de dados:');
        result.forEach((row: any) => console.log(`- ${row.tablename}`));
        console.log('-------------------------------------------\n');

        await queryRunner.release();

        // Executar seeds
        await seedTiposSolicitacao(AppDataSource);


        await seedDirecoesGabinetes(AppDataSource)
        await seedDepartamentos(AppDataSource);
        await
            await seedModulos(AppDataSource);
        await seedAcoes(AppDataSource);


        await perfilPermissaoSeed(AppDataSource)
        await perfilSeed(AppDataSource);
        await utilizadorSeed(AppDataSource);

        return AppDataSource;
    } catch (error) {
        console.error('❌ Erro ao conectar ao banco de dados:', error);
        process.exit(1);
    }
};
