import { AppDataSource } from '../../loaders/database';
import { AprovacaoSolicitacao } from '../../models/AprovacaoSolicitacao';
import { CampoSolicitacao, TipoCampo } from '../../models/CampoSolicitacao';
import { MaterialSolicitacao } from '../../models/MaterialSolicitacao';
import { Solicitacao } from '../../models/Solicitacao';
import { TipoSolicitacao } from '../../models/TipoSolicitacao';
import { Utilizador } from '../../models/user/Utilizador';
import { ValorSolicitacao } from '../../models/ValorSolicitacao';
import { CampoValorInputDTO, CriarSolicitacaoDTO, MaterialSolicitacaoDTO, SolicitacaoDTO } from '../../types/DTO/solicitacao';
import { SolicitacaoUpdateService } from './common/update';
import { SolicitacaoPorDirecaoService } from './common/list/getByDirecao';

export class SolicitacaoService {
    private solicitacaoRepo = AppDataSource.getRepository(Solicitacao);
    private tipoSolicitacaoRepo = AppDataSource.getRepository(TipoSolicitacao);
    private campoSolicitacaoRepo = AppDataSource.getRepository(CampoSolicitacao);
    private valorSolicitacaoRepo = AppDataSource.getRepository(ValorSolicitacao);
    private materialSolicitacaoRepo = AppDataSource.getRepository(MaterialSolicitacao);
    private Aprovacao = AppDataSource.getRepository(AprovacaoSolicitacao);


    private updateService: SolicitacaoUpdateService;
    private obterorDirecaoService: SolicitacaoPorDirecaoService

    constructor() {
        this.updateService = new SolicitacaoUpdateService();
    }


    async criarSolicitacao(dto: CriarSolicitacaoDTO): Promise<string> {
        // Verificar se o tipo existe
        const tipo = await this.tipoSolicitacaoRepo.findOne({
            where: { id: dto.tipoSolicitacaoId }
        });

        if (!tipo) {
            throw new Error('Tipo de solicitação não encontrado');
        }

        // Buscar campos existentes (agora já inclui os novos)
        const existeSolicitacao = await this.solicitacaoRepo.findOne({
            where: { numeroPedido: dto.numeroPedido }
        });



        if (existeSolicitacao) {
            throw new Error('O número de pedido não pode ser igual');
        }
        // Criar solicitação
        const solicitacao = new Solicitacao();
        solicitacao.tipoSolicitacaoId = dto.tipoSolicitacaoId;
        solicitacao.numeroPedido = dto.numeroPedido ?? '';
        // Validar o campo enviadoPor
        if (!dto.enviadoPor) {
            throw new Error('O campo enviadoPor é obrigatório.');
        }
        solicitacao.createdBy = { id: dto.enviadoPor } as Utilizador;
        solicitacao.tipoEnvio = dto.tipoEnvio;
        solicitacao.observacoes = dto.observacoes ?? '';
        solicitacao.codeBalcao = dto.codeBalcao && dto.codeBalcao.trim() !== '' ? dto.codeBalcao : null;


        await this.solicitacaoRepo.save(solicitacao);
        // ✅ CADASTRAR CAMPOS DINAMICAMENTE conforme chegam na requisição
        await this.cadastrarCamposDinamicamente(dto.tipoSolicitacaoId, dto.campos);

        // Buscar campos existentes (agora já inclui os novos)
        const campos = await this.campoSolicitacaoRepo.find({
            where: { tipoSolicitacaoId: dto.tipoSolicitacaoId }
        });

        // Criar valores dos campos
        for (const campoInput of dto.campos) {
            const campo = campos.find(c => c.nomeCampo === campoInput.nomeCampo);

            if (!campo) {
                console.error(`❌ Campo ainda não encontrado após cadastro: ${campoInput.nomeCampo}`);
                continue;
            }

            const valor = new ValorSolicitacao();
            valor.solicitacaoId = solicitacao.id;
            valor.campoSolicitacaoId = campo.id;

            // Definir valor baseado no tipo
            switch (campo.tipoCampo) {
                case 'texto':
                case 'opcoes':
                    valor.valorTexto = campoInput.valor !== undefined && campoInput.valor !== null ? campoInput.valor.toString() : null;
                    break;

                case 'numero':
                    if (campoInput.valor !== undefined && campoInput.valor !== null && campoInput.valor !== '') {
                        const numero = Number(campoInput.valor);
                        if (!isNaN(numero)) {
                            valor.valorNumero = numero;
                        }
                    }
                    break;

                case 'data':
                    if (campoInput.valor) {
                        const data = new Date(campoInput.valor);
                        if (!isNaN(data.getTime())) {
                            valor.valorData = data;
                        }
                    }
                    break;

                case 'boolean':
                    if (campoInput.valor !== undefined && campoInput.valor !== null) {
                        valor.valorBoolean = this.parseBoolean(campoInput.valor);
                    }
                    break;
            }

            console.log(`💾 Salvando valor para campo: ${campo.nomeCampo}`, {
                tipo: campo.tipoCampo,
                valorInput: campoInput.valor,
                valorSalvo: valor.valor
            });

            await this.valorSolicitacaoRepo.save(valor);
        }

        // Criar materiais
        for (const materialDto of dto.materiais) {
            const material = new MaterialSolicitacao();
            material.solicitacaoId = solicitacao.id;
            material.descricao = materialDto.descricao;
            material.quantidade = materialDto.quantidade;
            material.pn = materialDto.pn ?? '';
            material.marca = materialDto.marca ?? '';
            material.modelo = materialDto.modelo ?? '';
            material.estado = materialDto.estado ?? '';;
            material.proveniencia = materialDto.proveniencia ?? '';
            material.destino = materialDto.destino ?? '';
            await this.materialSolicitacaoRepo.save(material);
        }
        return await solicitacao.id;
    }


