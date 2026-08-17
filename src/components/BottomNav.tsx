import React from 'react';
import { Home, CheckSquare, CalendarDays, Target, BarChart2, Plus } from 'lucide-react';

export type ScreenTab = 'dashboard' | 'diarias' | 'mensais' | 'anuais' | 'stats';

interface BottomNavProps {
  abaAtiva: ScreenTab;
  setAbaAtiva: (aba: ScreenTab) => void;
  abrirModalCriar: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ abaAtiva, setAbaAtiva, abrirModalCriar }) => {
  return (
    <nav className="bottom-nav">
      <button 
        className={`nav-item ${abaAtiva === 'dashboard' ? 'active' : ''}`}
        onClick={() => setAbaAtiva('dashboard')}
      >
        <Home size={20} />
        <span>Início</span>
      </button>

      <button 
        className={`nav-item ${abaAtiva === 'diarias' ? 'active' : ''}`}
        onClick={() => setAbaAtiva('diarias')}
      >
        <CheckSquare size={20} />
        <span>Diárias</span>
      </button>

      {/* Botão Central de Nova Meta (FAB) */}
      <button className="nav-fab" onClick={abrirModalCriar} title="Criar Nova Meta">
        <Plus size={28} strokeWidth={2.5} />
      </button>

      <button 
        className={`nav-item ${abaAtiva === 'mensais' ? 'active' : ''}`}
        onClick={() => setAbaAtiva('mensais')}
      >
        <CalendarDays size={20} />
        <span>Mensais</span>
      </button>

      <button 
        className={`nav-item ${abaAtiva === 'anuais' ? 'active' : ''}`}
        onClick={() => setAbaAtiva('anuais')}
      >
        <Target size={20} />
        <span>Anuais</span>
      </button>
    </nav>
  );
};
