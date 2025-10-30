import { Modulo } from "../../models/user/Modulo";
import { DepartamentoRepository } from "../../repositories/user/departamento.repository";
import { ModuloRepository } from "../../repositories/user/modulo.repository";
import { formatarModulosParaFrontend } from "../Mapear/mapModulo";

export class ModuloService {
    async listarTodos(): Promise<any[]> {


        const modulos = await ModuloRepository.find({
            relations: {
                departamento: true,
                parent: true,
                children: true,
                acoes: true
            },
            where: { ativo: true },
            order: {
                ordem: 'ASC',
                nome: 'ASC',
                acoes: {
                    nome: 'ASC'
                }
            }
        });
        return formatarModulosParaFrontend(modulos)
    }


    async listarAtivos() {
        return await ModuloRepository.findActive();
    }
    async obterPorId(id: string) {

        const modulo = await ModuloRepository.findOne({
            where: { id, ativo: true },
            relations: ['departamento', 'parent', 'children', 'acoes'],
        });

        if (!modulo) throw new Error('Módulo não encontrado.');
        return formatarModulosParaFrontend([modulo])
    }

    async criar(dados: any) {
        const { nome, sigla, descricao, icone, ativo, ordem, parentId, departamentoId } = dados;

        const moduloExistente = await ModuloRepository.findBySigla(sigla);
        if (moduloExistente) throw new Error('Já existe um módulo com esta sigla.');

        const modulo = ModuloRepository.create({
            nome,
            sigla,
            departamento: departamentoId,
            descricao,
            icone,
            ativo,
            ordem,
        });

        if (parentId) {
            const parent = await ModuloRepository.findOneBy({ id: parentId });
            if (parent) modulo.parent = parent;
        }

        if (departamentoId) {
            const departamento = await DepartamentoRepository.findOneBy({ id: departamentoId });
            if (departamento) modulo.departamento = departamento;
        }

        return await ModuloRepository.save(modulo);
    }

    async atualizar(id: string, dados: any) {
        const modulo = await ModuloRepository.findOneBy({ id });
        if (!modulo) throw new Error('Módulo não encontrado.');

        Object.assign(modulo, dados);
        return await ModuloRepository.save(modulo);
    }

    async remover(id: string) {
        const modulo = await ModuloRepository.findOneBy({ id });
        if (!modulo) throw new Error('Módulo não encontrado.');

        await ModuloRepository.softRemove(modulo);
        return { mensagem: 'Módulo removido com sucesso.' };
    }
}
