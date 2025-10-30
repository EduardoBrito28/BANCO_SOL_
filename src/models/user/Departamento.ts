import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Utilizador } from './Utilizador';
import { Modulo } from './Modulo';
import { Direcao } from './direcao';
import { Gabinete } from './Gabinete';
import { Perfil } from './Perfil';

@Entity('departamento')
export class Departamento {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 100 })
    nome: string; // ex.: "DTI"

    @Column({ length: 255, nullable: true })
    sigla: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt?: Date;

    // Relacionamento opcional com Direcao
    @ManyToOne(() => Direcao, (direcao) => direcao.departamentos, { nullable: true })
    @JoinColumn({ name: "direcao_id" })
    direcao: Direcao;
    /*
    @ManyToOne(() => Gabinete, (gabinete) => gabinete.departamentos, { nullable: true })
    @JoinColumn({ name: "gabinete_id" })
    gabinete: Gabinete;

    */


    @OneToMany(() => Perfil, (perfil) => perfil.departamento)
    utilizadores: Perfil[];

    @OneToMany(() => Modulo, (modulo) => modulo.departamento)
    modulos: Modulo[]; // Opcional: Liga módulos a departamentos
}
