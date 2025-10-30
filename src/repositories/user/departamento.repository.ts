import { AppDataSource } from "../../loaders/database";
import { Departamento } from "../../models/user/Departamento";

export const DepartamentoRepository = AppDataSource.getRepository(Departamento);
