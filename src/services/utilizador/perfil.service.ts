import { Perfil } from "../../models/user/Perfil";
import { PerfilRepository } from "../../repositories/user/perfil.repository";


export class PerfilService {
  async listar(): Promise<Perfil[]> {
    return PerfilRepository.find({
      relations: ["departamento", "permissoes", "permissoes.modulo", "permissoes.acao"],
      order: { createdAt: "DESC" },
    });
  }

  async buscarPorId(id: string): Promise<Perfil | null> {
    return PerfilRepository.findOne({
      where: { id },
      relations: ["departamento", "permissoes", "permissoes.modulo", "permissoes.acao"],
    });
  }

  async criar(dados: Partial<Perfil>): Promise<Perfil> {
    console.log(dados)
    const repo = PerfilRepository.create(dados);
    return PerfilRepository.save(repo);
  }

  async atualizar(id: string, dados: Partial<Perfil>): Promise<Perfil> {
    const perfil = await this.buscarPorId(id);
    if (!perfil) throw new Error("Perfil não encontrado");

    Object.assign(perfil, dados);
    return PerfilRepository.save(perfil);
  }

  async remover(id: string): Promise<void> {
    const perfil = await this.buscarPorId(id);
    if (!perfil) throw new Error("Perfil não encontrado");
    await PerfilRepository.remove(perfil);
  }
}
