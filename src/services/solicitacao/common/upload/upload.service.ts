import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { AppDataSource } from '../../../../loaders/database';
import { FileUpload } from '../../../../models/FileUpload';
import { Solicitacao } from '../../../../models/Solicitacao';
import { getLocalIp } from '../../../../utils/getIp/os';

const unlinkAsync = promisify(fs.unlink);
export class UploadService {
    private uploadDir: string;

    constructor(uploadDir = path.resolve(__dirname, '../../uploads')) {
        this.uploadDir = uploadDir;
    }
    public async processFile(file: Express.Multer.File, solicitacaoId: string) {
        if (!file) throw new Error('Nenhum ficheiro enviado');

        const solicitacaoRepo = AppDataSource.getRepository(Solicitacao);
        const fileRepo = AppDataSource.getRepository(FileUpload);

        const solicitacao = await solicitacaoRepo.findOne({ where: { id: solicitacaoId } });
        if (!solicitacao) throw new Error('Solicitação não encontrada');

        const fullPath = path.resolve(file.path);
        if (!fs.existsSync(fullPath)) throw new Error('Erro ao guardar o ficheiro');
        // ⚡ Host dinâmico (usa IP da máquina)
        const localIp = getLocalIp();
        const port = process.env.PORT || 8000;
        const host = `http://${localIp}:${port}`;

        const url = `${host}/uploads/${file.filename}`

        const newFile = fileRepo.create({
            originalName: file.originalname,
            fileName: file.filename,
            mimeType: file.mimetype,
            size: file.size,
            path: fullPath,
            url,
            solicitacao,
        });

        await fileRepo.save(newFile);
        return newFile;
    }

    public async getFilesBySolicitacao(solicitacaoId: string) {
        const solicitacaoRepo = AppDataSource.getRepository(Solicitacao);
        const fileRepo = AppDataSource.getRepository(FileUpload);

        const solicitacao = await solicitacaoRepo.findOne({ where: { id: solicitacaoId } });
        if (!solicitacao) throw new Error('Solicitação não encontrada');
        const files = await fileRepo
            .createQueryBuilder('file')
            .select([
                'file.id',
                'file.originalName',
                'file.fileName',
                'file.url',
                'file.solicitacaoId',
            ])
            .where('file.solicitacaoId = :solicitacaoId', { solicitacaoId })
            .getMany();

        if (files.length === 0) {
            throw new Error('Nenhum ficheiro encontrado para esta solicitação');
        }
        return files;
    }

    public async getFile(fileName: string) {
        const fileRepo = AppDataSource.getRepository(FileUpload);
        const file = await fileRepo.findOne({ where: { fileName } });

        if (!file) throw new Error('Ficheiro não encontrado');

        return file;
    }

    public async deleteFile(fileName: string) {
        const fileRepo = AppDataSource.getRepository(FileUpload);
        const file = await fileRepo.findOne({ where: { fileName } });

        if (!file) throw new Error('Ficheiro não encontrado');

        if (fs.existsSync(file.path)) {
            await unlinkAsync(file.path);
        }

        await fileRepo.remove(file);

        return { message: 'Ficheiro apagado com sucesso' };
    }


}

export const uploadService = new UploadService();
