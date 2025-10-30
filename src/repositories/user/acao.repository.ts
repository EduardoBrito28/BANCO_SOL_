
import { AppDataSource } from "../../loaders/database";
import { Acao } from "../../models/user/Acao";

export const AcaoRepository = AppDataSource.getRepository(Acao).extend({
  async findBySigla(sigla: string) {
    return this.findOne({ where: { sigla } });
  },

  async findActive() {
    return this.find({ where: { ativo: true }, order: { nome: "ASC" } });
  },

  async findWithModulo() {
    return this.find({ relations: ["modulo"], order: { nome: "ASC" } });
  },
});
