import { Request, Response } from 'express';
import multer from 'multer';
import { configureStorage } from '../../config/upload';
import { uploadService } from '../../services/solicitacao/common/upload/upload.service';


const upload = multer(configureStorage('../uploads'));

export class UploadController {
    // Middleware de upload
    public uploadSingle = upload.single('file');

    /**
     * POST /upload — Faz upload do ficheiro
     */
    public async handleUpload(req: Request, res: Response) {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'Nenhum ficheiro enviado' });
            }
            const { solicitacaoId } = req.body;
            if (!solicitacaoId) return res.status(400).json({ error: 'solicitacaoId é obrigatório' });

            if (!req.file) return res.status(400).json({ error: 'Nenhum ficheiro enviado' });

            const savedFile = await uploadService.processFile(req.file, solicitacaoId);
            return res.status(201).json({
                message: 'Upload realizado com sucesso!',
                data: savedFile,
            });
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    async getFilesBySolicitacao(req: Request, res: Response) {
        try {
            const { solicitacaoId } = req.params;
            const files = await uploadService.getFilesBySolicitacao(solicitacaoId);
            res.json(files);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    /**
     * GET /upload/:fileName — Retorna o ficheiro (imagem/pdf)
     */
    public async getFile(req: Request, res: Response) {
        try {
            const { fileName } = req.params;
            const fileOrPath = await uploadService.getFile(fileName);

            // If the service returned a string path, send it directly
            if (typeof fileOrPath === 'string') {
                return res.sendFile(fileOrPath);
            }

            // If the service returned an object containing a path property, use that
            if (fileOrPath && typeof (fileOrPath as any).path === 'string') {
                return res.sendFile((fileOrPath as any).path);
            }

            // Could not resolve a file path to send
            return res.status(500).json({ error: 'Invalid file returned by upload service' });
        } catch (error: any) {
            return res.status(404).json({ error: error.message });
        }
    }

    /**
     * DELETE /upload/:fileName — Apaga o ficheiro
     */
    public async deleteFile(req: Request, res: Response) {
        try {
            const { fileName } = req.params;
            const result = await uploadService.deleteFile(fileName);
            return res.status(200).json(result);
        } catch (error: any) {
            return res.status(404).json({ error: error.message });
        }
    }
}

export const uploadController = new UploadController();
