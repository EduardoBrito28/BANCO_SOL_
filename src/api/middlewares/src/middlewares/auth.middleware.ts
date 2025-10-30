// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Utilizador } from '../../../../models/user/Utilizador';


const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Token não fornecido' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    // ⚙️ injeta apenas dados essenciais no req.user (sem buscar tudo)
    req.user = { id: decoded.id } as Utilizador;

    return next();
  } catch (error) {
    console.error('Erro na autenticação:', error);
    return res.status(401).json({ success: false, error: 'Token inválido ou expirado' });
  }
};
