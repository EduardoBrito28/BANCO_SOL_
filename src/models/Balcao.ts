// models/Balcao.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Solicitacao } from './Solicitacao';

@Entity({ name: 'balcoes' })
export class Balcao {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 200 })
    nome!: string;

    @Column({ name: 'code_referencia', type: 'varchar', length: 100 })
    code_referencia!: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    provincia?: string | null;

    @Column({ type: 'varchar', length: 100, nullable: true })
    municipio?: string | null;

    @Column({ type: 'varchar', length: 100, nullable: true })
    bairro?: string | null;

    @Column({ type: 'varchar', length: 200, nullable: true })
    rua?: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    coordenada?: string | null;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

    // 🔗 RELACIONAMENTO: Um balcão pode ter muitas solicitações
    @OneToMany(() => Solicitacao, solicitacao => solicitacao.balcao)
    solicitacoes: Solicitacao[];
}
