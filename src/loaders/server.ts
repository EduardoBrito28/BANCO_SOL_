import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errors, isCelebrateError, CelebrateError } from 'celebrate';
import routes from '../api/routes';

import dotenv from "dotenv";
import path from "path";

dotenv.config();

export default (app: express.Application) => {
    // 🧠 Configurações básicas
    app.enable('trust proxy');
    app.use(cors());
    app.use(helmet());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // 🚀 Rotas principais
    app.use('/api/v1', routes);


    app.use(express.json());
    app.use(cors());
    app.use(
        "/uploads",
        express.static(path.resolve(__dirname, "../uploads"))
    );
    app.use(express.urlencoded({ extended: false }));

    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
        // Erro JWT (Unauthorized)
        if (err.name === 'UnauthorizedError' && err.status) {
            return res.status(err.status).json({ message: err.message });
        }

        // Erro do Celebrate (validação)
        if (isCelebrateError(err)) {
            const details: Record<string, any> = {};
            err.details.forEach((detail, key) => {
                details[key] = detail.details.map((d) => d.message);
            });

            return res.status(422).json({
                message: 'Erro de validação',
                details,
            });
        }

        next(err);
    });

    // 🧱 Middleware final de erro (global)
    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
        console.error('❌ Erro interno:', err);

        const statusCode = err.status || 500;
        const message = err.message || 'Erro interno do servidor';

        res.status(statusCode).json({
            errors: { message },
        });
    });

    // 🧹 Tratamento dos erros do Celebrate (deve vir no fim)
    app.use(errors());
};
