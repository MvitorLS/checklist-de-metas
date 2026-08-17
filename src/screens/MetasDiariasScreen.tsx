import React, { useState } from 'react';
import { useMetas } from '../context/MetasContext';
import { MetaCard } from '../components/MetaCard';
import { CheckSquare, Flame } from 'lucide-react';

export const MetasDiariasScreen: React.FC = () => {
  const { metas } = useMetas();
  const [filtro, setFiltro] = useState<'todas' | 'pendentes' | 'concluidas'>('todas');

  const diarias = metas.filter(m => m.tipo === 'diaria');
  const concluidas = diarias.filter(m => m.concluidaHoje).length;
  const pendentes = diarias.length - concluidas;

  const listaFiltrada = diarias.filter(m => {
    if (filtro === 'pendentes') return !m.concluidaHoje;
    if (filtro === 'concluidas') return m.concluidaHoje;
    return true;
  });

  return (
    <div className="screen-content">
      {/* Header Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Metas Diárias</h2>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Hábitos e rotinas para cumprir todos os dias</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(251, 146, 60, 0.15)', color: '#fb923c', padding: '6px 12px', borderRadius: '12px', fontWeight: 800, fontSize: '0.85rem' }}>
          <Flame size={16} fill="#fb923c" />
          <span>Foco Total</span>
        </div>
      </div>

      {/* Filtro de Status */}
      <div className="type-toggle">
        <button 
          className={`type-btn ${filtro === 'todas' ? 'active' : ''}`}
          onClick={() => setFiltro('todas')}
        >
          Todas ({diarias.length})
        </button>
        <button 
          className={`type-btn ${filtro === 'pendentes' ? 'active' : ''}`}
          onClick={() => setFiltro('pendentes')}
        >
          Pendentes ({pendentes})
        </button>
        <button 
          className={`type-btn ${filtro === 'concluidas' ? 'active' : ''}`}
          onClick={() => setFiltro('concluidas')}
        >
          Feitas ({concluidas})
        </button>
      </div>

      {/* Lista */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {listaFiltrada.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', background: '#131b2e', borderRadius: '18px', color: '#94a3b8' }}>
            <CheckSquare size={36} color="#64748b" style={{ marginBottom: '8px' }} />
            <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>Nenhuma meta encontrada nesta categoria.</p>
          </div>
        ) : (
          listaFiltrada.map(meta => <MetaCard key={meta.id} meta={meta} />)
        )}
      </div>
    </div>
  );
};
