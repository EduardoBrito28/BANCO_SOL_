import path from 'path';
import { diskStorage, FileFilterCallback, StorageEngine } from 'multer';
import { randomBytes } from 'crypto';

export interface MulterConfig {
  dest: string;
  storage: StorageEngine;
  limits: {
    fieldSize: number;
  };
  fileFilter: (
    req: Express.Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => void;
}

export const configureStorage = (customPath: string): MulterConfig => {
  return {
    dest: path.resolve(__dirname, customPath),

    storage: diskStorage({
      destination: (
        req: Express.Request,
        file: Express.Multer.File,
        cb: (error: Error | null, destination: string) => void
      ) => {
        cb(null, path.resolve(__dirname, customPath));
      },

      filename: (
        req: Express.Request,
        file: Express.Multer.File,
        cb: (error: Error | null, filename: string) => void
      ) => {
        randomBytes(16, (err, hash) => {
          if (err) {
            cb(err, file.originalname);
            return;
          }

          const fileName = `${hash.toString('hex')}-${file.originalname}`;
          cb(null, fileName);
        });
      },
    }),

    limits: {
      fieldSize: 2 * 1024 * 1024, // 2MB
    },

    fileFilter: (
      req: Express.Request,
      file: Express.Multer.File,
      cb: FileFilterCallback
    ) => {
      const allowedFormats = [
        'image/jpeg',
        'image/jpg',
        'image/pjpeg',
        'image/png',
        'image/gif',
        'image/svg+xml',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ];

      if (allowedFormats.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Erro no formato do ficheiro'));
      }
    },
  };
};
