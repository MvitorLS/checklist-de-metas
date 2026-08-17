import React, { useState } from 'react';
import { MetasProvider } from './context/MetasContext';
import { BottomNav, ScreenTab } from './components/BottomNav';
import { NovaMetaModal } from './components/NovaMetaModal';
import { DashboardScreen } from './screens/DashboardScreen';
import { MetasDiariasScreen } from './screens/MetasDiariasScreen';
import { MetasMensaisScreen } from './screens/MetasMensaisScreen';
import { MetasAnuaisScreen } from './screens/MetasAnuaisScreen';
import { Target, CheckCircle2, Sparkles } from 'lucide-react';
import { TipoMeta } from './types/meta';

export default function App() {
  const [abaAtiva, setAbaAtiva] = useState<ScreenTab>('dashboard');
  const [modalCriarAberto, setModalCriarAberto] = useState(false);

  function getTipoPadrao(): TipoMeta {
    if (abaAtiva === 'diarias') return 'diaria';
    if (abaAtiva === 'mensais') return 'mensal';
    if (abaAtiva === 'anuais') return 'anual';
    return 'diaria';
  }

  return (
    <MetasProvider>
      <div className="mobile-viewport">
        {/* Header Fixo Mobile */}
        <header className="app-header">
          <div>
            <div className="header-greeting">Metas Pessoais</div>
            <h1 className="header-title">MetaCheck</h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="header-btn" title="MetaCheck Mobile App">
              <Target size={20} color="#38bdf8" />
            </div>
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

        {/* Barra de Navegação Inferior */}
        <BottomNav 
          abaAtiva={abaAtiva} 
          setAbaAtiva={setAbaAtiva} 
          abrirModalCriar={() => setModalCriarAberto(true)}
        />
      </div>
    </MetasProvider>
  );
}
