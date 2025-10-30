import { AppDataSource } from "../../loaders/database";
import { Direcao } from "../../models/user/direcao";



export const DirecaoRepository = AppDataSource.getRepository(Direcao);
