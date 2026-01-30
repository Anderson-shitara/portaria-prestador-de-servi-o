
import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { Resident, ResidentStatus, ServiceProvider } from '../types';
import { Save, Printer, UserPlus, Clock, Info } from 'lucide-react';
import { pdfService } from '../pdfService';

interface RegisterTabProps {
  editingResident: Resident | null;
  onFinished: () => void;
}

const RegisterTab: React.FC<RegisterTabProps> = ({ editingResident, onFinished }) => {
  const [formData, setFormData] = useState<Partial<Resident>>({
    name: '',
    houseNumber: '',
    phone: '',
    startDate: '',
    endDate: '',
    observations: '',
    status: ResidentStatus.ACTIVE,
    providers: Array(5).fill(null).map(() => ({ name: '', document: '' }))
  });

  useEffect(() => {
    if (editingResident) {
      // Garante que sempre existam 5 slots para prestadores na interface, mesmo ao editar registros com menos
      const providers = [...(editingResident.providers || [])];
      while (providers.length < 5) {
        providers.push({ name: '', document: '' });
      }
      setFormData({ ...editingResident, providers });
    }
  }, [editingResident]);

  const handleProviderChange = (index: number, field: keyof ServiceProvider, value: string) => {
    const currentProviders = formData.providers || [];
    const newProviders = [...currentProviders];
    if (newProviders[index]) {
      newProviders[index] = { ...newProviders[index], [field]: value };
      setFormData({ ...formData, providers: newProviders });
    }
  };

  const generateNextId = () => {
    const residents = db.getResidents();
    if (residents.length === 0) return "1";
    
    const ids = residents.map(r => parseInt(r.id)).filter(id => !isNaN(id));
    const maxId = ids.length > 0 ? Math.max(...ids) : 0;
    
    // Se passar de 1000, volta pro 1 ou continua (conforme pedido 1 a 1000)
    const next = maxId >= 1000 ? 1 : maxId + 1;
    return next.toString();
  };

  const handleSave = (print: boolean = false) => {
    if (!formData.name || !formData.houseNumber) {
      alert('POR FAVOR, PREENCHA OS CAMPOS OBRIGATÓRIOS.');
      return;
    }

    const residentToSave: Resident = {
      id: formData.id || generateNextId(),
      name: formData.name || '',
      houseNumber: formData.houseNumber || '',
      phone: formData.phone || '',
      startDate: formData.startDate || '',
      endDate: formData.endDate || '',
      observations: formData.observations || '',
      status: formData.status || ResidentStatus.ACTIVE,
      providers: (formData.providers || []).filter(p => p.name || p.document),
      createdAt: formData.createdAt || Date.now()
    };

    db.saveResident(residentToSave);
    
    if (print) {
      pdfService.generateResidentCard(residentToSave);
    }

    alert('DADOS SALVOS COM SUCESSO.');
    onFinished();
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl border-2 border-slate-600 shadow-lg space-y-3">
          <div className="flex items-center space-x-2 pb-1 border-b-2 border-slate-200">
            <Info className="text-blue-600" size={20} />
            <h3 className="font-black text-slate-800 uppercase tracking-tight text-xs">Dados Principais {formData.id && `(ID #${formData.id.padStart(3, '0')})`}</h3>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-[9px] font-black text-slate-400 uppercase mb-0.5 tracking-widest">Morador Responsável</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-500 rounded-lg outline-none focus:border-slate-900 font-bold uppercase transition-none text-xs" 
                value={formData.name || ''}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase mb-0.5 tracking-widest">Nº Casa</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-500 rounded-lg outline-none font-black text-center text-base transition-none" 
                  value={formData.houseNumber || ''}
                  onChange={e => setFormData({...formData, houseNumber: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase mb-0.5 tracking-widest">Telefone</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-500 rounded-lg outline-none font-bold transition-none text-xs" 
                  value={formData.phone || ''}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="flex items-center text-[9px] font-black text-slate-400 uppercase gap-1 tracking-widest mb-0.5">
                  <Clock size={10} /> Início
                </label>
                <input 
                  type="date" 
                  className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-500 rounded-lg outline-none font-bold transition-none text-xs" 
                  value={formData.startDate || ''}
                  onChange={e => setFormData({...formData, startDate: e.target.value})}
                />
              </div>
              <div>
                <label className="flex items-center text-[9px] font-black text-slate-400 uppercase gap-1 tracking-widest mb-0.5">
                  <Clock size={10} /> Término
                </label>
                <input 
                  type="date" 
                  className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-500 rounded-lg outline-none font-bold transition-none text-xs" 
                  value={formData.endDate || ''}
                  onChange={e => setFormData({...formData, endDate: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="block text-[9px] font-black text-slate-400 uppercase mb-0.5 tracking-widest">Observações (Anotação Manual)</label>
              <textarea 
                className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-500 rounded-lg outline-none focus:border-slate-900 font-bold transition-none text-xs h-24 resize-none" 
                placeholder="DESCREVA AQUI DETALHES IMPORTANTES PARA ANOTAÇÃO..."
                value={formData.observations || ''}
                onChange={e => setFormData({...formData, observations: e.target.value})}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border-2 border-slate-600 shadow-lg space-y-3">
          <div className="flex items-center space-x-2 pb-1 border-b-2 border-slate-200">
            <UserPlus className="text-blue-600" size={20} />
            <h3 className="font-black text-slate-800 uppercase tracking-tight text-xs">Equipe Autorizada</h3>
          </div>

          <div className="space-y-2 overflow-y-auto max-h-[350px] pr-1">
            {(formData.providers || []).map((p, idx) => (
              <div key={idx} className="p-2.5 bg-slate-50 border-2 border-slate-400 rounded-lg space-y-1.5">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Vaga {idx + 1}</p>
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="text" 
                    placeholder="NOME"
                    className="px-2 py-1.5 border border-slate-400 rounded-md text-[10px] font-bold uppercase transition-none outline-none focus:border-slate-900"
                    value={p.name || ''}
                    onChange={e => handleProviderChange(idx, 'name', e.target.value)}
                  />
                  <input 
                    type="text" 
                    placeholder="DOCUMENTO"
                    className="px-2 py-1.5 border border-slate-400 rounded-md text-[10px] font-mono font-bold transition-none outline-none focus:border-slate-900"
                    value={p.document || ''}
                    onChange={e => handleProviderChange(idx, 'document', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2 bg-white p-4 rounded-xl border-2 border-slate-600 shadow-xl">
        <button 
          onClick={onFinished}
          className="px-4 py-2 bg-slate-100 text-slate-600 font-bold uppercase text-[10px] rounded-lg hover:bg-slate-200 transition-none"
        >
          Cancelar
        </button>
        <button 
          onClick={() => handleSave(false)}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white font-bold uppercase text-[10px] rounded-lg hover:bg-slate-800 border-b-2 border-black transition-none"
        >
          <Save size={14} /> Salvar
        </button>
        <button 
          onClick={() => handleSave(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white font-bold uppercase text-[10px] rounded-lg hover:bg-blue-700 border-b-2 border-blue-900 transition-none"
        >
          <Printer size={14} /> Salvar + PDF
        </button>
      </div>
    </div>
  );
};

export default RegisterTab;
