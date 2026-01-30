
import React, { useState } from 'react';
import { AccessLevel, Resident } from './types';
import Layout from './components/Layout';
import SearchTab from './components/SearchTab';
import RegisterTab from './components/RegisterTab';
import ReportsTab from './components/ReportsTab';
import ViewModal from './components/ViewModal';
import { Lock, Eye, ShieldCheck, Phone } from 'lucide-react';

const App: React.FC = () => {
  const [accessLevel, setAccessLevel] = useState<AccessLevel | null>(null);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('search');
  const [editingResident, setEditingResident] = useState<Resident | null>(null);
  const [viewingResident, setViewingResident] = useState<Resident | null>(null);

  const handleLogin = (level: AccessLevel) => {
    if (level === AccessLevel.ADMIN) {
      if (password === '1234') {
        setAccessLevel(AccessLevel.ADMIN);
        setActiveTab('search');
      } else {
        alert('Senha de administrador incorreta!');
      }
    } else {
      setAccessLevel(AccessLevel.VIEWER);
      setActiveTab('search');
    }
  };

  const handleEditResident = (resident: Resident) => {
    setEditingResident(resident);
    setActiveTab('register');
  };

  if (!accessLevel) {
    return (
      <div className="min-h-screen bg-slate-200 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border-4 border-slate-800 overflow-hidden">
          <div className="p-8 text-center space-y-6">
            <div className="space-y-2">
              <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-xl border-2 border-slate-700">
                <ShieldCheck size={32} />
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">CondoGuard Pro</h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Gestão Residencial</p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="password"
                  placeholder="Senha Administrativa"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-600 rounded-xl focus:ring-2 focus:ring-slate-900 outline-none font-mono text-center tracking-widest transition-none text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin(AccessLevel.ADMIN)}
                />
              </div>

              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => handleLogin(AccessLevel.ADMIN)}
                  className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 shadow-lg flex items-center justify-center gap-2 border-b-4 border-black transition-none"
                >
                  <Lock size={16} />
                  <span className="text-xs">ACESSO TOTAL</span>
                </button>
                <button
                  onClick={() => handleLogin(AccessLevel.VIEWER)}
                  className="w-full py-3 bg-white border-2 border-slate-700 text-slate-700 rounded-xl font-bold hover:bg-slate-50 flex items-center justify-center gap-2 transition-none"
                >
                  <Eye size={16} />
                  <span className="text-xs">VISUALIZAÇÃO</span>
                </button>
              </div>
            </div>

            <div className="pt-6 border-t-2 border-slate-200 space-y-1">
              <p className="text-[10px] font-black text-slate-800 uppercase tracking-tighter">
                © 2026 Anderson Shitara
              </p>
              <div className="flex items-center justify-center gap-1 text-[10px] text-slate-500 font-bold">
                <Phone size={10} className="text-blue-600" />
                <span>34 99188-8277</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout 
      accessLevel={accessLevel} 
      onLogout={() => { setAccessLevel(null); setPassword(''); setActiveTab('search'); }} 
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      {activeTab === 'search' && (
        <SearchTab 
          accessLevel={accessLevel} 
          onEdit={handleEditResident} 
          onView={(resident) => setViewingResident(resident)}
        />
      )}
      {activeTab === 'register' && accessLevel === AccessLevel.ADMIN && (
        <RegisterTab 
          editingResident={editingResident} 
          onFinished={() => { setEditingResident(null); setActiveTab('search'); }} 
        />
      )}
      {activeTab === 'reports' && accessLevel === AccessLevel.ADMIN && (
        <ReportsTab />
      )}

      {viewingResident && (
        <ViewModal 
          resident={viewingResident} 
          onClose={() => setViewingResident(null)} 
        />
      )}
    </Layout>
  );
};

export default App;
