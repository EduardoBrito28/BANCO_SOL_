import { AppDataSource } from "../../loaders/database";
import { PerfilPermissao } from "../../models/user/PerfilPermissao";



export const PerfilPermissaoRepository = AppDataSource.getRepository(PerfilPermissao);
