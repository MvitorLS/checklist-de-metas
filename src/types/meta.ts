export type TipoMeta = 'diaria' | 'mensal' | 'anual';
export type StatusMeta = 'pendente' | 'em_andamento' | 'concluida';
export type CategoriaMeta = 'saude' | 'estudos' | 'financas' | 'carreira' | 'pessoal';

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
