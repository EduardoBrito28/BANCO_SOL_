import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { Direcao } from './direcao';
import { Utilizador } from './Utilizador';
import { Departamento } from './Departamento';
import { Perfil } from './Perfil';

@Entity('gabinete')
export class Gabinete {
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

    @OneToMany(() => Perfil, (perfil) => perfil.gabinete)
    utilizadores: Perfil[];
}
