
import { AppDataSource } from "../../loaders/database";
import { Modulo } from "../../models/user/Modulo";

export const ModuloRepository = AppDataSource.getRepository(Modulo).extend({
  async findBySigla(sigla: string) {
    return this.findOne({ where: { sigla } });
  },

  async findActive() {
    return this.find({ where: { ativo: true }, order: { ordem: "ASC" } });
  },

  async findWithRelations() {
    return this.find({
      relations: ["departamento", "parent", "children"],
      order: { ordem: "ASC" },
    });
  },
});
