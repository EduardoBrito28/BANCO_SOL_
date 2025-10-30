import { DataSource } from "typeorm";
import { Perfil } from "../models/user/Perfil";
import { Modulo } from "../models/user/Modulo";
import { Acao } from "../models/user/Acao";
import { PerfilPermissao } from "../models/user/PerfilPermissao";

export default async function perfilPermissaoSeed(dataSource: DataSource) {
    const perfilRepo = dataSource.getRepository(Perfil);
    const moduloRepo = dataSource.getRepository(Modulo);
    const acaoRepo = dataSource.getRepository(Acao);
    const perfilPermissaoRepo = dataSource.getRepository(PerfilPermissao);

    // 🔍 Buscar apenas perfis com isAdmin true E restricao super_admin
    const adminPerfis = await perfilRepo.find({
        where: {
            isAdmin: true,
            restricao: "super_admin"
        }
    });

    if (!adminPerfis || adminPerfis.length === 0) {
        console.log("⚠️ Nenhum perfil administrador com restricao 'super_admin' encontrado. Execute o seed de perfis primeiro.");
        return;
    }

    const modulos = await moduloRepo.find();
    const acoes = await acaoRepo.find();

    console.log(`🎯 Encontrados ${adminPerfis.length} perfis super_admin`);
    console.log(`📦 Módulos: ${modulos.length}, Ações: ${acoes.length}`);

    let permissoesCriadas = 0;

    for (const adminPerfil of adminPerfis) {
        console.log(`\n🔐 Processando perfil: ${adminPerfil.papel} (${adminPerfil.restricao})`);

        for (const modulo of modulos) {
            for (const acao of acoes) {
                const existe = await perfilPermissaoRepo.findOne({
                    where: {
                        perfil: { id: adminPerfil.id },
                        modulo: { id: modulo.id },
                        acao: { id: acao.id },
                    },
                });

                if (!existe) {
                    const novaPermissao = perfilPermissaoRepo.create({
                        perfil: adminPerfil,
                        modulo,
                        acao,
                    });
                    await perfilPermissaoRepo.save(novaPermissao);
                    permissoesCriadas++;
                    console.log(`✅ Permissão criada: ${adminPerfil.papel} -> ${modulo.sigla} [${acao.nome}]`);
                }
            }
        }
    }

    console.log(`\n🎉 Seed de permissões concluído!`);
    console.log(`📊 Permissões criadas: ${permissoesCriadas}`);
    console.log(`👤 Perfis super_admin processados: ${adminPerfis.length}`);
    console.log(`🔢 Total possível de permissões: ${adminPerfis.length * modulos.length * acoes.length}`);
}
