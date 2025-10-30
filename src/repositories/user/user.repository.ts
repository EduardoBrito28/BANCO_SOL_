import { AppDataSource } from "../../loaders/database";
import { Utilizador } from "../../models/user/Utilizador";


export const UtilizadorRepository = AppDataSource.getRepository(Utilizador);
