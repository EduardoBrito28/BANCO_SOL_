import { FindOneOptions, FindOptionsWhere, } from 'typeorm';
import { Utilizador } from '../models/user/Utilizador';

import bcrypt from 'bcrypt';
import { Direcao } from '../models/user/direcao';
import { Gabinete } from '../models/user/Gabinete';
import { Perfil } from '../models/user/Perfil';
import { AtualizarSenhaDTO, AtualizarUtilizadorDTO, CriarUtilizadorDTO, FiltrosUtilizadorDTO, PerfilLoginMapeado, PermissoesUtilizadorDTO, UtilizadorDTO, UtilizadorListagemDTO } from '../types/DTO/utilizador/user.dto';
import { AppDataSource } from '../loaders/database';

export class UserService {

    private userRepository = AppDataSource.getRepository(Utilizador);
    private direcaoRepository = AppDataSource.getRepository(Direcao);
    private gabineteRepository = AppDataSource.getRepository(Gabinete);
    private perfilRepository = AppDataSource.getRepository(Perfil);

    // ✅ LISTAR TODOS OS UTILIZADORES (método existente)
    public async findAll(): Promise<Utilizador[]> {
        return await this.userRepository.find({
            relations: ['perfil']
        });
    }

    // ✅ ENCONTRAR UM UTILIZADOR (método existente)
    public async findOne(options: FindOneOptions<Utilizador>): Promise<Utilizador | null> {
        return await this.userRepository.findOne({
            ...options,
            relations: ['perfil', 'direcao', 'gabinete', 'perfil.permissoes', 'perfil.permissoes.modulo', 'perfil.permissoes.acao']
        });
    }

    // ✅ LISTAR COM FILTROS E PAGINAÇÃO
    public async listarUtilizadores(filtros: FiltrosUtilizadorDTO): Promise<{ utilizadores: UtilizadorListagemDTO[], pagination: any }> {
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


        const queryBuilder = this.userRepository.createQueryBuilder('utilizador')
            .leftJoinAndSelect('utilizador.perfil', 'perfil')
            .leftJoinAndSelect('utilizador.direcao', 'direcao')
            .leftJoinAndSelect('utilizador.gabinete', 'gabinete')
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

        if (direcaoId) {
            queryBuilder.andWhere('utilizador.direcao.id = :direcaoId', { direcaoId });
        }

        if (gabineteId) {
            queryBuilder.andWhere('utilizador.gabinete.id = :gabineteId', { gabineteId });
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

        const [utilizadores, total] = await queryBuilder.getManyAndCount();

        const utilizadoresDTO = utilizadores.map(user => ({
            id: user.id,
            nome: user.nome,
            email: user.email,
            estado: user.estado || true,
            perfilNome: user.perfil?.papel,
            ultimoLogin: user.ultimoLogin
        }));

        return {
            utilizadores: utilizadoresDTO,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1
            }
        };
    }

    // ✅ OBTER UTILIZADOR POR ID
    public async obterUtilizadorPorId(id: string): Promise<UtilizadorDTO> {
        const utilizador = await this.userRepository.findOne({
            where: { id },
            relations: ['perfil', 'direcao', 'gabinete', 'perfil.permissoes', 'perfil.permissoes.modulo', 'perfil.permissoes.acao']
        });

        if (!utilizador) {
            throw new Error('Utilizador não encontrado');
        }

        return this.mapearParaDTO(utilizador);
    }

