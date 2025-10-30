import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Solicitacao } from './Solicitacao';

@Entity('file_uploads')
export class FileUpload {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  originalName!: string;

  @Column()
  fileName!: string;

  @Column()
  mimeType!: string;

  @Column()
  size!: number;

  @Column()
  path!: string;

  @Column()
  url!: string;

  @ManyToOne(() => Solicitacao, (solicitacao) => solicitacao.ficheiros, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'solicitacaoId' })
  solicitacao!: Solicitacao;

  @Column()
  solicitacaoId!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
