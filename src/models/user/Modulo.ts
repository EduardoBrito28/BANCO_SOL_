import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany, ManyToOne, Index, JoinColumn } from 'typeorm';
import { Acao } from './Acao';
import { PerfilPermissao } from './PerfilPermissao';
import { Departamento } from './Departamento'; // Assumindo que Departamento foi criado
import { Utilizador } from './Utilizador'; // Para auditoria

@Entity('modulo')
@Index(['sigla'], { unique: true }) // Garante unicidade do código
export class Modulo {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 150 })
    nome: string;

    @Column({ length: 50, unique: true })
    sigla: string; // Ex.: 'SOLICITACOES', 'UTILIZADORES', 'RELATORIOS', 'CONFIGURACOES', 'INVENTARIO', 'SUPORTE'

    @Column({ length: 255, nullable: true })
    descricao: string;

    @Column({ length: 50, nullable: true })
    icone: string;

    @Column({ default: true })
    ativo: boolean;

    @Column({ default: 0 })
    ordem: number;

    @ManyToOne(() => Departamento, { nullable: true })
    @JoinColumn({ name: "departamentoId" })
    departamento: Departamento;



    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' }) // Corrigido para UpdateDateColumn
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at' }) // Adicionado soft delete
    deletedAt?: Date;

    // Hierarquia de módulos
    @Column({ nullable: true })
    parentId?: string;

    @ManyToOne(() => Modulo, { nullable: true, onDelete: 'SET NULL' })
    parent?: Modulo;

    @OneToMany(() => Modulo, (child) => child.parent)
    children?: Modulo[];

    // Auditoria
    @ManyToOne(() => Utilizador, { nullable: true })
    createdBy?: Utilizador;

    @ManyToOne(() => Utilizador, { nullable: true })
    updatedBy?: Utilizador;

    // Relacionamentos
    @OneToMany(() => Acao, (acao) => acao.modulo)
    acoes: Acao[];

    @OneToMany(() => PerfilPermissao, (pp) => pp.modulo)
    perfilPermissoes: PerfilPermissao[];
}
