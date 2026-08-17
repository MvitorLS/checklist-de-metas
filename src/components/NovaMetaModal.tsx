import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { TipoMeta, CategoriaMeta } from '../types/meta';
import { useMetas } from '../context/MetasContext';

interface NovaMetaModalProps {
  aberto: boolean;
  fechar: () => void;
  tipoPadrao?: TipoMeta;
}

export const NovaMetaModal: React.FC<NovaMetaModalProps> = ({ aberto, fechar, tipoPadrao = 'diaria' }) => {
  const { adicionarMeta } = useMetas();
  const [tipo, setTipo] = useState<TipoMeta>(tipoPadrao);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState<CategoriaMeta>('saude');
  const [dataPrazo, setDataPrazo] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [subtarefas, setSubtarefas] = useState<string[]>(['']);

  if (!aberto) return null;

  function handleAddSubField() {
    setSubtarefas(prev => [...prev, '']);
  }

  function handleSubChange(index: number, val: string) {
    setSubtarefas(prev => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  }

  function handleRemoveSub(index: number) {
    setSubtarefas(prev => prev.filter((_, idx) => idx !== index));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!titulo.trim()) return;

    adicionarMeta({
      titulo: titulo.trim(),
      descricao: descricao.trim() || undefined,
      tipo,
      categoria,
      dataPrazo,
      subtarefasTitulos: tipo !== 'diaria' ? subtarefas.filter(s => s.trim()) : []
    });

    // Reset
    setTitulo('');
    setDescricao('');
    setSubtarefas(['']);
    fechar();
  }

  return (
    <div className="modal-overlay" onClick={fechar}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Nova Meta</h3>
          <button onClick={fechar} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Seletor de Tipo */}
        <div className="type-toggle">
          <button 
            type="button" 
            className={`type-btn ${tipo === 'diaria' ? 'active' : ''}`}
            onClick={() => setTipo('diaria')}
          >
            Diária
          </button>
          <button 
            type="button" 
            className={`type-btn ${tipo === 'mensal' ? 'active' : ''}`}
            onClick={() => setTipo('mensal')}
          >
            Mensal
          </button>
          <button 
            type="button" 
            className={`type-btn ${tipo === 'anual' ? 'active' : ''}`}
            onClick={() => setTipo('anual')}
          >
            Anual
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Título da Meta</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Ex: Ler 1 capítulo por dia" 
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
              required 
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Descrição (Opcional)</label>
            <textarea 
              className="form-textarea" 
              rows={2}
              placeholder="Detalhes ou motivação..."
              value={descricao}
              onChange={e => setDescricao(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Categoria</label>
              <select 
                className="form-select"
                value={categoria}
                onChange={e => setCategoria(e.target.value as CategoriaMeta)}
              >
                <option value="saude">Saúde</option>
                <option value="estudos">Estudos</option>
                <option value="financas">Finanças</option>
                <option value="carreira">Carreira</option>
                <option value="pessoal">Pessoal</option>
              </select>
            </div>

            {tipo !== 'diaria' && (
              <div className="form-group">
                <label className="form-label">Data Prazo</label>
                <input 
                  type="date" 
                  className="form-input"
                  value={dataPrazo}
                  onChange={e => setDataPrazo(e.target.value)}
                  required 
                />
              </div>
            )}
          </div>

          {/* Subtarefas Dinâmicas para Mensais e Anuais */}
          {tipo !== 'diaria' && (
            <div className="form-group" style={{ marginTop: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label className="form-label" style={{ margin: 0 }}>Etapas / Subtarefas</label>
                <button 
                  type="button" 
                  onClick={handleAddSubField}
                  style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '0.78rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                >
                  <Plus size={14} /> Adicionar
                </button>
              </div>

              {subtarefas.map((sub, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input 
                    type="text" 
                    className="form-input"
                    placeholder={`Etapa ${idx + 1}...`}
                    value={sub}
                    onChange={e => handleSubChange(idx, e.target.value)}
                  />
                  {subtarefas.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => handleRemoveSub(idx)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', padding: '0 6px', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          <button type="submit" className="btn-submit">
            Criar Meta
          </button>
        </form>
      </div>
    </div>
  );
};
