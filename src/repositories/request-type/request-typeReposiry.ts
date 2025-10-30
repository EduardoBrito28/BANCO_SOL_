import { AppDataSource } from "../../loaders/database";
import { TipoSolicitacao } from "../../models/TipoSolicitacao";


export const tipoSolicitacaoRepository = AppDataSource.getRepository(TipoSolicitacao);
