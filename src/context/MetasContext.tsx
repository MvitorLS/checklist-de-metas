import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Meta, TipoMeta, StatusMeta, Subtarefa, CategoriaMeta, ConfiguracoesNotificacao } from '../types/meta';
import { notificationService } from '../services/notificationService';

interface MetasContextType {
  metas: Meta[];
  configNotificacoes: ConfiguracoesNotificacao;
  atualizarConfigNotificacoes: (novaConfig: Partial<ConfiguracoesNotificacao>) => Promise<void>;
  adicionarMeta: (meta: Omit<Meta, 'id' | 'dataCriacao' | 'progresso' | 'status' | 'subtarefas'> & { subtarefasTitulos?: string[]; horarioLembrete?: string }) => void;
  alternarMetaDiaria: (id: string) => void;
  alternarSubtarefa: (metaId: string, subtarefaId: string) => void;
  adicionarSubtarefa: (metaId: string, titulo: string) => void;
  removerMeta: (id: string) => void;
  editarMeta: (id: string, dados: Partial<Meta>) => void;
  testarNotificacao: () => Promise<boolean>;
}

const MetasContext = createContext<MetasContextType | undefined>(undefined);


const METAS_INICIAIS: Meta[] = [
  {
    id: '1',
    titulo: 'Beber 2.5L de água',
    descricao: 'Manter a hidratação diária com garrafa de 500ml',
    tipo: 'diaria',
    categoria: 'saude',
    dataCriacao: '2026-08-01',
    dataPrazo: '2026-12-31',
    status: 'concluida',
    progresso: 100,
    concluidaHoje: true,
    diasSeguidos: 7,
    subtarefas: []
  },
  {
    id: '2',
    titulo: 'Treino de Musculação / Cardio (45 min)',
    descricao: 'Academia ou corrida no parque',
    tipo: 'diaria',
    categoria: 'saude',
    dataCriacao: '2026-08-01',
    dataPrazo: '2026-12-31',
    status: 'pendente',
    progresso: 0,
    concluidaHoje: false,
    diasSeguidos: 4,
    subtarefas: []
  },
  {
    id: '3',
    titulo: 'Estudar 1h de Engenharia de Software / Java',
    descricao: 'Praticar Spring Boot e arquitetura de microsserviços',
    tipo: 'diaria',
    categoria: 'estudos',
    dataCriacao: '2026-08-01',
    dataPrazo: '2026-12-31',
    status: 'concluida',
    progresso: 100,
    concluidaHoje: true,
    diasSeguidos: 12,
    subtarefas: []
  },
  {
    id: '4',
    titulo: 'Concluir Livro de PDI e Artigos de Visão Computacional',
    descricao: 'Capítulos 1 a 4 do Gonzalez & Woods e exercícios',
    tipo: 'mensal',
    categoria: 'estudos',
    dataCriacao: '2026-08-01',
    dataPrazo: '2026-08-31',
    status: 'em_andamento',
    progresso: 75,
    subtarefas: [
      { id: 's1', metaId: '4', titulo: 'Capítulo 1 e 2 - Fundamentos e Aquisição', concluida: true },
      { id: 's2', metaId: '4', titulo: 'Capítulo 3 - Transformações de Intensidade e Filtragem', concluida: true },
      { id: 's3', metaId: '4', titulo: 'Exercícios práticos de convolução e filtros espaciais', concluida: true },
      { id: 's4', metaId: '4', titulo: 'Revisão geral para a prova do IFPR', concluida: false }
    ]
  },
  {
    id: '5',
    titulo: 'Economizar e Guardar R$ 800 na Reserva',
    descricao: 'Aporte mensal da reserva de emergência',
    tipo: 'mensal',
    categoria: 'financas',
    dataCriacao: '2026-08-01',
    dataPrazo: '2026-08-31',
    status: 'em_andamento',
    progresso: 50,
    subtarefas: [
      { id: 's5', metaId: '5', titulo: 'Corte de gastos supérfluos no delivery', concluida: true },
      { id: 's6', metaId: '5', titulo: 'Aporte de R$ 400 da primeira quinzena', concluida: true },
      { id: 's7', metaId: '5', titulo: 'Aporte de R$ 400 da segunda quinzena', concluida: false }
    ]
  },
  {
    id: '6',
    titulo: 'Alcançar Estágio em Desenvolvimento de Software',
    descricao: 'Conquistar vaga na área tech com Java / React / Fullstack',
    tipo: 'anual',
    categoria: 'carreira',
    dataCriacao: '2026-01-10',
    dataPrazo: '2026-12-15',
    status: 'em_andamento',
    progresso: 66,
    subtarefas: [
      { id: 's8', metaId: '6', titulo: 'Montar currículo executivo e portfólio no GitHub', concluida: true },
      { id: 's9', metaId: '6', titulo: 'Desenvolver e publicar 3 projetos Fullstack no GitHub', concluida: true },
      { id: 's10', metaId: '6', titulo: 'Aplicar para 15 processos seletivos e entrevistas técnicas', concluida: false }
    ]
  },
  {
    id: '7',
    titulo: 'Construir Reserva de Emergência de 6 Meses',
    descricao: 'Segurança financeira completa para o ano',
    tipo: 'anual',
    categoria: 'financas',
    dataCriacao: '2026-01-01',
    dataPrazo: '2026-12-31',
    status: 'em_andamento',
    progresso: 50,
    subtarefas: [
      { id: 's11', metaId: '7', titulo: 'Definir teto de gastos mensais', concluida: true },
      { id: 's12', metaId: '7', titulo: 'Atingir 3 meses de reserva paga', concluida: true },
      { id: 's13', metaId: '7', titulo: 'Atingir 6 meses completos investidos em CDB 100% CDI', concluida: false }
    ]
  }
];

