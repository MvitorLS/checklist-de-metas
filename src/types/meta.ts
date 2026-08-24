export type TipoMeta = 'diaria' | 'mensal' | 'anual';
export type StatusMeta = 'pendente' | 'em_andamento' | 'concluida';
export type CategoriaMeta = 'saude' | 'estudos' | 'financas' | 'carreira' | 'pessoal';
export type TemaVisual = 'tokyo-dark' | 'oled' | 'light' | 'cyberpunk' | 'emerald';

export interface Subtarefa {
  id: string;
  metaId: string;
  titulo: string;
  concluida: boolean;
}

export interface Meta {
  id: string;
  titulo: string;
  descricao?: string;
  tipo: TipoMeta;
  categoria: CategoriaMeta;
  dataCriacao: string;
  dataPrazo: string;
  status: StatusMeta;
  progresso: number; // 0 - 100
  subtarefas: Subtarefa[];
  concluidaHoje?: boolean; // Para metas diárias
  diasSeguidos?: number; // Streaks
  horarioLembrete?: string; // Ex: '08:30' para alarme/notificação
}

export interface ConfiguracoesNotificacao {
  ativado: boolean;
  horarioMatinal: string; // Ex: '08:00'
  horarioNoturno: string; // Ex: '20:00'
  lembreteIndividual: boolean;
  comemorarConclusao: boolean;
}

export interface EstatisticasMetas {
  total: number;
  concluidas: number;
  emAndamento: number;
  pendentes: number;
  taxaGeral: number;
  diariasHoje: { total: number; concluidas: number; taxa: number };
  mensaisEsteMes: { total: number; concluidas: number; taxa: number };
  anuaisEsteAno: { total: number; concluidas: number; taxa: number };
}

