import React, { useState } from 'react';
import { useMetas } from '../context/MetasContext';
import { MetaCard } from '../components/MetaCard';
import { Target, Trophy } from 'lucide-react';

export const MetasAnuaisScreen: React.FC = () => {
  const { metas } = useMetas();
  const [categoria, setCategoria] = useState<string>('todas');

  const anuais = metas.filter(m => m.tipo === 'anual');
  const listaFiltrada = anuais.filter(m => categoria === 'todas' || m.categoria === categoria);

  const progressoMedio = anuais.length > 0
    ? Math.round(anuais.reduce((acc, m) => acc + m.progresso, 0) / anuais.length)
    : 0;

  return (
    <div className="screen-content">
      {/* Banner de Visão Anual */}
      <div style={{ background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 100%)', borderRadius: '20px', padding: '20px', color: '#090d16' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.8 }}>
            Visão 2026
          </span>
          <Trophy size={20} />
        </div>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
          {progressoMedio}% das Metas Anuais
        </h3>
        <p style={{ fontSize: '0.82rem', marginTop: '4px', opacity: 0.9 }}>
          Grandes conquistas construídas passo a passo ao longo do ano.
        </p>
      </div>

      {/* Categorias */}
      <div className="filter-scroll">
        {['todas', 'carreira', 'financas', 'estudos', 'saude', 'pessoal'].map(cat => (
          <button
            key={cat}
            className={`filter-pill ${categoria === cat ? 'active' : ''}`}
            onClick={() => setCategoria(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {listaFiltrada.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', background: '#131b2e', borderRadius: '18px', color: '#94a3b8' }}>
            <Target size={36} color="#64748b" style={{ marginBottom: '8px' }} />
            <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>Nenhuma meta anual cadastrada nesta categoria.</p>
          </div>
        ) : (
          listaFiltrada.map(meta => <MetaCard key={meta.id} meta={meta} />)
        )}
      </div>
    </div>
  );
};
