import { AppDataSource } from "../../loaders/database";
import { Balcao } from "../../models/Balcao";


export const BalcoesRepository = AppDataSource.getRepository(Balcao);
