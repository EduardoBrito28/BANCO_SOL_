import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

import { TipoSolicitacao } from './TipoSolicitacao';
import { ValorSolicitacao } from './ValorSolicitacao';

export enum TipoCampo {
  TEXTO = 'texto',
  NUMERO = 'numero',
  DATA = 'data',
  BOOLEAN = 'boolean',
  OPCOES = 'opcoes'
}

@Entity('campos_solicitacao')
export class CampoSolicitacao {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tipo_solicitacao_id'})
  tipoSolicitacaoId: string;

  @Column({ name: 'nome_campo', length: 100 })
  nomeCampo: string;

  @Column({
    name: 'tipo_campo',
    type: 'enum',
    enum: TipoCampo,
    default: TipoCampo.TEXTO
  })
  tipoCampo: TipoCampo;

  @Column({ default: false })
  obrigatorio: boolean;

  @Column({ default: 0 })
  ordem: number;

  @Column({ type: 'json', nullable: true })
  opcoes: string[];

  // Relations
  @ManyToOne(() => TipoSolicitacao, tipo => tipo.campos)
  @JoinColumn({ name: 'tipo_solicitacao_id' })
  tipoSolicitacao: TipoSolicitacao;

  @OneToMany(() => ValorSolicitacao, valor => valor.campoSolicitacao)
  valores: ValorSolicitacao[];

}
