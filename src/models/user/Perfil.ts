import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

import { PerfilPermissao } from './PerfilPermissao';
import { Utilizador } from './Utilizador';
import { Departamento } from './Departamento';
import { Gabinete } from './Gabinete';

@Entity('perfil')
export class Perfil {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 100 })
    papel: string;

    @Column({ length: 255, nullable: true })
    restricao: string;

    @Column({ length: 255, nullable: true })
    descricao: string;


    @Column({ default: true })
    ativo: boolean;

    @Column({ default: false })
    isAdmin: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @CreateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    // 🔗 RELACIONAMENTOS
    @OneToMany(() => Utilizador, (user) => user.perfil)
    utilizadores: Utilizador[];

    @ManyToOne(() => Departamento, (departamento) => departamento.utilizadores)
    @JoinColumn({ name: "departamento_id" })
    departamento: Departamento;

    @ManyToOne(() => Gabinete, (gabinete) => gabinete.utilizadores)
    @JoinColumn({ name: "gabinete_id" })
    gabinete: Gabinete;

    @OneToMany(() => PerfilPermissao, (pp) => pp.perfil)
    permissoes: PerfilPermissao[];

}
