import { Perfil } from "../../models/user/Perfil";
import { PerfilRepository } from "../../repositories/user/perfil.repository";


export class PerfilService {
  async listar(): Promise<Perfil[]> {
    return PerfilRepository.find({
      relations: ["departamento", "gabinete", "departamento.direcao", "permissoes", "permissoes.modulo", "permissoes.acao"],
      order: { createdAt: "DESC" },
    });
  }

  async buscarPorId(id: string): Promise<Perfil | null> {
    return PerfilRepository.findOne({
      where: { id },
      relations: ["departamento", "gabinete", "departamento.direcao", "permissoes", "permissoes.modulo", "permissoes.acao"],
    });
  }

  async criar(dados: Partial<Perfil>): Promise<Perfil> {
    console.log('Dados recebidos para criar perfil:', dados);
    
    // Buscar entidades relacionadas se IDs forem fornecidos
    const departamentoId = typeof dados.departamento === 'string' ? dados.departamento : dados.departamento?.id;
    const gabineteId = typeof dados.gabinete === 'string' ? dados.gabinete : dados.gabinete?.id;
    
    let departamento = null;
    let gabinete = null;
    
    if (departamentoId) {
      const { DepartamentoRepository } = await import('../../repositories/user/departamento.repository');
      departamento = await DepartamentoRepository.findOne({ where: { id: departamentoId } });
      if (!departamento) {
        throw new Error('Departamento não encontrado');
      }
    }
    
    if (gabineteId) {
      const { GabineteRepository } = await import('../../repositories/user/gabinete.repository');
      gabinete = await GabineteRepository.findOne({ where: { id: gabineteId } });
      if (!gabinete) {
        throw new Error('Gabinete não encontrado');
      }
    }
    
    // Validar que temos pelo menos departamento OU gabinete (mas não ambos ao mesmo tempo)
    if (!departamento && !gabinete) {
      throw new Error('É necessário informar um Departamento OU um Gabinete');
    }
    
    if (departamento && gabinete) {
      throw new Error('Não é possível associar um perfil a um Departamento e um Gabinete simultaneamente');
    }
    
    // Criar o perfil com os dados fornecidos
    const novoPerfilData: Partial<Perfil> = {
      papel: dados.papel,
      descricao: dados.descricao || undefined,
      restricao: dados.restricao || undefined,
      ativo: dados.ativo !== undefined ? dados.ativo : true,
      isAdmin: dados.isAdmin !== undefined ? dados.isAdmin : false,
    };
    
    if (departamento) {
      novoPerfilData.departamento = departamento;
    }
    
    if (gabinete) {
      novoPerfilData.gabinete = gabinete;
    }
    
    const novoPerfil = PerfilRepository.create(novoPerfilData);
    
    return PerfilRepository.save(novoPerfil);
  }

  async atualizar(id: string, dados: Partial<Perfil>): Promise<Perfil> {
    console.log('Dados recebidos para atualizar perfil:', dados);
    
    const perfil = await this.buscarPorId(id);
    if (!perfil) throw new Error("Perfil não encontrado");

    // Buscar entidades relacionadas se IDs forem fornecidos
    const departamentoId = typeof dados.departamento === 'string' ? dados.departamento : dados.departamento?.id;
    const gabineteId = typeof dados.gabinete === 'string' ? dados.gabinete : dados.gabinete?.id;
    
    let departamento = null;
    let gabinete = null;
    
    if (departamentoId) {
      const { DepartamentoRepository } = await import('../../repositories/user/departamento.repository');
      departamento = await DepartamentoRepository.findOne({ where: { id: departamentoId } });
      if (!departamento) {
        throw new Error('Departamento não encontrado');
      }
    }
    
    if (gabineteId) {
      const { GabineteRepository } = await import('../../repositories/user/gabinete.repository');
      gabinete = await GabineteRepository.findOne({ where: { id: gabineteId } });
      if (!gabinete) {
        throw new Error('Gabinete não encontrado');
      }
    }
    
    // Validar que temos pelo menos departamento OU gabinete (mas não ambos ao mesmo tempo)
    if (departamentoId || gabineteId) {
      if (!departamento && !gabinete && (departamentoId || gabineteId)) {
        throw new Error('É necessário informar um Departamento OU um Gabinete válido');
      }
      
      if (departamento && gabinete) {
        throw new Error('Não é possível associar um perfil a um Departamento e um Gabinete simultaneamente');
      }
    }
    
    // Atualizar campos básicos
    if (dados.papel !== undefined) perfil.papel = dados.papel;
    if (dados.descricao !== undefined) {
      perfil.descricao = dados.descricao || (null as any);
    }
    if (dados.restricao !== undefined) {
      perfil.restricao = dados.restricao || (null as any);
    }
    if (dados.ativo !== undefined) perfil.ativo = dados.ativo;
    if (dados.isAdmin !== undefined) perfil.isAdmin = dados.isAdmin;
    
    // Atualizar relacionamentos
    if (departamento) {
      perfil.departamento = departamento;
      perfil.gabinete = undefined as any; // Limpar gabinete quando departamento é definido
    } else if (gabinete) {
      perfil.gabinete = gabinete;
      perfil.departamento = undefined as any; // Limpar departamento quando gabinete é definido
    } else if (departamentoId === null || departamentoId === undefined || departamentoId === '') {
      // Se departamentoId for explicitamente removido, limpar
      if ('departamento' in dados) perfil.departamento = undefined as any;
    } else if (gabineteId === null || gabineteId === undefined || gabineteId === '') {
      // Se gabineteId for explicitamente removido, limpar
      if ('gabinete' in dados) perfil.gabinete = undefined as any;
    }
    
    return PerfilRepository.save(perfil);
  }

