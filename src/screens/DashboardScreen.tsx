import React, { useState } from 'react';
import { Sparkles, Flame, CheckCircle, TrendingUp, Filter } from 'lucide-react';
import { useMetas } from '../context/MetasContext';
import { MetaCard } from '../components/MetaCard';
import { CategoriaMeta } from '../types/meta';

export const DashboardScreen: React.FC = () => {
  const { metas } = useMetas();
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('todas');

  // Metas diárias de hoje
  const diarias = metas.filter(m => m.tipo === 'diaria');
  const diariasConcluidas = diarias.filter(m => m.concluidaHoje).length;
  const pctDiarias = diarias.length > 0 ? Math.round((diariasConcluidas / diarias.length) * 100) : 0;

  // Metas em andamento no geral
  const metasFiltradas = metas.filter(m => {
    if (categoriaFiltro !== 'todas' && m.categoria !== categoriaFiltro) return false;
    return true;
  });

  const streakMax = Math.max(0, ...diarias.map(d => d.diasSeguidos || 0));

  return (
    <div className="screen-content">
      {/* Hero Banner Resumo de Hoje */}
      <div className="hero-card">
        <div className="hero-meta">
          <span className="hero-streak">
            <Flame size={14} fill="#ffffff" />
            {streakMax > 0 ? `${streakMax} dias seguidos` : 'Comece hoje!'}
          </span>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Hoje
          </span>
        </div>

        <div className="hero-pct">{pctDiarias}%</div>
        <div className="hero-bar-bg">
          <div className="hero-bar-fill" style={{ width: `${pctDiarias}%` }} />
        </div>

        <div className="hero-subtitle">
          {diariasConcluidas} de {diarias.length} metas diárias concluídas hoje
        </div>
      </div>

      {/* Filtro de Categorias */}
      <div className="filter-scroll">
        {['todas', 'saude', 'estudos', 'financas', 'carreira', 'pessoal'].map(cat => (
          <button
            key={cat}
            className={`filter-pill ${categoriaFiltro === cat ? 'active' : ''}`}
            onClick={() => setCategoriaFiltro(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Destaque Metas Diárias */}
      <div>
        <div className="section-head">
          <h3 className="section-title">Checklist de Hoje</h3>
          <span className="section-badge">{diariasConcluidas}/{diarias.length}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
          {diarias.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px', background: '#131b2e', borderRadius: '14px', color: '#64748b', fontSize: '0.85rem' }}>
              Nenhuma meta diária cadastrada. Toque no botão (+) para criar.
            </div>
          ) : (
            diarias.map(meta => <MetaCard key={meta.id} meta={meta} />)
          )}
        </div>
      </div>

      {/* Metas Mensais e Anuais em Foco */}
      <div>
        <div className="section-head">
          <h3 className="section-title">Metas em Andamento</h3>
          <span className="section-badge">
            {metas.filter(m => m.tipo !== 'diaria' && m.progresso < 100).length} ativas
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
          {metas
            .filter(m => m.tipo !== 'diaria')
            .filter(m => categoriaFiltro === 'todas' || m.categoria === categoriaFiltro)
            .map(meta => <MetaCard key={meta.id} meta={meta} />)}
        </div>
      </div>
    </div>
  );
};
