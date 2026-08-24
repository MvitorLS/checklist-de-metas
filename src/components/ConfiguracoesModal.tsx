import React, { useRef, useState } from 'react';
import { X, Palette, Download, Upload, FileSpreadsheet, CheckCircle2, AlertCircle, RefreshCw, ShieldCheck } from 'lucide-react';
import { useMetas } from '../context/MetasContext';
import { TemaVisual } from '../types/meta';

interface ConfiguracoesModalProps {
  aberto: boolean;
  fechar: () => void;
}

export const ConfiguracoesModal: React.FC<ConfiguracoesModalProps> = ({ aberto, fechar }) => {
  const { tema, mudarTema, exportarBackupJSON, exportarCSV, importarBackupJSON, metas } = useMetas();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [feedback, setFeedback] = useState<{ tipo: 'sucesso' | 'erro'; msg: string } | null>(null);

  if (!aberto) return null;

  const TEMAS: { id: TemaVisual; nome: string; corBg: string; corAcento: string }[] = [
    { id: 'tokyo-dark', nome: 'Tokyo Dark', corBg: '#090d16', corAcento: '#38bdf8' },
    { id: 'oled', nome: 'OLED Black', corBg: '#000000', corAcento: '#10b981' },
    { id: 'light', nome: 'Porcelain Light', corBg: '#f1f5f9', corAcento: '#0284c7' },
    { id: 'cyberpunk', nome: 'Cyberpunk Neon', corBg: '#0d071a', corAcento: '#f43f5e' },
    { id: 'emerald', nome: 'Emerald Forest', corBg: '#041712', corAcento: '#34d399' }
  ];

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const ok = importarBackupJSON(content);
        if (ok) {
          setFeedback({
            tipo: 'sucesso',
            msg: 'Backup restaurado com sucesso!'
          });
        } else {
          setFeedback({
            tipo: 'erro',
            msg: 'Arquivo de backup inválido ou corrompido.'
          });
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  return (
    <div className="modal-overlay" onClick={fechar}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'rgba(56, 189, 248, 0.15)', color: 'var(--primary)', padding: '8px', borderRadius: '12px' }}>
              <Palette size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Aparência & Dados</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Personalização visual e backup das suas metas</p>
            </div>
          </div>
          <button onClick={fechar} className="header-btn">
            <X size={18} />
          </button>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: feedback.tipo === 'sucesso' ? 'rgba(52, 211, 153, 0.12)' : 'rgba(244, 63, 94, 0.12)',
            border: feedback.tipo === 'sucesso' ? '1px solid rgba(52, 211, 153, 0.3)' : '1px solid rgba(244, 63, 94, 0.3)',
            color: feedback.tipo === 'sucesso' ? '#34d399' : '#f43f5e',
            borderRadius: '12px',
            padding: '10px 14px',
            fontSize: '0.8rem',
            marginBottom: '16px'
          }}>
            {feedback.tipo === 'sucesso' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{feedback.msg}</span>
          </div>
        )}

        {/* Seção de Temas */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-dim)', marginBottom: '10px' }}>
            Paleta de Cores
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '8px' }}>
            {TEMAS.map(t => {
              const isAtivo = tema === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => mudarTema(t.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px 8px',
                    borderRadius: '12px',
                    background: isAtivo ? 'rgba(56, 189, 248, 0.12)' : 'var(--bg-card)',
                    border: isAtivo ? `2px solid ${t.corAcento}` : '1px solid var(--border)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: t.corBg,
                    border: `3px solid ${t.corAcento}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isAtivo ? `0 0 10px ${t.corAcento}50` : 'none'
                  }}>
                    {isAtivo && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: t.corAcento }} />}
                  </div>
                  <span style={{ fontSize: '0.74rem', fontWeight: isAtivo ? 800 : 600, color: isAtivo ? 'var(--primary)' : 'var(--text-main)' }}>
                    {t.nome}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Seção de Backup & Exportação */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-dim)', marginBottom: '10px' }}>
            Backup & Exportação
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Exportar JSON */}
            <button
              onClick={exportarBackupJSON}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: '12px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                color: 'var(--text-main)',
                cursor: 'pointer',
                fontSize: '0.86rem',
                fontWeight: 600
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Download size={18} color="var(--primary)" />
                <span>Exportar Backup Completo (JSON)</span>
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{metas.length} metas</span>
            </button>

            {/* Exportar CSV */}
            <button
              onClick={exportarCSV}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: '12px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                color: 'var(--text-main)',
                cursor: 'pointer',
                fontSize: '0.86rem',
                fontWeight: 600
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileSpreadsheet size={18} color="#34d399" />
                <span>Exportar Relatório em Planilha (CSV)</span>
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Excel / Sheets</span>
            </button>

            {/* Importar JSON */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept=".json" 
              style={{ display: 'none' }} 
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: '12px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                color: 'var(--text-main)',
                cursor: 'pointer',
                fontSize: '0.86rem',
                fontWeight: 600
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Upload size={18} color="#818cf8" />
                <span>Restaurar Backup (JSON)</span>
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Upload</span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 12px',
          background: 'rgba(255, 255, 255, 0.02)',
          borderRadius: '10px',
          fontSize: '0.74rem',
          color: 'var(--text-dim)'
        }}>
          <ShieldCheck size={16} color="var(--primary)" />
          <span>Seus dados ficam 100% salvos no seu aparelho de forma privada.</span>
        </div>
      </div>
    </div>
  );
};
