
import { CriarUtilizadorDTO, AtualizarUtilizadorDTO, FiltrosUtilizadorDTO } from '../../types/DTO/utilizador/user.dto';
import { Repository, ILike, FindOptionsWhere, In } from 'typeorm';
import bcrypt from 'bcrypt';
import { AppDataSource } from '../../loaders/database';
import { Utilizador } from '../../models/user/Utilizador';

export class UserRepository {
    private repository: Repository<Utilizador>;

    constructor() {
        this.repository = AppDataSource.getRepository(Utilizador);
    }

    // ✅ ENCONTRAR POR EMAIL
    async findByEmail(email: string): Promise<Utilizador | null> {
        return await this.repository.findOne({
            where: { email },
            relations: ['perfil', 'direcao', 'gabinete', 'perfil.permissoes', 'perfil.permissoes.modulo', 'perfil.permissoes.acao']
        });
    }

    // ✅ ENCONTRAR POR ID
    async findById(id: string): Promise<Utilizador | null> {
        return await this.repository.findOne({
            where: { id },
            relations: ['perfil', 'direcao', 'gabinete', 'perfil.permissoes', 'perfil.permissoes.modulo', 'perfil.permissoes.acao']
        });
    }

    // ✅ LISTAR COM FILTROS E PAGINAÇÃO
    async findAll(filtros: FiltrosUtilizadorDTO): Promise<[Utilizador[], number]> {
        const {
            page = 1,
            limit = 10,
            search,
            estado,
            direcaoId,
            gabineteId,
            perfilId,
            sortBy = 'nome',
            sortOrder = 'ASC'
        } = filtros;

        const skip = (page - 1) * limit;

        const queryBuilder = this.repository.createQueryBuilder('utilizador')
            .leftJoinAndSelect('utilizador.perfil', 'perfil')
            .where('1=1');

        // 🔍 Aplicar filtros
        if (search) {
            queryBuilder.andWhere('(utilizador.nome ILIKE :search OR utilizador.email ILIKE :search)', {
                search: `%${search}%`
            });
        }

        if (estado) {
            queryBuilder.andWhere('utilizador.estado = :estado', { estado });
        }

        // Nota: direcaoId e gabineteId não podem ser filtrados diretamente
        // pois Utilizador não tem relação direta com Direcao ou Gabinete
        // Eles podem ser filtrados através do perfil se necessário
        
        // Filtro por direcao através do perfil (se o perfil tiver departamento com direcao)
        if (direcaoId) {
            queryBuilder
                .leftJoin('perfil.departamento', 'departamento')
                .leftJoin('departamento.direcao', 'direcao')
                .andWhere('direcao.id = :direcaoId', { direcaoId });
        }

        // Filtro por gabinete através do perfil
        if (gabineteId) {
            queryBuilder
                .leftJoin('perfil.gabinete', 'gabinete')
                .andWhere('gabinete.id = :gabineteId', { gabineteId });
        }

        if (perfilId) {
            queryBuilder.andWhere('utilizador.perfil.id = :perfilId', { perfilId });
        }

        // 📊 Ordenação
        const order: any = {};
        order[`utilizador.${sortBy}`] = sortOrder.toUpperCase();
        queryBuilder.orderBy(order);

        // 📄 Paginação
        queryBuilder.skip(skip).take(limit);

        return await queryBuilder.getManyAndCount();
    }

    // ✅ CRIAR UTILIZADOR
    async create(userData: CriarUtilizadorDTO): Promise<Utilizador> {
        const utilizador = this.repository.create(userData);
        return await this.repository.save(utilizador);
    }

    // ✅ ATUALIZAR UTILIZADOR
    async update(id: string, userData: AtualizarUtilizadorDTO): Promise<Utilizador | null> {
        await this.repository.update(id, userData);
        return await this.findById(id);
    }

    // ✅ ATUALIZAR SENHA
    async updatePassword(id: string, novaSenhaHash: string, novoSalt: string): Promise<void> {
        await this.repository.update(id, {
            senhaHash: novaSenhaHash,
            saltHash: novoSalt
        });
    }

    // ✅ ATUALIZAR ESTADO
    async updateEstado(id: string, estado: boolean): Promise<void> {
        await this.repository.update(id, {
            estado, updatedAt: new Date()
        });
    }

    // ✅ ATUALIZAR ÚLTIMO LOGIN
    async updateUltimoLogin(id: string): Promise<void> {
        await this.repository.update(id, {
            ultimoLogin: new Date()
        });
    }

    // ✅ VERIFICAR SE EMAIL EXISTE
    async emailExists(email: string, excludeId?: string): Promise<boolean> {
        const where: FindOptionsWhere<Utilizador> = { email };

        if (excludeId) {
            where.id = excludeId as any;
        }

        const count = await this.repository.count({ where });
        return count > 0;
    }


    // ✅ LISTAR POR PERFIL
    async findByPerfil(perfilId: string): Promise<Utilizador[]> {
        return await this.repository.find({
            where: { perfil: { id: perfilId } },
            relations: ['direcao', 'gabinete'],
            order: { nome: 'ASC' }
        });
    }

    // ✅ ELIMINAR UTILIZADOR (soft delete)
    async softDelete(id: string): Promise<void> {
        await this.repository.update(id, {
            estado: false,
            updatedAt: new Date()
        });
    }

    // ✅ ELIMINAR PERMANENTEMENTE
    async hardDelete(id: string): Promise<void> {
        await this.repository.delete(id);
    }

    // ✅ OBTER ESTATÍSTICAS
    async getEstatisticas(): Promise<any> {
        const total = await this.repository.count();
        const porEstado = await this.repository
            .createQueryBuilder('utilizador')
            .select('utilizador.estado', 'estado')
            .addSelect('COUNT(utilizador.id)', 'quantidade')
            .groupBy('utilizador.estado')
            .getRawMany();

        const porDirecao = await this.repository
            .createQueryBuilder('utilizador')
            .leftJoin('utilizador.direcao', 'direcao')
            .select('direcao.nome', 'direcao')
            .addSelect('COUNT(utilizador.id)', 'quantidade')
            .groupBy('direcao.nome')
            .getRawMany();

        return {
            total,
            porEstado,
            porDirecao
        };
    }

    // ✅ VERIFICAR CREDENCIAIS
    async verificarCredenciais(email: string, password: string): Promise<Utilizador | null> {
        const utilizador = await this.findByEmail(email);

        if (!utilizador) {
            return null;
        }

        const isPasswordValid = await bcrypt.compare(password, utilizador.senhaHash);

        if (!isPasswordValid) {
            return null;
        }

        return utilizador;
    }
}