    async atualizarSolicitacao(id: string, updateData: {
        numeroPedido?: string;
        observacoes?: string;
        campos: CampoValorInputDTO[];
        materiais: MaterialSolicitacaoDTO[];
    }): Promise<string> {
        return await this.updateService.atualizarSolicitacao(id, updateData);
    }


    async listarPorDirecao(direcao: string, page: number, limit: number): Promise<any> {
        return await this.obterorDirecaoService.obterSolicitacaoPorDirecao(direcao, page, limit);
    }



    async obterSolicitacoesPorTipo(tipoSolicitacaoId: string, page: number = 1, limit: number = 10): Promise<any> {
        const skip = (page - 1) * limit;

        const [solicitacoes, total] = await this.solicitacaoRepo.findAndCount({
            where: { tipoSolicitacaoId },
            relations: ['tipoSolicitacao', 'materiais'],
            skip,
            take: limit
        });

        return {
            solicitacoes: solicitacoes.map(s => ({
                id: s.id,
                numeroPedido: s.numeroPedido,
                tipoSolicitacaoId: s.tipoSolicitacaoId,
                tipoSolicitacaoNome: s.tipoSolicitacao.nome,
                totalMateriais: s.materiais.length
            })),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    }
    // ✅ ADICIONAR MATERIAL
    async adicionarMaterial(solicitacaoId: string, materialDto: MaterialSolicitacaoDTO): Promise<MaterialSolicitacaoDTO> {
        const solicitacao = await this.solicitacaoRepo.findOne({ where: { id: solicitacaoId } });

        if (!solicitacao) {
            throw new Error('Solicitação não encontrada');
        }

        const material = new MaterialSolicitacao();
        material.solicitacaoId = solicitacaoId;
        material.descricao = materialDto.descricao;
        material.quantidade = materialDto.quantidade;
        material.pn = materialDto.pn ?? '';
        material.marca = materialDto.marca ?? '';;
        material.modelo = materialDto.modelo ?? '';;
        material.estado = materialDto.estado ?? '';;
        material.proveniencia = materialDto.proveniencia ?? '';;
        material.destino = materialDto.destino ?? '';

        await this.materialSolicitacaoRepo.save(material);

        return {
            id: material.id,
            descricao: material.descricao,
            quantidade: material.quantidade,
            pn: material.pn,
            marca: material.marca,
            modelo: material.modelo,
            estado: material.estado,
            proveniencia: material.proveniencia,
            destino: material.destino,
        };
    }

    // ✅ REMOVER MATERIAL
    async removerMaterial(solicitacaoId: string, materialId: string): Promise<void> {
        const material = await this.materialSolicitacaoRepo.findOne({
            where: { id: materialId, solicitacaoId }
        });

        if (!material) {
            throw new Error('Material não encontrado');
        }

        await this.materialSolicitacaoRepo.remove(material);
    }


    // ✅ EXCLUIR SOLICITAÇÃO
    async excluirSolicitacao(id: string): Promise<void> {
        const solicitacao = await this.solicitacaoRepo.findOne({ where: { id } });

        if (!solicitacao) {
            throw new Error('Solicitação não encontrada');
        }

        await this.solicitacaoRepo.remove(solicitacao);
    }

    private async cadastrarCamposDinamicamente(tipoSolicitacaoId: string, camposInput: CampoValorInputDTO[]): Promise<void> {
        console.log('🔄 Cadastrando campos dinamicamente...');

        for (const campoInput of camposInput) {
            // Verificar se o campo já existe
            const campoExistente = await this.campoSolicitacaoRepo.findOne({
                where: {
                    tipoSolicitacaoId: tipoSolicitacaoId,
                    nomeCampo: campoInput.nomeCampo
                }
            });

            if (!campoExistente) {
                console.log(`➕ Criando novo campo: ${campoInput.nomeCampo}`);

                // ✅ DETECTAR AUTOMATICAMENTE o tipo do campo pelo valor
                const tipoCampo = this.detectarTipoCampo(campoInput.valor);

                const novoCampo = new CampoSolicitacao();
                novoCampo.tipoSolicitacaoId = tipoSolicitacaoId;
                novoCampo.nomeCampo = campoInput.nomeCampo;
                novoCampo.tipoCampo = tipoCampo;
                novoCampo.obrigatorio = false; // Por padrão não é obrigatório
                novoCampo.ordem = await this.obterProximaOrdem(tipoSolicitacaoId);
                novoCampo.opcoes = this.obterOpcoesPadrao(campoInput.nomeCampo) ?? [];

                await this.campoSolicitacaoRepo.save(novoCampo);
                console.log(`✅ Campo criado: ${campoInput.nomeCampo} (${tipoCampo})`);
            }
        }
    }

    private detectarTipoCampo(valor: any): TipoCampo {
        if (valor === undefined || valor === null) {
            return TipoCampo.TEXTO; // Tipo padrão para valores vazios
        }

        // Verificar se é boolean
        if (typeof valor === 'boolean') {
            return TipoCampo.BOOLEAN;
        }

        // Verificar se é número
        if (typeof valor === 'number') {
            return TipoCampo.NUMERO;
        }

        // Verificar se string pode ser convertida para número
        if (typeof valor === 'string') {
            // Tentar detectar data (formato YYYY-MM-DD)
            const dataRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (dataRegex.test(valor)) {
                return TipoCampo.DATA;
            }

            // Tentar detectar número
            if (!isNaN(Number(valor)) && valor.trim() !== '') {
                return TipoCampo.NUMERO;
            }

            // Verificar se é boolean em string
            const lowerValor = valor.toLowerCase();
            if (lowerValor === 'true' || lowerValor === 'false' || lowerValor === 'sim' || lowerValor === 'nao') {
                return TipoCampo.BOOLEAN;
            }
        }

        // Verificar se é uma data válida
        if (valor instanceof Date) {
            return TipoCampo.DATA;
        }

        // Padrão: texto
        return TipoCampo.TEXTO;
    }

    private obterOpcoesPadrao(nomeCampo: string): string[] | undefined {
        const opcoesPadrao: { [key: string]: string[] } = {
            'garantia': ['sim', 'nao'],
            'tarefa_terminada': ['sim', 'nao'],
            'cofre': ['sim', 'nao'],
            'tipo_usuario': ['interno', 'externo'],
            'periodo_uso': ['laboral', 'pos_laboral', 'ambos'],
            'finalidade_acesso': ['criacao_conta', 'alteracao_conta', 'renovacao', 'reset_password'],
            'tipo_movimentacao': ['entrada', 'saida']
        };

        return opcoesPadrao[nomeCampo];
    }

    private async obterProximaOrdem(tipoSolicitacaoId: string): Promise<number> {
        const ultimoCampo = await this.campoSolicitacaoRepo.findOne({
            where: { tipoSolicitacaoId },
            order: { ordem: 'DESC' }
        });

        return ultimoCampo ? ultimoCampo.ordem + 1 : 1;
    }

    private parseBoolean(valor: any): boolean {
        if (typeof valor === 'boolean') return valor;
        if (typeof valor === 'number') return valor === 1;
        if (typeof valor === 'string') {
            const str = valor.toLowerCase().trim();
            return str === 'true' || str === '1' || str === 'sim' || str === 'yes';
        }
        return Boolean(valor);
    }

    async obterEstatisticas(): Promise<any> {
        const total = await this.solicitacaoRepo.count();
        
        const solicitacoesFeitas = total; // Total de solicitações criadas
        
        const solicitacoesRecebidas = await this.solicitacaoRepo.count({
            where: [
                { isAdminDestino: true },
                { isDirectorDestino: true },
                { isDirecaoDestino: true }
            ]
        });

        const porStatus = await this.solicitacaoRepo
            .createQueryBuilder('solicitacao')
            .select('CASE WHEN solicitacao.is_concluida = true THEN \'Concluída\' ELSE \'Pendente\' END', 'status')
            .addSelect('COUNT(solicitacao.id)', 'quantidade')
            .groupBy('solicitacao.is_concluida')
            .getRawMany();

        const porTipo = await this.solicitacaoRepo
            .createQueryBuilder('solicitacao')
            .leftJoin('solicitacao.tipoSolicitacao', 'tipo')
            .select('COALESCE(tipo.nome, \'Sem Tipo\')', 'tipo')
            .addSelect('COUNT(solicitacao.id)', 'quantidade')
            .groupBy('tipo.id, tipo.nome')
            .orderBy('COUNT(solicitacao.id)', 'DESC')
            .limit(5)
            .getRawMany();

        const recebidasPorDestino = await this.solicitacaoRepo
            .createQueryBuilder('solicitacao')
            .select('CASE WHEN solicitacao.is_admin_destino = true THEN \'Administrador\' WHEN solicitacao.is_director_destino = true THEN \'Diretor\' WHEN solicitacao.is_direcao_destino = true THEN \'Direção\' ELSE \'Outro\' END', 'destino')
            .addSelect('COUNT(solicitacao.id)', 'quantidade')
            .where('solicitacao.is_admin_destino = true OR solicitacao.is_director_destino = true OR solicitacao.is_direcao_destino = true')
            .groupBy('solicitacao.is_admin_destino, solicitacao.is_director_destino, solicitacao.is_direcao_destino')
            .getRawMany();

        // Solicitações dos últimos 30 dias por dia
        const dataLimite = new Date();
        dataLimite.setDate(dataLimite.getDate() - 30);
        
        const porDia = await this.solicitacaoRepo
            .createQueryBuilder('solicitacao')
            .select('DATE(solicitacao.created_at)', 'dia')
            .addSelect('COUNT(solicitacao.id)', 'quantidade')
            .where('solicitacao.created_at >= :dataLimite', { dataLimite })
            .groupBy('DATE(solicitacao.created_at)')
            .orderBy('DATE(solicitacao.created_at)', 'ASC')
            .getRawMany();

        return {
            total: solicitacoesFeitas,
            solicitacoesFeitas,
            solicitacoesRecebidas,
            porStatus: porStatus.map(item => ({
                status: item.status,
                quantidade: parseInt(item.quantidade)
            })),
            porTipo: porTipo.map(item => ({
                tipo: item.tipo,
                quantidade: parseInt(item.quantidade)
            })),
            recebidasPorDestino: recebidasPorDestino.map(item => ({
                destino: item.destino,
                quantidade: parseInt(item.quantidade)
            })),
            porDia: porDia.map(item => ({
                dia: item.dia,
                quantidade: parseInt(item.quantidade)
            }))
        };
    }

}
