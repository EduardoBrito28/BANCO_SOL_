import { Router } from "express";

import { authenticate } from "../../../middlewares/src/middlewares/auth.middleware";
import { PerfilController } from "../../../../controllers/utilizador/perfil.controller";

const router = Router();
const controller = new PerfilController();

export default (app: Router) => {
    app.use('/perfil', authenticate, router); // prefixo geral
    router.get("/", controller.listar);
    router.get("/:id", controller.buscar);
    router.post("/", controller.criar);
    router.put("/:id", controller.atualizar);
    router.delete("/:id", controller.remover);
}