    public async findByEmail(email: string) {

        const user = await this.userRepository
            .createQueryBuilder('u')
            .leftJoinAndSelect('u.perfil', 'p')
            .leftJoinAndSelect('p.departamento', 'd')
            .leftJoinAndSelect('d.direcao', 'dr')
            .leftJoinAndSelect('p.permissoes', 'perm')
            .leftJoin('perm.modulo', 'mod')
            .leftJoin('perm.acao', 'acao')
            .leftJoin('acao.modulo', 'acaoModulo') // Join adicional para o módulo da ação
            .addSelect([
                'mod.id',
                'mod.nome',
                'mod.sigla',
                'acao.id',
                'acao.nome',
                'acao.sigla',
                'acaoModulo.id', // Agora você pode acessar o modulo_id da ação
                'acaoModulo.nome'
            ])
            .where('u.email = :email', { email })
            .getOne();


        if (!user) return null;

        // Transformar o formato das permissões
        const permissoesMap = new Map<
            string,
            {
                id: string;
                nome: string;
                sigla: string;
                descricao: string;
                acao: string[];
            }
        >();

        for (const permissao of user.perfil.permissoes || []) {
            const modulo = permissao.modulo;
            if (!modulo) continue;

            if (!permissoesMap.has(modulo.id)) {
                permissoesMap.set(modulo.id, {
                    id: modulo.id,
                    nome: modulo.nome,
                    sigla: modulo.sigla,
                    descricao: modulo.descricao,
                    acao: []
                });
            }

            const moduloItem = permissoesMap.get(modulo.id)!;
            if (permissao.acao?.nome && modulo.id === permissao.acao.modulo?.id) {
                moduloItem.acao.push(permissao.acao.nome);
            }
        }



        // Montar retorno com perfil + permissões dentro dele
        const result = {
            id: user.id,
            nome: user.nome,
            email: user.email,
            telefone: user.telefone,
            estado: user.estado,
            senhaHash: user.senhaHash,
            tipoAdmin: user.superAdmin,
            perfil: {
                ...this.mapPerfilSeguro(user.perfil),
                permissoes: [{ restricao: user.perfil.restricao, acesso: Array.from(permissoesMap.values()) }]
            }
        };

        return result;
    }



    // ✅ CRIAR UTILIZADOR
    // ✅ MÉTODO RECOMENDADO: Mais simples e direto
    public async criarUtilizador(dto: CriarUtilizadorDTO): Promise<UtilizadorDTO> {
        // Verificar se email já existe
        if (await this.emailExists(dto.email)) {
            throw new Error('Já existe um utilizador com este email');
        }
        // Buscar entidades relacionadas
        const [perfil] = await Promise.all([
            dto.perfilId ? this.perfilRepository.findOne({ where: { id: dto.perfilId } }) : Promise.resolve(null),
        ]);
        // Hash da senha
        const salt = await bcrypt.genSalt(12);
        const senhaHash = await bcrypt.hash(dto.senha, salt);
        const utilizador = new Utilizador();

        // Atribuir propriedades básicas
        utilizador.nome = dto.nome;
        utilizador.email = dto.email;
        utilizador.telefone = dto.telefone ?? '';
        utilizador.senhaHash = senhaHash;
        utilizador.saltHash = salt;
        utilizador.estado = dto.estado || true;
        utilizador.avatar = dto.avatar ?? '';



        // Atribuir relações (apenas se existirem)
        if (perfil) utilizador.perfil = perfil;

        // Salvar no banco de dados
        const utilizadorSalvo = await this.userRepository.save(utilizador);

        // Retornar DTO
        return this.mapearParaDTO(utilizadorSalvo);
    }

    // ✅ ATUALIZAR UTILIZADOR
    public async atualizarUtilizador(id: string, dto: AtualizarUtilizadorDTO): Promise<UtilizadorDTO> {
        const utilizadorExistente = await this.userRepository.findOne({ where: { id } });

        if (!utilizadorExistente) {
            throw new Error('Utilizador não encontrado');
        }

        // Verificar se email já existe (excluindo o próprio)
        if (dto.email && await this.emailExists(dto.email, id)) {
            throw new Error('Já existe um utilizador com este email');
        }

        // Buscar entidades relacionadas se fornecidas
        const updateData: any = { ...dto };

        if (dto.direcaoId) {
            updateData.direcao = await this.direcaoRepository.findOne({ where: { id: dto.direcaoId } });
            if (!updateData.direcao) {
                throw new Error('Direção não encontrada');
            }
        }

        if (dto.gabineteId) {
            updateData.gabinete = await this.gabineteRepository.findOne({ where: { id: dto.gabineteId } });
            if (!updateData.gabinete) {
                throw new Error('Gabinete não encontrado');
            }
        }

        if (dto.perfilId) {
            updateData.perfil = await this.perfilRepository.findOne({ where: { id: dto.perfilId } });
            if (!updateData.perfil) {
                throw new Error('Perfil não encontrado');
            }
        }

        await this.userRepository.update(id, updateData);
        const utilizadorAtualizado = await this.obterUtilizadorPorId(id);

        return utilizadorAtualizado;
    }

