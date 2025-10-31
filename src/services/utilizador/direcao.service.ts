import { DirecaoRepository } from "../../repositories/user/direcao.repository";

export class DirecaoService {
  async listar() {
    try {
      const direcoes = await DirecaoRepository.find({
        where: { ativo: true },
        order: { nome: "ASC" },
      });
      return direcoes;
    } catch (error) {
      console.error('Erro no service ao listar direções:', error);
      throw new Error('Erro ao listar direções');
    }
  }

  async buscarPorId(id: string) {
    try {
      const direcao = await DirecaoRepository.findOne({ where: { id } });
      if (!direcao) throw new Error('Direção não encontrada');
      return direcao;
    } catch (error) {
      console.error('Erro no service ao buscar direção:', error);
      throw error;
    }
  }
}

