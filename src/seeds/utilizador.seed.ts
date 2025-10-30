
import bcrypt from 'bcrypt';
import { DataSource } from "typeorm";
import { Utilizador } from "../models/user/Utilizador";
import { Perfil } from "../models/user/Perfil";

export default async function utilizadorSeed(dataSource: DataSource) {
    const UtilizadorRepo = dataSource.getRepository(Utilizador);
    const perfilRepo = dataSource.getRepository(Perfil);


    // ⚙️ Criar senha e salt
    const password = "1234";
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(password, salt);

    // 📘 Buscar perfis existentes
    const perfilAdmin = await perfilRepo.findOne({ where: { papel: "Administrador do Sistema" } });

    // 👤 Lista de utilizadores padrão
    const utilizadoresSeed = [
        {
            nome: "Alberto L. Kambaia",
            email: "admin@gsi.co.ao",
            telefone: "900000001",
            senhaHash,
            saltHash: salt,
            superAdmin: true,
            emailVerificado: true,
            perfil: perfilAdmin || undefined,
            perfil_id: '05a1d0ec-d270-4eb8-9297-edbae6ce8af3'
        },
    ];

    for (const userData of utilizadoresSeed) {

        const existe = await UtilizadorRepo.findOne({
            where: { email: userData.email }
        });
        if (!existe) {
            const novo = UtilizadorRepo.create(userData);
            await UtilizadorRepo.save(novo);
            console.log(`✅ Utilizador criado: ${userData.email}`);
        }
    }

    console.log("🎉 Seed de utilizadores concluído com sucesso.");
};
