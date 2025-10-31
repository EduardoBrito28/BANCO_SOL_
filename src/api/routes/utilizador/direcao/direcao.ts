import { Router } from "express";
import { authenticate } from "../../../middlewares/src/middlewares/auth.middleware";
import { DirecaoController } from "../../../../controllers/utilizador/direcao.controller";

const router = Router();
const controller = new DirecaoController();

export default (app: Router) => {
    app.use('/direcao', authenticate, router); // prefixo geral
    router.get("/", controller.listar);
    router.get("/:id", controller.buscar);
}

