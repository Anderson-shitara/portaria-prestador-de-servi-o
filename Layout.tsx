
import React from 'react';
import { AccessLevel, StorageInfo } from '../types';
import { db } from '../db';
import { User, Phone, Shield, Database, AlertTriangle } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  accessLevel: AccessLevel;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, accessLevel, onLogout, activeTab, setActiveTab }) => {
  const storage = db.getStorageInfo();
  const isStorageCritical = storage.percentage >= 85;

  return (
    <div className="flex h-screen overflow-hidden text-slate-900 bg-slate-100">
      {/* Sidebar - Reduced from w-64 to w-56 */}
      <aside className="w-56 bg-slate-900 text-white flex flex-col border-r-4 border-slate-950 shadow-xl">
        <div className="p-4 border-b-2 border-slate-700">
          <h1 className="text-lg font-bold tracking-tight text-blue-400 uppercase leading-tight">CondoGuard Pro</h1>
          <p className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">Gestão de Prestadores</p>
        </div>

        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          <button
            onClick={() => setActiveTab('search')}
            className={`w-full flex items-center space-x-2 px-3 py-2.5 rounded-lg transition-none ${
              activeTab === 'search' ? 'bg-blue-600 text-white shadow-lg border-b-2 border-blue-800' : 'hover:bg-slate-800 text-slate-300'
            }`}
          >
            <Database size={18} />
            <span className="font-bold uppercase text-[11px] tracking-wider">Pesquisa</span>
          </button>

          {accessLevel === AccessLevel.ADMIN && (
            <>
              <button
                onClick={() => setActiveTab('register')}
                className={`w-full flex items-center space-x-2 px-3 py-2.5 rounded-lg transition-none ${
                  activeTab === 'register' ? 'bg-blue-600 text-white shadow-lg border-b-2 border-blue-800' : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <User size={18} />
                <span className="font-bold uppercase text-[11px] tracking-wider">Cadastro</span>
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`w-full flex items-center space-x-2 px-3 py-2.5 rounded-lg transition-none ${
                  activeTab === 'reports' ? 'bg-blue-600 text-white shadow-lg border-b-2 border-blue-800' : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <Shield size={18} />
                <span className="font-bold uppercase text-[11px] tracking-wider">Relatórios</span>
              </button>
            </>
          )}
        </nav>

        <div className="p-3 border-t-2 border-slate-700 bg-slate-900/50">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center border-2 border-slate-600">
              <User size={16} className="text-blue-400" />
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] font-bold truncate">Perfil: {accessLevel}</p>
              <button onClick={onLogout} className="text-[9px] text-slate-400 hover:text-white underline transition-none">
                Sair do sistema
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-slate-100">
        {/* Header - Reduced from h-16 to h-12 */}
        <header className="h-12 bg-white border-b-4 border-slate-600 flex items-center px-6 justify-between shadow-sm z-10">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-tighter">
            {activeTab === 'search' ? '🔎 Consulta de Moradores' : 
             activeTab === 'register' ? '📝 Novo Cadastro de Obra' : 
             '📊 Central de Relatórios'}
          </h2>
          <div className="flex items-center space-x-4 text-[10px] text-slate-500 font-bold">
            <span className="flex items-center gap-1 border-2 border-slate-400 px-2 py-0.5 rounded-full">
              <Shield size={12} className="text-green-500" />
              CONEXÃO SEGURA
            </span>
          </div>
        </header>

        {/* Content Area - Reduced padding from p-8 to p-5 */}
        <section className="flex-1 overflow-y-auto p-5">
          <div className="max-w-6xl mx-auto h-full">
            {children}
          </div>
        </section>

        {/* Footer - Reduced from h-14 to h-10 */}
        <footer className="h-10 bg-white border-t-4 border-slate-600 px-6 flex items-center justify-between text-[9px] text-slate-600 font-bold">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <span className="text-slate-800 uppercase tracking-tighter">© 2026 Anderson Shitara</span>
            </div>
            <div className="flex items-center space-x-1 border-l-2 border-slate-200 pl-3">
              <Phone size={12} className="text-blue-600" />
              <span className="text-slate-600">34 99188-8277</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex flex-col items-end">
              <div className="flex items-center space-x-2 uppercase tracking-tighter leading-none mb-0.5">
                {isStorageCritical && <AlertTriangle size={10} className="text-red-500" />}
                <span>
                  Uso: {storage.percentage.toFixed(1)}%
                </span>
              </div>
              <div className="w-32 h-1.5 bg-slate-200 rounded-full overflow-hidden border border-slate-400">
                <div 
                  className={`h-full transition-none ${isStorageCritical ? 'bg-red-500' : 'bg-blue-600'}`}
                  style={{ width: `${Math.min(100, storage.percentage)}%` }}
                ></div>
              </div>
            </div>
            <div className="text-right border-l-2 border-slate-200 pl-3">
              <span className="text-slate-800 font-black">{storage.used} / {storage.total}</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Layout;
