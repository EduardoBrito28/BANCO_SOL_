import { Router } from "express";
import { DepartamentoController } from "../../../../controllers/utilizador/departamento.controller";
import { authenticate } from "../../../middlewares/src/middlewares/auth.middleware";

const router = Router();
const controller = new DepartamentoController();

export default (app: Router) => {
    app.use('/departamento', authenticate, router); // prefixo geral
    router.get("/", controller.listar);
    router.get("/:id", controller.buscar);
    router.post("/", controller.criar);
    router.put("/:id", controller.atualizar);
    router.delete("/:id", controller.remover);
}



