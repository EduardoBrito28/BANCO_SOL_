import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
} from 'typeorm';

import { Perfil } from './Perfil';
export enum EstadoUtilizador {
    ACTIVO = 'Activo',
    INACTIVO = 'Inactivo',
    SUSPENSO = 'Suspenso',
    BLOQUEADO = 'Bloqueado'
}

@Entity('utilizador')
export class Utilizador {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 255 })
    nome: string;

    @Column({ unique: true, length: 255 })
    email: string;

    @Column({ length: 20, nullable: true })
    telefone: string;

    @Column({ name: 'senha_hash', length: 255 })
    senhaHash: string;

    @Column({ name: 'salt_hash', length: 255 })
    saltHash: string;

    @Column({type: 'boolean', default: true})
    estado: boolean;

    @Column({ type: 'text', nullable: true })
    avatar: string;

    @Column({ name: 'tipo_admin', default: false })
    superAdmin: boolean;

    @Column({ name: 'ultimo_login', nullable: true })
    ultimoLogin: Date;

    @Column({ name: 'email_verificado', default: false })
    emailVerificado: boolean;

    @Column({ name: 'codigo_verificacao', length: 6, nullable: true })
    codigoVerificacao: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne(() => Perfil, (perfil) => perfil.utilizadores,  { nullable: true,onDelete: 'RESTRICT'})
    perfil: Perfil;
}

