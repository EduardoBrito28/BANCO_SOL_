import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, Unique } from 'typeorm';
import { Solicitacao } from './Solicitacao';
import { CampoSolicitacao } from './CampoSolicitacao';

@Entity('valores_solicitacao')
@Unique(['solicitacaoId', 'campoSolicitacaoId'])
export class ValorSolicitacao {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'solicitacao_id'})
  solicitacaoId: string;

  @Column({ name: 'campo_solicitacao_id'})
  campoSolicitacaoId: string;

  @Column({ name: 'valor_texto', type: 'text', nullable: true })
  valorTexto: string;

  @Column({ name: 'valor_numero', type: 'decimal', precision: 15, scale: 2, nullable: true })
  valorNumero: number;

  @Column({ name: 'valor_data', nullable: true })
  valorData?: Date;

  @Column({ name: 'valor_boolean', nullable: true })
  valorBoolean: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => Solicitacao, solicitacao => solicitacao.valores, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'solicitacao_id' })
  solicitacao: Solicitacao;

  @ManyToOne(() => CampoSolicitacao, campo => campo.valores)
  @JoinColumn({ name: 'campo_solicitacao_id' })
  campoSolicitacao: CampoSolicitacao;

  // Helper method to get value based on type
  get valor(): any {
    switch (this.campoSolicitacao?.tipoCampo) {
      case 'texto':
      case 'opcoes':
        return this.valorTexto;
      case 'numero':
        return this.valorNumero;
      case 'data':
        return this.valorData;
      case 'boolean':
        return this.valorBoolean;
      default:
        return this.valorTexto;
    }
  }

}
