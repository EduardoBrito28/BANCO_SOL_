import { Router } from "express";
import { AcaoController } from "../../../../controllers/utilizador/acao.controller";
import { authenticate } from "../../../middlewares/src/middlewares/auth.middleware";

const router = Router();
const controller = new AcaoController();

export default (app: Router) => {
    app.use('/acao', authenticate, router); // prefixo geral

    router.get("/", controller.listar.bind(controller));
    router.get("/ativos", controller.listarAtivos.bind(controller));
    router.get("/:id", controller.obterPorId.bind(controller));
    router.post("/", controller.criar.bind(controller));
    router.put("/:id", controller.atualizar.bind(controller));
    router.delete("/:id", controller.remover.bind(controller));
}
