import { Request, Response } from 'express';
import { Service, Inject } from 'typedi';
import UserService from '../services/users';
import { AtualizarSenhaDTO, AtualizarUtilizadorDTO, CriarUtilizadorDTO, FiltrosUtilizadorDTO } from '../types/DTO/utilizador/user.dto';
import { AppError } from '../Exception/AppError';



export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }
    // ✅ LISTAR UTILIZADORES
    listarUtilizadores = async (req: Request, res: Response) => {
        try {
            const filtros: FiltrosUtilizadorDTO = {
                page: parseInt(req.query.page as string) || 1,
                limit: parseInt(req.query.limit as string) || 10,
                search: req.query.search as string,
                estado: req.query.estado as any,
                direcaoId: req.query.direcaoId as string,
                gabineteId: req.query.gabineteId as string,
                perfilId: req.query.perfilId as string,
                sortBy: req.query.sortBy as string || 'nome',
                sortOrder: (req.query.sortOrder as 'ASC' | 'DESC') || 'ASC'
            };



            const resultado = await this.userService.listarUtilizadores(filtros);
            console.log('Filtros recebidos:', resultado);
            res.json({
                success: true,
                data: resultado.utilizadores,
                pagination: resultado.pagination
            });

        } catch (error) {
            console.error('Erro ao listar utilizadores:', error);
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Erro interno do servidor'
            });
        }
    }

    // ✅ OBTER UTILIZADOR POR ID
    obterUtilizador = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const utilizador = await this.userService.obterUtilizadorPorId(id);

            res.json({
                success: true,
                data: utilizador
            });

        } catch (error) {
            if (error instanceof AppError) {
                console.error(`[${error.statusCode}] ${error.message}`);
            } else {
                res.status(500).json({
                    success: false,
                    error: error instanceof Error ? error.message : 'Erro interno do servidor'
                });
            }
        }
    }

    // ✅ CRIAR UTILIZADOR
    criarUtilizador = async (req: Request, res: Response) => {
        try {
            const dto: CriarUtilizadorDTO = req.body;
            const utilizador = await this.userService.criarUtilizador(dto);

            res.status(201).json({
                success: true,
                data: utilizador,
                message: 'Utilizador criado com sucesso'
            });

        } catch (error) {
            console.error('Erro ao criar utilizador:', error);
            res.status(400).json({
                success: false,
                error: error instanceof Error ? error.message : 'Erro ao criar utilizador'
            });
        }
    }

    // ✅ ATUALIZAR UTILIZADOR
    atualizarUtilizador = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const dto: AtualizarUtilizadorDTO = req.body;
            const utilizador = await this.userService.atualizarUtilizador(id, dto);

            res.json({
                success: true,
                data: utilizador,
                message: 'Utilizador atualizado com sucesso'
            });

        } catch (error) {
            console.error('Erro ao atualizar utilizador:', error);
            res.status(400).json({
                success: false,
                error: error instanceof Error ? error.message : 'Erro ao atualizar utilizador'
            });
        }
    }

    // ✅ ATUALIZAR SENHA
    atualizarSenha = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const dto: AtualizarSenhaDTO = req.body;
            await this.userService.atualizarSenha(id, dto);

            res.json({
                success: true,
                message: 'Senha atualizada com sucesso'
            });

        } catch (error) {
            console.error('Erro ao atualizar senha:', error);
            res.status(400).json({
                success: false,
                error: error instanceof Error ? error.message : 'Erro ao atualizar senha'
            });
        }
    }

    // ✅ ATUALIZAR ESTADO
    atualizarEstado = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { estado } = req.body;
            const utilizador = await this.userService.atualizarEstado(id, estado);

            res.json({
                success: true,
                data: utilizador,
                message: `Estado alterado para ${estado}`
            });

        } catch (error) {
            console.error('Erro ao atualizar estado:', error);
            res.status(400).json({
                success: false,
                error: error instanceof Error ? error.message : 'Erro ao atualizar estado'
            });
        }
    }

    // ✅ ELIMINAR UTILIZADOR
    eliminarUtilizador = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            await this.userService.eliminarUtilizador(id);

            res.json({
                success: true,
                message: 'Utilizador eliminado com sucesso'
            });

        } catch (error) {
            console.error('Erro ao eliminar utilizador:', error);
            res.status(400).json({
                success: false,
                error: error instanceof Error ? error.message : 'Erro ao eliminar utilizador'
            });
        }
    }

    // ✅ OBTER PERMISSÕES
    obterPermissoes = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const permissoes = await this.userService.obterPermissoesUtilizador(id);

            res.json({
                success: true,
                data: permissoes
            });

        } catch (error) {
            console.error('Erro ao obter permissões:', error);
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Erro interno do servidor'
            });
        }
    }

    // ✅ OBTER ESTATÍSTICAS
    obterEstatisticas = async (req: Request, res: Response) => {
        try {
            const estatisticas = await this.userService.obterEstatisticas();

            res.json({
                success: true,
                data: estatisticas
            });

        } catch (error) {
            console.error('Erro ao obter estatísticas:', error);
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Erro interno do servidor'
            });
        }
    }
    // ✅ OBTER PERFIL DO UTILIZADOR AUTENTICADO
    obterMeuPerfil = async (req: Request, res: Response) => {
        try {
            // Supondo que o ID do utilizador está no req.user após autenticação
            const userId = (req as any).user?.id;
            console.log(req.body);
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    error: 'Utilizador não autenticado'
                });
            }

            const utilizador = await this.userService.obterUtilizadorPorId(userId);
            const permissoes = await this.userService.obterPermissoesUtilizador(userId);

            res.json({
                success: true,
                data: {
                    utilizador,
                    permissoes
                }
            });

        } catch (error) {
            console.error('Erro ao obter perfil:', error);
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Erro interno do servidor'
            });
        }
    }

    obterPorDirecao = async (req: Request, res: Response) => {
        try {
            // Supondo que o ID do utilizador está no req.user após autenticação
            const { direcao } = req.params;

            if (!direcao) {
                return res.status(401).json({
                    success: false,
                    error: 'Não foi achado nenhum direção a sociado'
                });
            }

            const utilizador = await this.userService.findByDirecao(direcao);
            res.json({
                success: true,
                data: {
                    utilizador,
                }
            });
        } catch (error) {
            console.error('Erro ao obter a direção:', error);
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Erro interno do servidor'
            });
        }
    }

    obterPorDepartamento = async (req: Request, res: Response) => {
        try {
            // Supondo que o ID do utilizador está no req.user após autenticação
            const { departamento } = req.params;

            if (!departamento) {
                return res.status(401).json({
                    success: false,
                    error: 'Não foi achado nenhum Departamento associado'
                });
            }

            const utilizador = await this.userService.findByDepartamento(departamento);
            res.json({
                success: true,
                data: {
                    utilizador,
                }
            });
        } catch (error) {
            console.error('Erro ao obter Departamento:', error);
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Erro interno do servidor'
            });
        }
    }
}

export default UserController;
