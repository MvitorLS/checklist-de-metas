import React, { useState } from 'react';
import { useMetas } from '../context/MetasContext';
import { MetaCard } from '../components/MetaCard';
import { CalendarDays } from 'lucide-react';

export const MetasMensaisScreen: React.FC = () => {
  const { metas } = useMetas();
  const [statusFiltro, setStatusFiltro] = useState<'todas' | 'em_andamento' | 'concluidas'>('todas');

  const mensais = metas.filter(m => m.tipo === 'mensal');
  const concluidas = mensais.filter(m => m.progresso === 100).length;
  const emAndamento = mensais.filter(m => m.progresso < 100).length;

  const listaFiltrada = mensais.filter(m => {
    if (statusFiltro === 'em_andamento') return m.progresso < 100;
    if (statusFiltro === 'concluidas') return m.progresso === 100;
    return true;
  });

  return (
    <div className="screen-content">
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Metas Mensais</h2>
        <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Objetivos de médio prazo divididos em etapas</p>
      </div>

      {/* Tabs */}
      <div className="type-toggle">
        <button 
          className={`type-btn ${statusFiltro === 'todas' ? 'active' : ''}`}
          onClick={() => setStatusFiltro('todas')}
        >
          Todas ({mensais.length})
        </button>
        <button 
          className={`type-btn ${statusFiltro === 'em_andamento' ? 'active' : ''}`}
          onClick={() => setStatusFiltro('em_andamento')}
        >
          Em Andamento ({emAndamento})
        </button>
        <button 
          className={`type-btn ${statusFiltro === 'concluidas' ? 'active' : ''}`}
          onClick={() => setStatusFiltro('concluidas')}
        >
          Concluídas ({concluidas})
        </button>
      </div>

      {/* Lista */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {listaFiltrada.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', background: '#131b2e', borderRadius: '18px', color: '#94a3b8' }}>
            <CalendarDays size={36} color="#64748b" style={{ marginBottom: '8px' }} />
            <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>Nenhuma meta mensal cadastrada neste status.</p>
          </div>
        ) : (
          listaFiltrada.map(meta => <MetaCard key={meta.id} meta={meta} />)
        )}
      </div>
    </div>
  );
};
