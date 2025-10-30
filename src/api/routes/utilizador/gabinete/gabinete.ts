import { Router } from "express";
import { authenticate } from "../../../middlewares/src/middlewares/auth.middleware";
import { GabineteController } from "../../../../controllers/utilizador/gabinete.controller";

const router = Router();
const controller = new GabineteController();

export default (app: Router) => {
    app.use('/gabinete', router); // prefixo geral
    router.get("/", controller.listar);
    router.get("/:id", controller.buscar);
}
