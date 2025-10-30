// models/Solicitacao.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn, RelationId } from 'typeorm';
import { TipoSolicitacao } from './TipoSolicitacao';
import { ValorSolicitacao } from './ValorSolicitacao';
import { MaterialSolicitacao } from './MaterialSolicitacao';
import { AprovacaoSolicitacao } from './AprovacaoSolicitacao';
import { Balcao } from './Balcao';
import { Utilizador } from './user/Utilizador';
import { FileUpload } from './FileUpload';
@Entity('solicitacoes')
export class Solicitacao {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'tipo_solicitacao_id' })
    tipoSolicitacaoId: string;
    // ✅ ADICIONE ESTA COLUNA para a foreign key
    @Column({ name: 'balcao_id', type: 'uuid', nullable: true })
    codeBalcao: string;

    @Column({ name: 'numero_pedido', length: 50, unique: true, nullable: true })
    numeroPedido: string;


    @Column({ type: 'text', nullable: true })
    observacoes: string;

    @Column({ name: 'tipo_envio', type: 'boolean', nullable: true })
    tipoEnvio: boolean;

    @Column({ name: 'is_admin_destino', type: 'boolean', default: false })
    isAdminDestino: boolean;

    @Column({ name: 'is_director_destino', type: 'boolean', default: false })
    isDirectorDestino: boolean;

    @Column({ name: 'is_direcao_destino', type: 'boolean', default: false })
    isDirecaoDestino: boolean;

    @Column({ name: 'is_concluida', type: 'boolean', default: false })
    isConcluida: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;
    // Relations
    @ManyToOne(() => TipoSolicitacao, tipo => tipo.solicitacoes)
    @JoinColumn({ name: 'tipo_solicitacao_id' })
    tipoSolicitacao: TipoSolicitacao;

    // ✅ NOVO: Relacionamento com Balcão
    @ManyToOne(() => Balcao, balcao => balcao.solicitacoes, { nullable: true })
    @JoinColumn({ name: 'balcao_id' })
    balcao: Balcao;


    @ManyToOne(() => Utilizador, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'created_by' })
    createdBy: Utilizador;

    @RelationId((s: Solicitacao) => s.createdBy)
    enviadoPor: string;


    @OneToMany(() => ValorSolicitacao, valor => valor.solicitacao)
    valores: ValorSolicitacao[];

    @OneToMany(() => MaterialSolicitacao, material => material.solicitacao)
    materiais: MaterialSolicitacao[];

    @OneToMany(() => AprovacaoSolicitacao, aprovacao => aprovacao.solicitacao, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    aprovacoes: AprovacaoSolicitacao[];

    @OneToMany(() => FileUpload, (file) => file.solicitacao, { cascade: true })
    ficheiros!: FileUpload[];
}