  async remover(id: string): Promise<void> {
    const perfil = await this.buscarPorId(id);
    if (!perfil) throw new Error("Perfil não encontrado");
    await PerfilRepository.remove(perfil);
  }

  async obterEstatisticas(): Promise<any> {
    const total = await PerfilRepository.count();
    
    const porEstado = await PerfilRepository
      .createQueryBuilder('perfil')
      .select('perfil.ativo', 'ativo')
      .addSelect('COUNT(perfil.id)', 'quantidade')
      .groupBy('perfil.ativo')
      .getRawMany();

    const porDepartamento = await PerfilRepository
      .createQueryBuilder('perfil')
      .leftJoin('perfil.departamento', 'departamento')
      .leftJoin('departamento.direcao', 'direcao')
      .select('COALESCE(departamento.sigla, departamento.nome, \'Sem Departamento\')', 'departamento')
      .addSelect('COALESCE(direcao.sigla, direcao.nome, \'Sem Direção\')', 'direcao')
      .addSelect('COUNT(perfil.id)', 'quantidade')
      .where('perfil.departamento IS NOT NULL')
      .groupBy('departamento.id, direcao.id, departamento.sigla, departamento.nome, direcao.sigla, direcao.nome')
      .getRawMany();

    const porGabinete = await PerfilRepository
      .createQueryBuilder('perfil')
      .leftJoin('perfil.gabinete', 'gabinete')
      .select('COALESCE(gabinete.sigla, gabinete.nome, \'Sem Gabinete\')', 'gabinete')
      .addSelect('COUNT(perfil.id)', 'quantidade')
      .where('perfil.gabinete IS NOT NULL')
      .groupBy('gabinete.id, gabinete.sigla, gabinete.nome')
      .getRawMany();

    const totalPermissoes = await PerfilRepository
      .createQueryBuilder('perfil')
      .leftJoin('perfil.permissoes', 'permissoes')
      .select('COUNT(DISTINCT permissoes.id)', 'total')
      .getRawOne();

    const funcoesComMaisUtilizadores = await PerfilRepository
      .createQueryBuilder('perfil')
      .leftJoin('perfil.utilizadores', 'utilizador')
      .select('perfil.papel', 'funcao')
      .addSelect('COUNT(utilizador.id)', 'quantidade')
      .groupBy('perfil.id, perfil.papel')
      .orderBy('COUNT(utilizador.id)', 'DESC')
      .limit(5)
      .getRawMany();

    return {
      total,
      porEstado: porEstado.map(item => ({
        estado: item.ativo ? 'Ativo' : 'Inativo',
        quantidade: parseInt(item.quantidade)
      })),
      porDepartamento,
      porGabinete,
      totalPermissoes: parseInt(totalPermissoes?.total || '0'),
      funcoesComMaisUtilizadores: funcoesComMaisUtilizadores.map(item => ({
        funcao: item.funcao,
        quantidade: parseInt(item.quantidade)
      }))
    };
  }
}
