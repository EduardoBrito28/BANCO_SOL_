import { IUser } from '../DTO/utilizador/interfaces/ILoginToken.interface'; // ou o caminho correto do teu tipo de utilizador

declare global {
  namespace Express {
    interface Request {
      user?: IUser; // adiciona a propriedade "user" tipada ao Request
    }
  }
}
