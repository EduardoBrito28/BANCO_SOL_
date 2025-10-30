import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { Utilizador } from './Utilizador';
import { Departamento } from './Departamento';

@Entity('direcao')
export class Direcao {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 150 })
    nome: string;

    @Column({ length: 10, nullable: true })
    sigla: string;

    @Column({ length: 255, nullable: true })
    descricao: string;

    @Column({ default: true })
    ativo: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @CreateDateColumn({ name: 'updated_at' })
    updatedAt: Date;


    @OneToMany(() => Departamento, (departamento) => departamento.direcao)
    departamentos: Departamento[];
}
