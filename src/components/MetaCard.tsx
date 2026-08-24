import React, { useState } from 'react';
import { Check, ChevronDown, ChevronUp, Plus, Trash2, Calendar, Flame } from 'lucide-react';
import { Meta } from '../types/meta';
import { useMetas } from '../context/MetasContext';

interface MetaCardProps {
  meta: Meta;
}

export const MetaCard: React.FC<MetaCardProps> = ({ meta }) => {
  const { alternarMetaDiaria, alternarSubtarefa, adicionarSubtarefa, removerMeta } = useMetas();
  const [expandido, setExpandido] = useState(false);
  const [novaSubTitulo, setNovaSubTitulo] = useState('');
  const [mostrarAddSub, setMostrarAddSub] = useState(false);

  const isDiaria = meta.tipo === 'diaria';
  const isConcluida = isDiaria ? meta.concluidaHoje : meta.progresso === 100;

  function handleAddSub(e: React.FormEvent) {
    e.preventDefault();
    if (!novaSubTitulo.trim()) return;
    adicionarSubtarefa(meta.id, novaSubTitulo);
    setNovaSubTitulo('');
    setMostrarAddSub(false);
  }

  return (
    <div className={`meta-card ${isConcluida ? 'concluida' : ''}`}>
      <div className="meta-card-main">
        {/* Botão de Check-off */}
        {isDiaria ? (
          <button 
            className={`check-btn ${meta.concluidaHoje ? 'checked' : ''}`}
            onClick={() => alternarMetaDiaria(meta.id)}
            title="Marcar como concluída hoje"
          >
            <Check size={18} strokeWidth={3} />
          </button>
        ) : (
          <div 
            style={{ 
              width: '36px', 
              height: '36px', 
              borderRadius: '10px', 
              background: meta.progresso === 100 ? 'rgba(52, 211, 153, 0.2)' : 'rgba(56, 189, 248, 0.15)',
              color: meta.progresso === 100 ? '#34d399' : '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.75rem',
              flexShrink: 0
            }}
          >
            {meta.progresso}%
          </div>
        )}

        {/* Informações da Meta */}
        <div className="meta-info">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h4 className="meta-title">{meta.titulo}</h4>
            <button 
              onClick={() => removerMeta(meta.id)}
              style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '2px' }}
              title="Excluir meta"
            >
              <Trash2 size={15} />
            </button>
          </div>

          {meta.descricao && <p className="meta-desc">{meta.descricao}</p>}

          <div className="meta-tags">
            <span className={`tag-badge tag-${meta.categoria}`}>
              {meta.categoria}
            </span>

            {isDiaria && (meta.diasSeguidos || 0) > 0 && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '0.72rem', color: '#fb923c', fontWeight: 700 }}>
                <Flame size={13} fill="#fb923c" />
                {meta.diasSeguidos} dias seguidos
              </span>
            )}

            {isDiaria && meta.horarioLembrete && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700, background: 'rgba(56, 189, 248, 0.12)', padding: '2px 6px', borderRadius: '6px' }}>
                ⏰ {meta.horarioLembrete}
              </span>
            )}

            {!isDiaria && (
              <span className="meta-deadline">
                <Calendar size={12} />
                Prazo: {meta.dataPrazo.split('-').reverse().slice(0, 2).join('/')}
              </span>
            )}
          </div>

          {/* Barra de Progresso para Mensais e Anuais */}
          {!isDiaria && (
            <div className="card-progress-bar">
              <div className="card-progress-fill" style={{ width: `${meta.progresso}%` }} />
            </div>
          )}
        </div>
      </div>

      {/* Subtarefas / Etapas (Para Mensais e Anuais) */}
      {!isDiaria && (
        <div className="subtasks-section">
          <div className="subtasks-header" onClick={() => setExpandido(!expandido)}>
            <span className="subtasks-title">
              Etapas ({meta.subtarefas.filter(s => s.concluida).length}/{meta.subtarefas.length})
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{expandido ? 'Ocultar' : 'Ver'}</span>
              {expandido ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
          </div>

          {expandido && (
            <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {meta.subtarefas.map(sub => (
                <div 
                  key={sub.id} 
                  className={`subtask-item ${sub.concluida ? 'checked' : ''}`}
                  onClick={() => alternarSubtarefa(meta.id, sub.id)}
                >
                  <div className={`subtask-checkbox ${sub.concluida ? 'checked' : ''}`}>
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span>{sub.titulo}</span>
                </div>
              ))}

              {/* Adicionar nova etapa */}
              {mostrarAddSub ? (
                <form onSubmit={handleAddSub} style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                  <input 
                    type="text" 
                    placeholder="Nome da etapa..."
                    className="form-input" 
                    style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                    value={novaSubTitulo}
                    onChange={e => setNovaSubTitulo(e.target.value)}
                    autoFocus
                  />
                  <button type="submit" className="btn-submit" style={{ width: 'auto', padding: '6px 12px', fontSize: '0.8rem', marginTop: 0 }}>
                    Adicionar
                  </button>
                </form>
              ) : (
                <button 
                  onClick={() => setMostrarAddSub(true)}
                  style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '0.78rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'pointer', padding: '6px 0' }}
                >
                  <Plus size={14} />
                  <span>Adicionar etapa</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
