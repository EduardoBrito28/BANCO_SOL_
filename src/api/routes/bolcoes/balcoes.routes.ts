import { Router } from 'express';
import { BalcoesController } from '../../../controllers/Balcoes.controller';


const controller = new BalcoesController();
const router = Router();

export default (app: Router) => {

    app.use('/balcoes', router); // prefixo geral

    router.get('/', controller.getAll.bind(controller));
    router.get('/:id', controller.getById.bind(controller));
    router.get('/code/:code_referencia', controller.getByCodeReferencia.bind(controller));
    router.post('/', controller.create.bind(controller));
    router.put('/:id', controller.update.bind(controller));
    router.delete('/:id', controller.delete.bind(controller));

}
