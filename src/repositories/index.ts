// src/repositories/BaseRepository.ts
import {
    Repository,
    FindOneOptions,
    FindManyOptions,
    DeepPartial,
    DeleteResult,
    UpdateResult,
    ObjectLiteral,
    FindOptionsWhere,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export interface PaginationOptions {
    page?: number;
    pageSize?: number;
}

export interface PaginatedResult<T> {
    data: T[];
    pagination: {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

export abstract class BaseRepository<T extends ObjectLiteral> {
    constructor(protected readonly repository: Repository<T>) {}

    // 🔍 MÉTODOS PRINCIPAIS (FLEXÍVEIS)

    // Para queries complexas
    public async findAll(options?: FindManyOptions<T>): Promise<T[]> {
        return await this.repository.find(options);
    }

    // Para queries simples apenas com WHERE
    public async findBy(where: FindOptionsWhere<T> | FindOptionsWhere<T>[]): Promise<T[]> {
        return await this.repository.find({ where });
    }

    public async findOne(options: FindOneOptions<T>): Promise<T | null> {
        return await this.repository.findOne(options);
    }

    public async findOneBy(where: FindOptionsWhere<T>): Promise<T | null> {
        return await this.repository.findOneBy(where);
    }

    public async findById(id: string | number): Promise<T | null> {
        return await this.repository.findOneBy({ id } as any);
    }

    public async findByIds(ids: (string | number)[]): Promise<T[]> {
        return await this.repository.findBy({ id: ids } as any);
    }

    // 💾 CRUD BÁSICO
    public async create(entity: DeepPartial<T>): Promise<T> {
        const newEntity = this.repository.create(entity);
        return await this.repository.save(newEntity);
    }

    public async update(id: string | number, partialEntity: QueryDeepPartialEntity<T>): Promise<UpdateResult> {
        return await this.repository.update(id, partialEntity);
    }

    public async updateBy(where: FindOptionsWhere<T>, partialEntity: QueryDeepPartialEntity<T>): Promise<UpdateResult> {
        return await this.repository.update(where, partialEntity);
    }

    public async save(entity: T): Promise<T> {
        return await this.repository.save(entity);
    }

    public async delete(id: string | number): Promise<DeleteResult> {
        return await this.repository.delete(id);
    }

    public async deleteBy(where: FindOptionsWhere<T>): Promise<DeleteResult> {
        return await this.repository.delete(where);
    }

    // 🗑️ SOFT DELETE
    public async softDelete(id: string | number): Promise<UpdateResult> {
        return await this.repository.softDelete(id);
    }

    public async softDeleteBy(where: FindOptionsWhere<T>): Promise<UpdateResult> {
        return await this.repository.softDelete(where);
    }

    public async restore(id: string | number): Promise<UpdateResult> {
        return await this.repository.restore(id);
    }

    public async restoreBy(where: FindOptionsWhere<T>): Promise<UpdateResult> {
        return await this.repository.restore(where);
    }

    // 📊 PAGINAÇÃO
    public async findWithPagination(
        options: FindManyOptions<T> = {},
        pagination: PaginationOptions = {}
    ): Promise<PaginatedResult<T>> {
        const { page = 1, pageSize = 10 } = pagination;
        const skip = (page - 1) * pageSize;

        const [data, total] = await this.repository.findAndCount({
            ...options,
            skip,
            take: pageSize
        });

        const totalPages = Math.ceil(total / pageSize);

        return {
            data,
            pagination: {
                page,
                pageSize,
                total,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        };
    }

    // 🔢 CONTAGEM E EXISTÊNCIA
    public async count(options?: FindManyOptions<T>): Promise<number> {
        return await this.repository.count(options);
    }

    public async countBy(where: FindOptionsWhere<T>): Promise<number> {
        return await this.repository.countBy(where);
    }

    public async exists(options: FindOneOptions<T>): Promise<boolean> {
        const count = await this.repository.count(options);
        return count > 0;
    }

    public async existsBy(where: FindOptionsWhere<T>): Promise<boolean> {
        const count = await this.repository.countBy(where);
        return count > 0;
    }

    // 🎯 QUERY BUILDER
    public createQueryBuilder(alias?: string) {
        return this.repository.createQueryBuilder(alias);
    }
}
