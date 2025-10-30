import { Router } from "express";
import { ModuloController } from "../../../../controllers/utilizador/modulo.controller";
import { authenticate } from "../../../middlewares/src/middlewares/auth.middleware";

const router = Router();
const controller = new ModuloController();

export default (app: Router) => {
    app.use('/modulo', authenticate, router); // prefixo geral

    router.get("/", controller.listar.bind(controller));
    router.get("/ativos", controller.listarAtivos.bind(controller));
    router.get("/:id", controller.obterPorId.bind(controller));
    router.post("/", controller.criar.bind(controller));
    router.put("/:id", controller.atualizar.bind(controller));
    router.delete("/:id", controller.remover.bind(controller));
}
