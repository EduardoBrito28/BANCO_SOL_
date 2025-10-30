import { AppDataSource } from "../../loaders/database";
import { Gabinete } from "../../models/user/Gabinete";



export const GabineteRepository = AppDataSource.getRepository(Gabinete);
