import { Router } from 'express';
import { AuthController } from '../../../../controllers/authController.controller';

const authController = new AuthController();


const router = Router();

export default (app: Router) => {
    app.use('/auth', router); // prefixo geral

    router.post('/login', authController.login);
    router.post('/logout', authController.logout);
}


