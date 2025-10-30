import { AcaoRepository } from "../../repositories/user/acao.repository";
import { ModuloRepository } from "../../repositories/user/modulo.repository";

export class AcaoService {
  async listarTodos() {
    return await AcaoRepository.findWithModulo();
  }

  async listarAtivos() {
    return await AcaoRepository.findActive();
  }

  async obterPorId(id: string) {
    const acao = await AcaoRepository.findOne({
      where: { id },
      relations: ["modulo"],
    });
    if (!acao) throw new Error("Ação não encontrada.");
    return acao;
  }

  async criar(dados: any) {
    const { nome, sigla, descricao, ativo, moduloId } = dados;

    const existente = await AcaoRepository.findBySigla(sigla);
    if (existente) throw new Error("Já existe uma ação com esta sigla.");

    const acao = AcaoRepository.create({
      nome,
      sigla,
      descricao,
      ativo,
    });

    if (moduloId) {
      const modulo = await ModuloRepository.findOneBy({ id: moduloId });
      if (modulo) acao.modulo = modulo;
    }

    return await AcaoRepository.save(acao);
  }

  async atualizar(id: string, dados: any) {
    const acao = await AcaoRepository.findOneBy({ id });
    if (!acao) throw new Error("Ação não encontrada.");

    Object.assign(acao, dados);
    return await AcaoRepository.save(acao);
  }

  async remover(id: string) {
    const acao = await AcaoRepository.findOneBy({ id });
    if (!acao) throw new Error("Ação não encontrada.");

    await AcaoRepository.remove(acao);
    return { mensagem: "Ação removida com sucesso." };
  }
}
