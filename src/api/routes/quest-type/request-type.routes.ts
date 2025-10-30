import { Router } from 'express';
import { QuestTypeController } from '../../../controllers/solicitacao/request-type.controller';


const controller = new QuestTypeController();
const router = Router();

export default (app: Router) => {

    app.use('/request-type', router); // prefixo geral

    router.get('/', controller.getAll.bind(controller));
    router.get('/:id', controller.getById.bind(controller));
}
