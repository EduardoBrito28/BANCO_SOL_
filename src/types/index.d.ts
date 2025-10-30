import { User } from '../models/user/Utilizador';

declare global {
  namespace Express {
    export interface Request {
      currentUser: User;
    }
  }
}
