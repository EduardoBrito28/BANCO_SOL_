import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { CampoSolicitacao } from './CampoSolicitacao';
import { Solicitacao } from './Solicitacao';

@Entity('tipos_solicitacao')
export class TipoSolicitacao {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  nome: string;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @OneToMany(() => CampoSolicitacao, campo => campo.tipoSolicitacao)
  campos: CampoSolicitacao[];

  @OneToMany(() => Solicitacao, solicitacao => solicitacao.tipoSolicitacao)
  solicitacoes: Solicitacao[];

}
