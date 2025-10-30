import { GabineteRepository } from "../../repositories/user/gabinete.repository";

export class GabineteService {
    async listar() {
        try {
            const gabinetes = await GabineteRepository.find({
                where: { ativo: true },
                order: { nome: "ASC" },
            });
            return gabinetes;
        } catch (error) {
            console.error('Erro no service ao listar gabinetes:', error);
            throw new Error('Erro ao listar gabinetes');
        }
    }

    async buscarPorId(id: string) {
        try {
            const gabinete = await GabineteRepository.findOne({ where: { id } });
            if (!gabinete) throw new Error('Gabinete não encontrado');
            return gabinete;
        } catch (error) {
            console.error('Erro no service ao buscar gabinete:', error);
            throw error;
        }
    }
}
