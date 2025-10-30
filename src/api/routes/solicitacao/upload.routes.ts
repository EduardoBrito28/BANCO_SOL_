import { Router, Request, Response, NextFunction } from 'express';
import { uploadController } from '../../../controllers/solicitacao/upload.controller';

const router = Router();

// Função utilitária para evitar conflito de tipos
const adapt =
    (middleware: any) =>
        (req: Request, res: Response, next: NextFunction): void => {
            middleware(req, res, next);
        };
export default (app: Router) => {
    app.use('/upload', router); // prefixo geral

    // POST /upload
    router.post(
        '/',
        adapt(uploadController.uploadSingle),
        (req, res) => uploadController.handleUpload(req, res)
    );

    // POST /upload → Upload de ficheiro
    router.post('/', adapt(uploadController.uploadSingle), (req, res) =>
        uploadController.handleUpload(req, res)
    );

    router.get('/request/:solicitacaoId', uploadController.getFilesBySolicitacao);

    // GET /upload/:fileName → Retorna ficheiro
    router.get('/:fileName', (req, res) => uploadController.getFile(req, res));

    // DELETE /upload/:fileName → Apaga ficheiro
    router.delete('/:fileName', (req, res) => uploadController.deleteFile(req, res));
}
