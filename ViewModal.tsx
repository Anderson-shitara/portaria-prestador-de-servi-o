
import React from 'react';
import { Resident, ResidentStatus } from '../types';
import { X, User, Home, Calendar, Phone, ShieldCheck } from 'lucide-react';

interface ViewModalProps {
  resident: Resident;
  onClose: () => void;
}

const ViewModal: React.FC<ViewModalProps> = ({ resident, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border-4 border-slate-950 overflow-hidden relative">
        {/* Header do Modal */}
        <div className="bg-slate-900 p-4 flex justify-between items-center border-b-4 border-slate-800">
          <div className="flex items-center gap-2 text-white">
            <ShieldCheck className="text-blue-400" size={24} />
            <h2 className="font-black tracking-widest text-lg uppercase">Ficha de Autorização</h2>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-800 text-white rounded-lg hover:bg-slate-950 transition-none active:scale-95">
            <X size={24} />
          </button>
        </div>

        {/* Conteúdo da Ficha */}
        <div className="p-8 space-y-6 bg-white">
          <div className="flex justify-between items-start border-b-4 border-slate-200 pb-4">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">CondoGuard Pro</p>
              <h3 className="text-3xl font-black text-slate-900 leading-none">{(resident.name || "").toUpperCase()}</h3>
              <p className="flex items-center gap-2 text-slate-700 font-bold text-lg uppercase tracking-tighter">
                <Home size={20} className="text-blue-600" /> RESIDÊNCIA #{resident.houseNumber}
              </p>
            </div>
            <div className={`px-4 py-2 rounded-xl border-2 font-black uppercase text-[10px] tracking-widest ${
              resident.status === ResidentStatus.ACTIVE ? 'bg-green-50 text-green-700 border-green-400' : 'bg-red-50 text-red-700 border-red-400'
            }`}>
              {resident.status}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-0 border-2 border-slate-600 rounded-xl overflow-hidden bg-slate-50">
            <div className="p-5 border-r-2 border-slate-600">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Contato do Morador</p>
              <p className="flex items-center gap-2 text-sm font-black text-slate-900">
                <Phone size={16} className="text-slate-400" /> {resident.phone}
              </p>
            </div>
            <div className="p-5 text-right">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Período Autorizado</p>
              <p className="flex items-center justify-end gap-2 text-sm font-black text-slate-900">
                <Calendar size={16} className="text-slate-400" /> {resident.startDate} — {resident.endDate}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center border-b border-slate-200 pb-2">
              Equipe de Trabalho Autorizada
            </p>
            <div className="grid grid-cols-1 gap-2">
              {(resident.providers || []).filter(p => p && p.name).map((p, i) => (
                <div key={i} className="flex justify-between items-center p-4 border-2 border-slate-400 rounded-xl bg-white shadow-sm">
                  <span className="font-bold text-slate-900 text-sm uppercase">{p.name}</span>
                  <span className="text-[10px] font-black font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-300">{p.document}</span>
                </div>
              ))}
              {(!resident.providers || resident.providers.filter(p => p && p.name).length === 0) && (
                <p className="text-center text-slate-400 font-bold uppercase py-6 border-2 border-dashed border-slate-200 text-[10px] tracking-widest">Nenhum prestador listado</p>
              )}
            </div>
          </div>
        </div>

        {/* Rodapé Discreto */}
        <div className="bg-slate-50 px-8 py-4 flex justify-between items-center border-t-2 border-slate-200">
          <div className="text-[8px] text-slate-400 font-black uppercase tracking-widest">
            SISTEMA DE GESTÃO PATRIMONIAL
          </div>
          <div className="text-[9px] text-slate-500 text-right font-bold uppercase">
            © 2026 Anderson Shitara | <span className="text-slate-900">34 99188-8277</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewModal;