    // ✅ ATUALIZAR SENHA
    public async atualizarSenha(id: string, dto: AtualizarSenhaDTO): Promise<void> {
        const utilizador = await this.userRepository.findOne({ where: { id } });

        if (!utilizador) {
            throw new Error('Utilizador não encontrado');
        }

        // Verificar senha atual
        const isSenhaAtualValida = await bcrypt.compare(dto.senhaAtual, utilizador.senhaHash);

        if (!isSenhaAtualValida) {
            throw new Error('Senha atual incorreta');
        }

        // Verificar se nova senha é igual à confirmação
        if (dto.novaSenha !== dto.confirmarNovaSenha) {
            throw new Error('A nova senha e a confirmação não coincidem');
        }

        // Gerar novo hash
        const salt = await bcrypt.genSalt(12);
        const novaSenhaHash = await bcrypt.hash(dto.novaSenha, salt);

        await this.userRepository.update(id, {
            senhaHash: novaSenhaHash,
            saltHash: salt,
            updatedAt: new Date()
        });
    }

    // ✅ ATUALIZAR ESTADO
    public async atualizarEstado(id: string, estado: boolean): Promise<UtilizadorDTO> {
        await this.userRepository.update(id, {
            estado,
            updatedAt: new Date()
        });
        return await this.obterUtilizadorPorId(id);
    }

    // ✅ ELIMINAR UTILIZADOR (soft delete)
    public async eliminarUtilizador(id: string): Promise<void> {
        const utilizador = await this.userRepository.findOne({ where: { id } });

        if (!utilizador) {
            throw new Error('Utilizador não encontrado');
        }
        await this.userRepository.update(id, {
            estado: true,
            updatedAt: new Date()
        });
    }

    // ✅ OBTER PERMISSÕES DO UTILIZADOR
    public async obterPermissoesUtilizador(id: string): Promise<PermissoesUtilizadorDTO> {
        const utilizador = await this.userRepository.findOne({
            where: { id },
            relations: ['perfil', 'perfil.permissoes', 'perfil.permissoes.modulo', 'perfil.permissoes.acao']
        });

        if (!utilizador) {
            throw new Error('Utilizador não encontrado');
        }

        // Agrupar ações por módulo
        const permissoesMap = new Map<string, string[]>();

        for (const pp of utilizador.perfil?.permissoes || []) {
            const moduloCodigo = pp.modulo?.sigla;
            const acaoCodigo = pp.acao?.sigla;

            if (!moduloCodigo || !acaoCodigo) continue;

            if (!permissoesMap.has(moduloCodigo)) {
                permissoesMap.set(moduloCodigo, []);
            }

            permissoesMap.get(moduloCodigo)!.push(acaoCodigo);
        }

        // Converter o Map para array final
        const permissoes = Array.from(permissoesMap.entries()).map(([modulo, acoes]) => ({
            modulo,
            acoes
        }));

        // Converter tudo em um array plano de "MODULO.ACAO"
        const permissoesPlanas = permissoes.flatMap(p =>
            p.acoes.map(acao => `${p.modulo.toUpperCase()}.${acao.toUpperCase()}`)
        );

        // Resumo com base nas permissões planas
        const resumo = {
            canViewAllSolicitacoes: permissoesPlanas.includes('SOLICITACOES.VIEW_ALL'),
            canApproveSolicitacoes: permissoesPlanas.includes('SOLICITACOES.APPROVE'),
            canManageUsers: permissoesPlanas.includes('UTILIZADORES.EDIT'),
            canViewReports: permissoesPlanas.some(p => p.startsWith('RELATORIOS.')),
            canManageMaterials: permissoesPlanas.some(p => p.startsWith('MATERIAIS.')),
            canAudit: permissoesPlanas.some(p => p.startsWith('AUDITORIA.')),
            isAdmin: utilizador.superAdmin || false
        };

        return {
            permissoes,
            resumo
        };
    }

