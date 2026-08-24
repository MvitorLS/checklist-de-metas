import React, { useState } from 'react';
import { MetasProvider, useMetas } from './context/MetasContext';
import { BottomNav, ScreenTab } from './components/BottomNav';
import { NovaMetaModal } from './components/NovaMetaModal';
import { NotificacoesModal } from './components/NotificacoesModal';
import { DashboardScreen } from './screens/DashboardScreen';
import { MetasDiariasScreen } from './screens/MetasDiariasScreen';
import { MetasMensaisScreen } from './screens/MetasMensaisScreen';
import { MetasAnuaisScreen } from './screens/MetasAnuaisScreen';
import { Bell, BellRing } from 'lucide-react';
import { TipoMeta } from './types/meta';

function MainApp() {
  const [abaAtiva, setAbaAtiva] = useState<ScreenTab>('dashboard');
  const [modalCriarAberto, setModalCriarAberto] = useState(false);
  const [modalNotificacoesAberto, setModalNotificacoesAberto] = useState(false);
  const { configNotificacoes } = useMetas();

  function getTipoPadrao(): TipoMeta {
    if (abaAtiva === 'diarias') return 'diaria';
    if (abaAtiva === 'mensais') return 'mensal';
    if (abaAtiva === 'anuais') return 'anual';
    return 'diaria';
  }

  return (
    <div className="mobile-viewport">
      {/* Header Fixo Mobile */}
      <header className="app-header">
        <div>
          <div className="header-greeting">Metas Pessoais</div>
          <h1 className="header-title">MetaCheck</h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            className="header-btn" 
            onClick={() => setModalNotificacoesAberto(true)}
            title="Configurar Lembretes e Notificações"
            style={{ position: 'relative' }}
          >
            {configNotificacoes.ativado ? (
              <BellRing size={20} color="#38bdf8" />
            ) : (
              <Bell size={20} color="#94a3b8" />
            )}
            {configNotificacoes.ativado && (
              <span style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#38bdf8',
                boxShadow: '0 0 8px #38bdf8'
              }} />
            )}
          </button>
        </div>
      </header>

      {/* Telas Principais */}
      {abaAtiva === 'dashboard' && <DashboardScreen />}
      {abaAtiva === 'diarias' && <MetasDiariasScreen />}
      {abaAtiva === 'mensais' && <MetasMensaisScreen />}
      {abaAtiva === 'anuais' && <MetasAnuaisScreen />}

      {/* Modal de Criação */}
      <NovaMetaModal 
        aberto={modalCriarAberto} 
        fechar={() => setModalCriarAberto(false)} 
        tipoPadrao={getTipoPadrao()}
      />

      {/* Modal de Notificações & Lembretes */}
      <NotificacoesModal 
        aberto={modalNotificacoesAberto}
        fechar={() => setModalNotificacoesAberto(false)}
      />

      {/* Barra de Navegação Inferior */}
      <BottomNav 
        abaAtiva={abaAtiva} 
        setAbaAtiva={setAbaAtiva} 
        abrirModalCriar={() => setModalCriarAberto(true)}
      />
    </div>
  );
}

export default function App() {
  return (
    <MetasProvider>
      <MainApp />
    </MetasProvider>
  );
}
