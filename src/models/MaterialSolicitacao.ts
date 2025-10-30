import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Solicitacao } from './Solicitacao';

@Entity('materiais_solicitacao')
export class MaterialSolicitacao {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'solicitacao_id', nullable: true })
  solicitacaoId: string;

  @Column({ length: 255, nullable: true })
  descricao: string;

  @Column({ default: 1, nullable: true })
  quantidade: number;

  @Column({ length: 100, nullable: true })
  pn: string; // Part Number

  @Column({ length: 100, nullable: true })
  marca: string;

  @Column({ length: 100, nullable: true })
  modelo: string;

  @Column({ length: 100, nullable: true })
  referencia: string;

  @Column({ length: 50, nullable: true })
  estado: string;

  @Column({ length: 100, nullable: true })
  proveniencia: string;

  @Column({ length: 100, nullable: true })
  destino: string;

  // Relations
  @ManyToOne(() => Solicitacao, solicitacao => solicitacao.materiais, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'solicitacao_id' })
  solicitacao: Solicitacao;

}
