import { AppDataSource } from "../../../../loaders/database";
import { Solicitacao } from "../../../../models/Solicitacao";

export class FluxoProcessoSolicitacaoService {
  private solicitacaoRepo = AppDataSource.getRepository(Solicitacao);

  async enviarParaDirector(id: string) {
    const solicitacao = await this.solicitacaoRepo.findOneBy({ id });
    if (!solicitacao) throw new Error("Solicitação não encontrada");

    // Resetar outros destinos para garantir coerência
    solicitacao.isAdminDestino = false;
    solicitacao.isDirecaoDestino = false;

    // Ativar destino para o diretor
    solicitacao.isDirectorDestino = true;

    await this.solicitacaoRepo.save(solicitacao);
    return solicitacao;
  }

  async enviarParaAdministrador(id: string) {
    const solicitacao = await this.solicitacaoRepo.findOneBy({ id });
    if (!solicitacao) throw new Error("Solicitação não encontrada");

    solicitacao.isDirecaoDestino = true;
    // Ativar destino para o administrador
    solicitacao.isAdminDestino = true;

    await this.solicitacaoRepo.save(solicitacao);
    return solicitacao;
  }

  async enviarParaDirecao(id: string) {
    const solicitacao = await this.solicitacaoRepo.findOneBy({ id });
    if (!solicitacao) throw new Error("Solicitação não encontrada");

    // Resetar outros destinos
    solicitacao.isDirectorDestino = false;
    solicitacao.isAdminDestino = false;

    // Ativar destino para a direção
    solicitacao.isDirecaoDestino = true;

    await this.solicitacaoRepo.save(solicitacao);
    return solicitacao;
  }

  async concluirSolicitacao(id: string) {
    const solicitacao = await this.solicitacaoRepo.findOneBy({ id });
    if (!solicitacao) throw new Error("Solicitação não encontrada");
    solicitacao.isConcluida = true;
    await this.solicitacaoRepo.save(solicitacao);
    return solicitacao;
  }
}
