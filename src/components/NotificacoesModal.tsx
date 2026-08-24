import React, { useState } from 'react';
import { X, Bell, BellRing, Clock, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { useMetas } from '../context/MetasContext';

interface NotificacoesModalProps {
  aberto: boolean;
  fechar: () => void;
}

export const NotificacoesModal: React.FC<NotificacoesModalProps> = ({ aberto, fechar }) => {
  const { configNotificacoes, atualizarConfigNotificacoes, testarNotificacao } = useMetas();
  const [testando, setTestando] = useState(false);
  const [feedback, setFeedback] = useState<{ tipo: 'sucesso' | 'erro'; msg: string } | null>(null);

  if (!aberto) return null;

  async function handleTestar() {
    setTestando(true);
    setFeedback(null);
    try {
      const ok = await testarNotificacao();
      if (ok) {
        setFeedback({
          tipo: 'sucesso',
          msg: 'Notificação enviada com sucesso! Olhe a barra de notificações do seu celular.'
        });
      } else {
        setFeedback({
          tipo: 'erro',
          msg: 'Permissão de notificação não foi concedida nas configurações do dispositivo.'
        });
      }
    } catch (e) {
      setFeedback({
        tipo: 'erro',
        msg: 'Não foi possível disparar a notificação.'
      });
    } finally {
      setTestando(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={fechar}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        {/* Header do Modal */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '8px', borderRadius: '12px' }}>
              <BellRing size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Notificações & Alarmes</h3>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Lembretes para não perder o foco nas suas metas</p>
            </div>
          </div>
          <button onClick={fechar} className="header-btn">
            <X size={18} />
          </button>
        </div>

        {/* Toggle Principal */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: configNotificacoes.ativado ? 'rgba(56, 189, 248, 0.1)' : 'rgba(255, 255, 255, 0.04)',
          border: configNotificacoes.ativado ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '14px 16px',
          marginBottom: '16px',
          transition: 'all 0.2s ease'
        }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Lembretes Ativos</div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
              {configNotificacoes.ativado ? 'Notificações diárias agendadas' : 'Notificações desativadas'}
            </div>
          </div>

          <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '26px', cursor: 'pointer' }}>
            <input 
              type="checkbox"
              checked={configNotificacoes.ativado}
              onChange={e => atualizarConfigNotificacoes({ ativado: e.target.checked })}
              style={{ opacity: 0, width: 0, height: 0 }}
            />
            <span style={{
              position: 'absolute',
              cursor: 'pointer',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: configNotificacoes.ativado ? '#38bdf8' : '#334155',
              transition: '0.3s',
              borderRadius: '26px'
            }}>
              <span style={{
                position: 'absolute',
                content: '""',
                height: '20px',
                width: '20px',
                left: configNotificacoes.ativado ? '24px' : '4px',
                bottom: '3px',
                backgroundColor: '#ffffff',
                transition: '0.3s',
                borderRadius: '50%'
              }} />
            </span>
          </label>
        </div>

        {/* Configurações de Horário */}
        {configNotificacoes.ativado && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            {/* Lembrete Matinal */}
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '14px', padding: '12px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={16} color="#fbbf24" />
                  <span style={{ fontSize: '0.88rem', fontWeight: 700 }}>☀️ Lembrete Matinal</span>
                </div>
                <input 
                  type="time" 
                  value={configNotificacoes.horarioMatinal}
                  onChange={e => atualizarConfigNotificacoes({ horarioMatinal: e.target.value })}
                  style={{
                    background: 'rgba(15, 23, 42, 0.8)',
                    color: '#f8fafc',
                    border: '1px solid rgba(56, 189, 248, 0.4)',
                    borderRadius: '8px',
                    padding: '4px 8px',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    outline: 'none'
                  }}
                />
              </div>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Avisa suas metas do dia logo cedo para planejar seu foco.</p>
            </div>

            {/* Lembrete Noturno */}
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '14px', padding: '12px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={16} color="#818cf8" />
                  <span style={{ fontSize: '0.88rem', fontWeight: 700 }}>🌙 Revisão Noturna</span>
                </div>
                <input 
                  type="time" 
                  value={configNotificacoes.horarioNoturno}
                  onChange={e => atualizarConfigNotificacoes({ horarioNoturno: e.target.value })}
                  style={{
                    background: 'rgba(15, 23, 42, 0.8)',
                    color: '#f8fafc',
                    border: '1px solid rgba(56, 189, 248, 0.4)',
                    borderRadius: '8px',
                    padding: '4px 8px',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    outline: 'none'
                  }}
                />
              </div>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Lembra você de marcar as metas pendentes antes de terminar o dia.</p>
            </div>

            {/* Toggles Secundários */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.84rem', color: '#cbd5e1', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={configNotificacoes.comemorarConclusao}
                  onChange={e => atualizarConfigNotificacoes({ comemorarConclusao: e.target.checked })}
                  style={{ accentColor: '#38bdf8', width: '16px', height: '16px' }}
                />
                <span>🎉 Notificação comemorativa ao bater 100%</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.84rem', color: '#cbd5e1', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={configNotificacoes.lembreteIndividual}
                  onChange={e => atualizarConfigNotificacoes({ lembreteIndividual: e.target.checked })}
                  style={{ accentColor: '#38bdf8', width: '16px', height: '16px' }}
                />
                <span>⏰ Lembretes específicos por meta individual</span>
              </label>
            </div>
          </div>
        )}

        {/* Feedback visual de teste */}
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

        {/* Botão de Teste */}
        <button
          onClick={handleTestar}
          disabled={testando}
          className="btn-primary"
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
            color: '#090d16',
            fontWeight: 800,
            padding: '12px',
            borderRadius: '14px'
          }}
        >
          <Bell size={18} />
          <span>{testando ? 'Enviando...' : '🔔 Testar Notificação Agora'}</span>
        </button>
      </div>
    </div>
  );
};
