import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, JoinColumn } from 'typeorm';
import { Modulo } from './Modulo';
import { PerfilPermissao } from './PerfilPermissao';

@Entity('acao')
export class Acao {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 100 })
    nome: string; // Ex: CRIAR, EDITAR, APROVAR, REMOVER, VISUALIZAR

    @Column({ length: 255, nullable: true })
    descricao: string;

    @Column({ length: 50, nullable: true })
    sigla: string; // Ex: 'CREATE', 'EDIT', 'DELETE'

    @Column({ default: true })
    ativo: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @CreateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    // 🔗 RELACIONAMENTOS
    @ManyToOne(() => Modulo, (modulo) => modulo.acoes, { nullable: true , onDelete: 'CASCADE' })
    @JoinColumn({ name: "modulo_id" })
    modulo: Modulo;

    @OneToMany(() => PerfilPermissao, (pp) => pp.acao)
    perfilPermissoes: PerfilPermissao[];
}