    // ✅ ATUALIZAR ÚLTIMO LOGIN
    public async atualizarUltimoLogin(id: string): Promise<void> {
        await this.userRepository.update(id, {
            ultimoLogin: new Date()
        });
    }

    // ✅ LISTAR POR PERFIL
    public async listarPorPerfil(perfilId: string): Promise<UtilizadorListagemDTO[]> {
        const utilizadores = await this.userRepository.find({
            where: { perfil: { id: perfilId } },
            relations: ['direcao', 'gabinete'],
            order: { nome: 'ASC' }
        });

        return utilizadores.map(user => ({
            id: user.id,
            nome: user.nome,
            email: user.email,
            estado: user.estado,
            perfilNome: user.perfil?.papel,
            ultimoLogin: user.ultimoLogin
        }));
    }

    // ✅ OBTER ESTATÍSTICAS
    public async obterEstatisticas(): Promise<any> {
        const total = await this.userRepository.count();
        const porEstado = await this.userRepository
            .createQueryBuilder('utilizador')
            .select('utilizador.estado', 'estado')
            .addSelect('COUNT(utilizador.id)', 'quantidade')
            .groupBy('utilizador.estado')
            .getRawMany();

        const porDirecao = await this.userRepository
            .createQueryBuilder('utilizador')
            .leftJoin('utilizador.direcao', 'direcao')
            .select('direcao.nome', 'direcao')
            .addSelect('COUNT(utilizador.id)', 'quantidade')
            .where('utilizador.direcao IS NOT NULL')
            .groupBy('direcao.nome')
            .getRawMany();

        return {
            total,
            porEstado,
            porDirecao
        };
    }

    // ✅ VERIFICAR SE EMAIL EXISTE
    private async emailExists(email: string, excludeId?: string): Promise<boolean> {
        const where: FindOptionsWhere<Utilizador> = { email };

        if (excludeId) {
            where.id = excludeId as any;
        }

        const count = await this.userRepository.count({ where });
        return count > 0;
    }

    // ✅ MÉTODO PRIVADO: MAPEAR PARA DTO
    private mapearParaDTO(utilizador: Utilizador): UtilizadorDTO {
        return {
            id: utilizador.id,
            nome: utilizador.nome,
            email: utilizador.email,
            telefone: utilizador.telefone,
            estado: utilizador.estado,
            tipoAdmin: utilizador.superAdmin,
            avatar: utilizador.avatar,
            ultimoLogin: utilizador.ultimoLogin,
            emailVerificado: utilizador.emailVerificado,
            createdAt: utilizador.createdAt,
            updatedAt: utilizador.createdAt,
            perfil: this.mapPerfilSeguro(utilizador.perfil)
        };
    }

    private mapPerfilSeguro(perfil: any): PerfilLoginMapeado {
        try {
            // Validação básica do objeto
            if (!perfil || typeof perfil !== 'object') {
                throw new Error('Perfil inválido');
            }

            const departamento = perfil.departamento;
            const direcao = departamento?.direcao;

            return {
                id: perfil.id || '',
                papel: perfil.papel || '',
                descricao: perfil.descricao || '',
                ativo: Boolean(perfil.ativo),
                isAdmin: Boolean(perfil.isAdmin),
                createdAt: perfil.createdAt || new Date().toISOString(),
                updatedAt: perfil.updatedAt || new Date().toISOString(),
                nomeDepartamento: departamento?.nome || 'N/A',
                siglaDepartamento: departamento?.sigla || 'N/A',
                nomeDirecao: direcao?.nome || 'N/A',
                siglaDirecao: direcao?.sigla || 'N/A'
            };
        } catch (error) {
            console.error('Erro ao mapear perfil:', error);
            // Retorna um objeto padrão em caso de erro
            return {
                id: '',
                papel: '',
                descricao: '',
                ativo: false,
                isAdmin: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                nomeDepartamento: 'N/A',
                siglaDepartamento: 'N/A',
                nomeDirecao: 'N/A',
                siglaDirecao: 'N/A'
            };
        }

    }
}

export default UserService;
