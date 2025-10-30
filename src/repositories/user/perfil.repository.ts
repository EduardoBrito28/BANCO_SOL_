import { AppDataSource } from "../../loaders/database";
import { Perfil } from "../../models/user/Perfil";


export const PerfilRepository = AppDataSource.getRepository(Perfil);
