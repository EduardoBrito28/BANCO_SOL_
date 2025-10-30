// src/interfaces/user.interface.ts
export interface IUser {
  nome: string;
  id: string
  email: string;
}


export interface JwtPayload {
  id: string;
  email: string;
  perfilId?: string;
  tipoAdmin?: boolean;
}
