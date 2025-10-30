import { DataSource } from "typeorm";
import { Departamento } from "../models/user/Departamento";
import { Perfil } from "../models/user/Perfil";

export default async function perfilSeed(dataSource: DataSource) {

    const perfilRepo = dataSource.getRepository(Perfil);
    // Lista base de perfis do sistema
    const perfisBase = [
        {
            papel: "Administrador do Sistema",
            descricao: "Perfil com acesso total a todas as funcionalidades e módulos do sistema.",
            ativo: true,
            isAdmin: true,
            restricao: 'super_admin'
        },

        {
            papel: "Diretor Executivo",
            descricao: "Coordena direções e supervisiona resultados institucionais.",
            ativo: true,
            isAdmin: false,
            restricao: "diretor_exec",
        }
    ];
    // Inserir perfis
    for (const perfilData of perfisBase) {
        const existe = await perfilRepo.findOne({ where: { papel: perfilData.papel } });
        if (!existe) {
            const novo = perfilRepo.create(perfilData);
            await perfilRepo.save(novo);
            console.log(`✅ Perfil criado: ${perfilData.papel}`);
        }else{
            console.log("Já criado")
        }
    }
};


