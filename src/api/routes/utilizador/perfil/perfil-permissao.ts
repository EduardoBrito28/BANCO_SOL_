import { Router } from "express";
import { authenticate } from "../../../middlewares/src/middlewares/auth.middleware";
import { PerfilPermissaoController } from "../../../../controllers/utilizador/permissao-perfil.controller";

const router = Router();
const controller = new PerfilPermissaoController();

export default (app: Router) => {
    app.use('/permissao', authenticate, router); // prefixo geral
    router.get("/", controller.listar);
    router.get("/:perfilId", controller.listarPorPerfil);
    router.post("/", controller.criar);
    router.delete("/:id", controller.remover);
}

