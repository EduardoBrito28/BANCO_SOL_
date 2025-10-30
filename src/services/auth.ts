import bcrypt from 'bcrypt';
import { gerarTokens } from '../utils/jwt';
import UserService from './users';
import { JwtPayload } from 'jsonwebtoken';
const userService = new UserService();

export default class AuthService {
    async login(email: string, senha: string) {
        const utilizador = await userService.findByEmail(email);
        if (!utilizador) {
            throw new Error('Utilizador não encontrado');
        }

        const senhaValida = await bcrypt.compare(senha, (utilizador as any).senhaHash);
        if (!senhaValida) {
            throw new Error('Credenciais inválidas');
        }

        const payload: JwtPayload = {
            id: utilizador.id,
            email: utilizador.email,
            perfilId: utilizador.perfil?.id,
        };

        const { accessToken, refreshToken } = gerarTokens(payload);

        return {
            utilizador,
            tokens: { accessToken, refreshToken },
        };
    }

    async logout(userId: string) {
        // Caso use Redis:
        // await redisClient.del(`refresh:${userId}`);
        return true;
    }
}
