import { Request, Response } from 'express';
import AuthService from '../services/auth';


const authService = new AuthService();

export class AuthController {
    async login(req: Request, res: Response) {
        try {
            const { email, senha } = req.body;

            if (!email || !senha) {
                return res.status(400).json({ success: false, error: 'Email e senha são obrigatórios' });
            }


            const { utilizador, tokens } = await authService.login(email, senha);
            // Armazena refresh token em cookie HTTP-only (melhor segurança)
            res.cookie('refreshToken', tokens.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
            });

            return res.json({
                success: true,
                data: {
                    utilizador,
                    accessToken: tokens.accessToken,
                },
            });
        } catch (error) {
            return res.status(401).json({
                success: false,
                error: error instanceof Error ? error.message : 'Erro ao autenticar',
            });
        }
    }

    async logout(req: Request, res: Response) {
        try {
            if (!req.user) {
                return res.status(401).json({ success: false, error: 'Não autenticado' });
            }

            await authService.logout(req.user.id);

            res.clearCookie('refreshToken');
            return res.json({ success: true, message: 'Logout efetuado com sucesso' });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: 'Erro ao realizar logout',
            });
        }
    }
}