export const MetasProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [metas, setMetas] = useState<Meta[]>(() => {
    const salvo = localStorage.getItem('@metas_app_v1');
    if (salvo) {
      try {
        const parsed = JSON.parse(salvo);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error('Falha ao restaurar metas do storage:', e);
      }
    }
    return METAS_INICIAIS;
  });

  const [configNotificacoes, setConfigNotificacoes] = useState<ConfiguracoesNotificacao>(() => {
    const salvo = localStorage.getItem('@metas_notificacoes_v1');
    if (salvo) {
      try {
        return JSON.parse(salvo);
      } catch (e) {}
    }
    return {
      ativado: true,
      horarioMatinal: '08:00',
      horarioNoturno: '20:00',
      lembreteIndividual: true,
      comemorarConclusao: true
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem('@metas_app_v1', JSON.stringify(metas));
    } catch (e) {
      console.error('Falha ao persistir metas no storage:', e);
    }

    // Agenda ou atualiza os lembretes diários automaticamente
    notificationService.scheduleDailyReminders(configNotificacoes, metas);
  }, [metas, configNotificacoes]);

  async function atualizarConfigNotificacoes(novaConfig: Partial<ConfiguracoesNotificacao>) {
    setConfigNotificacoes(prev => {
      const atualizada = { ...prev, ...novaConfig };
      try {
        localStorage.setItem('@metas_notificacoes_v1', JSON.stringify(atualizada));
      } catch (e) {}
      return atualizada;
    });

    if (novaConfig.ativado) {
      await notificationService.requestPermission();
    }
  }

  async function testarNotificacao(): Promise<boolean> {
    return await notificationService.sendTestNotification();
  }

  function dispararCelebracao() {
    try {
      confetti({
        particleCount: 80,
        spread: 65,
        origin: { y: 0.8 },
        colors: ['#38bdf8', '#818cf8', '#34d399', '#f43f5e']
      });
    } catch (e) {}
  }

  function adicionarMeta(dados: Omit<Meta, 'id' | 'dataCriacao' | 'progresso' | 'status' | 'subtarefas'> & { subtarefasTitulos?: string[]; horarioLembrete?: string }) {
    const id = Date.now().toString();
    const tituloLimpo = String(dados.titulo || '').trim().slice(0, 120);
    const descLimpa = String(dados.descricao || '').trim().slice(0, 500);

    if (!tituloLimpo) return;

    const subs: Subtarefa[] = (dados.subtarefasTitulos || [])
      .map(t => String(t || '').trim().slice(0, 120))
      .filter(Boolean)
      .map((t, idx) => ({
        id: `${id}_sub_${idx}`,
        metaId: id,
        titulo: t,
        concluida: false
      }));

    const nova: Meta = {
      id,
      titulo: tituloLimpo,
      descricao: descLimpa,
      tipo: dados.tipo,
      categoria: dados.categoria || 'pessoal',
      dataCriacao: new Date().toISOString().split('T')[0],
      dataPrazo: dados.dataPrazo || new Date().toISOString().split('T')[0],
      status: 'pendente',
      progresso: 0,
      subtarefas: subs,
      concluidaHoje: false,
      diasSeguidos: 0,
      horarioLembrete: dados.horarioLembrete
    };

    setMetas(prev => [nova, ...prev]);
  }

  function alternarMetaDiaria(id: string) {
    setMetas(prev => {
      const atualizadas = prev.map(m => {
        if (m.id !== id) return m;
        const novoStatus = !m.concluidaHoje;
        if (novoStatus) {
          dispararCelebracao();
        }
        return {
          ...m,
          concluidaHoje: novoStatus,
          status: (novoStatus ? 'concluida' : 'pendente') as StatusMeta,
          progresso: novoStatus ? 100 : 0,
          diasSeguidos: novoStatus ? (m.diasSeguidos || 0) + 1 : Math.max(0, (m.diasSeguidos || 1) - 1)
        };
      });

      // Se todas as diárias foram concluídas agora, dispara a notificação de vitória
      const diarias = atualizadas.filter(m => m.tipo === 'diaria');
      const todasConcluidas = diarias.length > 0 && diarias.every(m => m.concluidaHoje);
      if (todasConcluidas && configNotificacoes.comemorarConclusao) {
        notificationService.notifyAllCompleted();
      }

      return atualizadas;
    });
  }

  function alternarSubtarefa(metaId: string, subtarefaId: string) {
    setMetas(prev => prev.map(m => {
      if (m.id !== metaId) return m;
      const novasSubs = m.subtarefas.map(s => s.id === subtarefaId ? { ...s, concluida: !s.concluida } : s);
      const total = novasSubs.length;
      const concluidas = novasSubs.filter(s => s.concluida).length;
      const progresso = total > 0 ? Math.round((concluidas / total) * 100) : 0;
      const status = progresso === 100 ? 'concluida' : progresso > 0 ? 'em_andamento' : 'pendente';

      if (progresso === 100 && m.progresso < 100) {
        dispararCelebracao();
      }

      return {
        ...m,
        subtarefas: novasSubs,
        progresso,
        status
      };
    }));
  }

  function adicionarSubtarefa(metaId: string, titulo: string) {
    if (!titulo.trim()) return;
    setMetas(prev => prev.map(m => {
      if (m.id !== metaId) return m;
      const novaSub: Subtarefa = {
        id: `${metaId}_sub_${Date.now()}`,
        metaId,
        titulo: titulo.trim(),
        concluida: false
      };
      const novasSubs = [...m.subtarefas, novaSub];
      const total = novasSubs.length;
      const concluidas = novasSubs.filter(s => s.concluida).length;
      const progresso = Math.round((concluidas / total) * 100);
      return {
        ...m,
        subtarefas: novasSubs,
        progresso,
        status: progresso === 100 ? 'concluida' : progresso > 0 ? 'em_andamento' : 'pendente'
      };
    }));
  }

  function removerMeta(id: string) {
    setMetas(prev => prev.filter(m => m.id !== id));
  }

  function editarMeta(id: string, dados: Partial<Meta>) {
    setMetas(prev => prev.map(m => m.id === id ? { ...m, ...dados } : m));
  }

  return (
    <MetasContext.Provider value={{
      metas,
      configNotificacoes,
      atualizarConfigNotificacoes,
      adicionarMeta,
      alternarMetaDiaria,
      alternarSubtarefa,
      adicionarSubtarefa,
      removerMeta,
      editarMeta,
      testarNotificacao
    }}>
      {children}
    </MetasContext.Provider>
  );
};

export const useMetas = () => {
  const context = useContext(MetasContext);
  if (!context) {
    throw new Error('useMetas deve ser usado dentro de um MetasProvider');
  }
  return context;
};
