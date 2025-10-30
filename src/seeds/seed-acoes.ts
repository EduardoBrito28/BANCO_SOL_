import { DataSource } from 'typeorm';
import { Acao } from '../models/user/Acao';
import { Modulo } from '../models/user/Modulo';

export default async function seedAcoes(dataSource: DataSource) {
    const acaoRepo = dataSource.getRepository(Acao);
    const moduloRepo = dataSource.getRepository(Modulo);

    // 🔍 Buscar módulos existentes pela sigla
    const modulos = await moduloRepo.find({
        where: [
            { sigla: 'GFU' }, // Gestão de Funcionários
            { sigla: 'GSA' }, // Segurança e Auditoria
            { sigla: 'GRI' }, // Relatórios e Indicadores
            { sigla: 'GDO' }, // Gestão Documental
            { sigla: 'SUA' }, // Gestão de Usuários e Acessos
            { sigla: 'ST' },  // Solicitações
        ],
    });

    // 🗺️ Mapa de módulos encontrados (sigla → id)
    const mapaModulos: Record<string, string> = {};
    for (const modulo of modulos) {
        mapaModulos[modulo.sigla] = modulo.id;
    }

    // 🚨 Verificar se todos os módulos foram encontrados
    const siglasEsperadas = ['GFU', 'GSA', 'GRI', 'GDO', 'SUA', 'ST'];
    const faltando = siglasEsperadas.filter(sigla => !mapaModulos[sigla]);
    if (faltando.length > 0) {
        console.warn(`⚠️ Módulos não encontrados: ${faltando.join(', ')}. As ações desses módulos serão ignoradas.`);
    }

    // ---------------------------------------------------------
    // 🔧 Ações divididas por módulo
    // ---------------------------------------------------------

    const gruposDeAcoes = [
        {
            moduloSigla: 'GFU', // Gestão de Funcionários
            acoes: [
                'VIEW', 'CREATE', 'EDIT', 'DELETE', 'EXPORT', 'IMPORT', 'PRINT',
                'DUPLICATE', 'ARCHIVE', 'RESTORE', 'VALIDATE', 'APPROVE', 'REJECT',
                'ASSIGN', 'TRANSFER', 'SHARE', 'GENERATE', 'CLOSE', 'OPEN',
            ],
        },
        {
            moduloSigla: 'GSA', // Segurança e Auditoria
            acoes: ['VIEW', 'HISTORY', 'AUDIT', 'LOGVIEW', 'CONFIG', 'RESET', 'SYNC', 'AUTHORIZE', 'EXECUTE'],
        },
        {
            moduloSigla: 'GRI', // Relatórios e Indicadores
            acoes: ['VIEW', 'EXPORT', 'PRINT', 'DOWNLOAD', 'SHARE', 'GENERATE', 'CONFIG'],
        },
        {
            moduloSigla: 'GDO', // Gestão Documental
            acoes: ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'IMPORT', 'EXPORT', 'PRINT', 'ARCHIVE', 'RESTORE', 'DOWNLOAD', 'DUPLICATE', 'SHARE'],
        },
        {
            moduloSigla: 'SUA', // Gestão de Usuários e Acessos
            acoes: ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'APPROVE', 'REJECT', 'ASSIGN', 'TRANSFER', 'CONFIG', 'AUTHORIZE', 'RESET'],
        },
        {
            moduloSigla: 'ST', // Solicitações
            acoes: ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'SUBMIT', 'APPROVE', 'REJECT', 'VALIDATE', 'NOTIFY', 'EMAIL', 'CLOSE', 'OPEN'],
        },
    ];

    // ---------------------------------------------------------
    // 💾 Inserir ações para cada módulo
    // ---------------------------------------------------------
    for (const grupo of gruposDeAcoes) {
        const moduloId = mapaModulos[grupo.moduloSigla];
        if (!moduloId) continue; // pular módulos ausentes

        for (const sigla of grupo.acoes) {
            const exists = await acaoRepo.findOne({
                where: { sigla, modulo: { id: moduloId } },
                relations: ['modulo'],
            });
            if (exists) continue;

            const novaAcao = acaoRepo.create({
                sigla,
                nome: getActionName(sigla),
                descricao: getActionDescription(sigla),
                modulo: { id: moduloId },
            });

            await acaoRepo.save(novaAcao);
        }
    }

    console.log('✅ Seed de ações concluído com módulos associados!');
}

