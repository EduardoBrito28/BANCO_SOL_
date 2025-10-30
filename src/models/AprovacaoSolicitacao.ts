// models/AprovacaoSolicitacao.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, RelationId } from 'typeorm';
import { Solicitacao } from './Solicitacao';
import { Utilizador } from './user/Utilizador';

export enum StatusAprovacao {
    PENDENTE = 'pending',
    APROVADO = 'completed',
    ADM_APROVADO = 'admin_approved',
    REJEITADO = 'rejected',
    ADM_REJEITADO = 'admin_rejected',
    ACEITE = 'accept'
}


@Entity('aprovacoes_solicitacao')
export class AprovacaoSolicitacao {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'solicitacao_id' })
    solicitacaoId: string;

    @Column({
        type: 'enum',
        enum: StatusAprovacao,
        default: StatusAprovacao.PENDENTE
    })
    status: StatusAprovacao;

    @Column({ type: 'text', nullable: true })
    observacoes: string;

    @Column({ name: 'data_aprovacao', nullable: true })
    dataAprovacao: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;
    // Relations
    @ManyToOne(() => Solicitacao, solicitacao => solicitacao.aprovacoes, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'solicitacao_id' })
    solicitacao: Solicitacao;


     @ManyToOne(() => Utilizador, { onDelete: 'CASCADE' })
     @JoinColumn({ name: 'created_by' })
     createdBy: Utilizador;

     @RelationId((s: Solicitacao) => s.createdBy)
     usuarioAprovadorId: string;
}
