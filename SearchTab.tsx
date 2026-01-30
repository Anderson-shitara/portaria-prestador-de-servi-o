
import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { Resident, ResidentStatus, AccessLevel } from '../types';
import { Search, Edit2, CheckCircle, XCircle, Eye } from 'lucide-react';

interface SearchTabProps {
  accessLevel: AccessLevel;
  onEdit: (resident: Resident) => void;
  onView: (resident: Resident) => void;
}

const SearchTab: React.FC<SearchTabProps> = ({ accessLevel, onEdit, onView }) => {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadResidents();
  }, []);

  const loadResidents = () => {
    const currentResidents = db.getResidents();
    setResidents([...currentResidents]);
  };

  const filtered = residents.filter(r => {
    const name = (r.name || "").toLowerCase();
    const house = (r.houseNumber || "").toLowerCase();
    const term = searchTerm.toLowerCase();
    return name.includes(term) || house.includes(term);
  });

  const toggleStatus = (id: string, currentStatus: ResidentStatus) => {
    if (accessLevel !== AccessLevel.ADMIN) return;
    const newStatus = currentStatus === ResidentStatus.ACTIVE ? ResidentStatus.INACTIVE : ResidentStatus.ACTIVE;
    db.updateStatus(id, newStatus);
    loadResidents();
  };

  return (
    <div className="space-y-4">
      {/* Filtros de Busca */}
      <div className="bg-white p-4 rounded-xl border-2 border-slate-600 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="PESQUISAR POR NOME OU CASA..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-500 rounded-lg outline-none text-sm text-slate-800 font-bold transition-none focus:border-slate-900"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabela de Resultados */}
      <div className="bg-white rounded-xl border-2 border-slate-700 shadow-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b-2 border-slate-600">
              <th className="px-4 py-3 font-black text-slate-500 text-[9px] uppercase tracking-widest text-center">ID</th>
              <th className="px-4 py-3 font-black text-slate-500 text-[9px] uppercase tracking-widest">Morador</th>
              <th className="px-4 py-3 font-black text-slate-500 text-[9px] uppercase tracking-widest text-center">Unidade</th>
              <th className="px-4 py-3 font-black text-slate-500 text-[9px] uppercase tracking-widest">Prazos</th>
              <th className="px-4 py-3 font-black text-slate-500 text-[9px] uppercase tracking-widest text-center">Status</th>
              <th className="px-4 py-3 font-black text-slate-500 text-[9px] uppercase tracking-widest text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length > 0 ? filtered.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50 transition-none">
                <td className="px-4 py-2.5 text-center font-mono text-[10px] text-slate-400 font-bold">#{r.id.padStart(3, '0')}</td>
                <td className="px-4 py-2.5">
                  <div className="font-bold text-slate-900 text-xs">{(r.name || "").toUpperCase()}</div>
                  <div className="text-[9px] text-slate-500 font-bold font-mono">{r.phone}</div>
                </td>
                <td className="px-4 py-2.5 text-slate-900 font-black text-center text-base">#{r.houseNumber}</td>
                <td className="px-4 py-2.5">
                  <div className="text-[9px] font-bold text-slate-600 tracking-tight uppercase leading-none">DE: {r.startDate}</div>
                  <div className="text-[9px] font-bold text-slate-600 tracking-tight uppercase leading-none mt-1">ATÉ: {r.endDate}</div>
                </td>
                <td className="px-4 py-2.5 text-center">
                  <span className={`inline-flex px-2 py-0.5 rounded-full border-2 font-black text-[8px] uppercase tracking-widest ${
                    r.status === ResidentStatus.ACTIVE 
                      ? 'bg-green-50 text-green-700 border-green-400' 
                      : 'bg-red-50 text-red-700 border-red-400'
                  }`}>
                    {r.status}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-right space-x-0.5">
                  <button 
                    onClick={() => onView(r)}
                    className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-none"
                    title="VISUALIZAR"
                  >
                    <Eye size={16} />
                  </button>
                  {accessLevel === AccessLevel.ADMIN && (
                    <>
                      <button 
                        onClick={() => onEdit(r)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-none"
                        title="EDITAR"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => toggleStatus(r.id, r.status)}
                        className={`p-1.5 transition-none rounded-md ${
                          r.status === ResidentStatus.ACTIVE 
                            ? 'text-slate-500 hover:text-amber-600 hover:bg-amber-50' 
                            : 'text-slate-500 hover:text-green-600 hover:bg-green-50'
                        }`}
                        title={r.status === ResidentStatus.ACTIVE ? "DESATIVAR" : "ATIVAR"}
                      >
                        {r.status === ResidentStatus.ACTIVE ? <XCircle size={16} /> : <CheckCircle size={16} />}
                      </button>
                    </>
                  )}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                  Nenhum registro encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SearchTab;