// ---------------------------------------------------------
// 🔤 Funções auxiliares
// ---------------------------------------------------------
function getActionName(sigla: string): string {
    const nomes: Record<string, string> = {
        VIEW: 'Visualizar',
        CREATE: 'Criar',
        EDIT: 'Editar',
        DELETE: 'Eliminar',
        EXPORT: 'Exportar',
        IMPORT: 'Importar',
        PRINT: 'Imprimir',
        DUPLICATE: 'Duplicar',
        ARCHIVE: 'Arquivar',
        RESTORE: 'Restaurar',
        VALIDATE: 'Validar',
        APPROVE: 'Aprovar',
        REJECT: 'Rejeitar',
        ASSIGN: 'Atribuir',
        TRANSFER: 'Transferir',
        SHARE: 'Partilhar',
        GENERATE: 'Gerar',
        CLOSE: 'Encerrar',
        OPEN: 'Reabrir',
        HISTORY: 'Histórico',
        AUDIT: 'Auditar',
        LOGVIEW: 'Visualizar Logs',
        CONFIG: 'Configurar',
        RESET: 'Reiniciar',
        SYNC: 'Sincronizar',
        AUTHORIZE: 'Autorizar',
        EXECUTE: 'Executar',
        DOWNLOAD: 'Download',
        NOTIFY: 'Notificar',
        EMAIL: 'Enviar Email',
        SUBMIT: 'Submeter',
    };
    return nomes[sigla] ?? sigla;
}

function getActionDescription(sigla: string): string {
    const descricoes: Record<string, string> = {
        VIEW: 'Permite visualizar dados e detalhes dos registos.',
        CREATE: 'Permite criar novos registos no sistema.',
        EDIT: 'Permite alterar registos existentes.',
        DELETE: 'Permite eliminar registos de forma lógica ou física.',
        EXPORT: 'Permite exportar dados (Excel, PDF, CSV, etc.).',
        IMPORT: 'Permite importar dados de ficheiros externos.',
        PRINT: 'Permite imprimir relatórios, documentos ou listagens.',
        DUPLICATE: 'Permite duplicar registos existentes.',
        ARCHIVE: 'Permite arquivar registos antigos.',
        RESTORE: 'Permite restaurar registos arquivados ou eliminados.',
        VALIDATE: 'Permite validar dados antes da aprovação ou execução.',
        APPROVE: 'Permite aprovar solicitações ou processos.',
        REJECT: 'Permite rejeitar solicitações ou processos.',
        ASSIGN: 'Permite atribuir tarefas, papéis ou responsabilidades.',
        TRANSFER: 'Permite transferir registos entre utilizadores ou estados.',
        SHARE: 'Permite partilhar dados ou relatórios com outros utilizadores.',
        GENERATE: 'Permite gerar documentos, relatórios ou códigos automáticos.',
        CLOSE: 'Permite encerrar processos ou registos ativos.',
        OPEN: 'Permite reabrir registos previamente encerrados.',
        HISTORY: 'Permite visualizar o histórico de alterações.',
        AUDIT: 'Permite executar auditorias sobre registos e ações.',
        LOGVIEW: 'Permite consultar logs de atividades do sistema.',
        CONFIG: 'Permite alterar definições ou parâmetros do módulo.',
        RESET: 'Permite repor o estado inicial ou reiniciar o módulo.',
        SYNC: 'Permite sincronizar dados com sistemas externos.',
        AUTHORIZE: 'Permite autorizar operações críticas.',
        EXECUTE: 'Permite executar operações específicas (scripts, cálculos, etc.).',
        DOWNLOAD: 'Permite descarregar documentos ou anexos.',
        NOTIFY: 'Permite enviar notificações ou alertas.',
        EMAIL: 'Permite enviar comunicações por email.',
        SUBMIT: 'Permite submeter um pedido ou processo para aprovação.',
    };
    return descricoes[sigla] ?? 'Ação do sistema.';
}
