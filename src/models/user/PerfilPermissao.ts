import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, Unique } from 'typeorm';
import { Perfil } from './Perfil';
import { Modulo } from './Modulo';
import { Acao } from './Acao';

@Entity('perfil_permissao')
@Unique(['perfil', 'modulo', 'acao']) // ✅ Evita duplicatas
export class PerfilPermissao {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    // 🔗 RELACIONAMENTOS CORRIGIDOS
    @ManyToOne(() => Perfil, (perfil) => perfil.permissoes, { onDelete: 'CASCADE' })
    perfil: Perfil;

    @ManyToOne(() => Modulo, (modulo) => modulo.perfilPermissoes, { onDelete: 'CASCADE' })
    modulo: Modulo;

    @ManyToOne(() => Acao, (acao) => acao.perfilPermissoes, { onDelete: 'CASCADE' })
    acao: Acao;
}
