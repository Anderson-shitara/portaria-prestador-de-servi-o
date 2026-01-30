
import React, { useState } from 'react';
import { db } from '../db';
import { FileText, Info } from 'lucide-react';
import { pdfService } from '../pdfService';
import { ResidentStatus } from '../types';

const ReportsTab: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = () => {
    setIsGenerating(true);
    const allResidents = db.getResidents();
    
    // Período de 6 meses (aprox 180 dias)
    const sixMonthsInMs = 6 * 30 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    
    // Filtra para incluir Ativos e Desativados do período de 6 meses baseado na criação
    const reportResidents = allResidents.filter(r => (now - r.createdAt) <= sixMonthsInMs);
    
    try {
      pdfService.generateReport(reportResidents);
    } catch (error) {
      console.error("ERRO CRÍTICO NA GERAÇÃO:", error);
      alert("ERRO NO PROCESSAMENTO DO PDF.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white p-12 border-8 border-slate-900 flex flex-col items-center text-center space-y-8">
        <div className="w-24 h-24 bg-blue-50 text-blue-900 flex items-center justify-center border-4 border-slate-900">
          <FileText size={48} />
        </div>
        
        <div className="space-y-3">
          <h3 className="text-3xl font-black text-slate-950 tracking-tighter uppercase">Relatório Estrutural</h3>
          <p className="text-slate-700 max-w-sm font-black text-sm leading-tight uppercase tracking-tight">
            Extração de dados semestral contendo o histórico de moradores ATIVOS e DESATIVADOS dos últimos 6 meses.
          </p>
        </div>

        <button 
          onClick={handleGenerateReport}
          disabled={isGenerating}
          className={`w-full py-6 bg-slate-950 text-white font-black uppercase tracking-widest border-b-8 border-black active:bg-black transition-none ${isGenerating ? 'opacity-50' : ''}`}
        >
          {isGenerating ? "AGUARDE: PROCESSANDO DADOS..." : "EMITIR DOCUMENTO PDF"}
        </button>
      </div>

      <div className="bg-slate-950 p-8 border-4 border-black flex items-start gap-5">
        <div className="bg-blue-800 text-white p-2 border-2 border-slate-700">
          <div className="text-white font-black text-lg">!</div>
        </div>
        <div className="text-xs text-slate-400 font-black uppercase tracking-widest leading-relaxed">
          <p className="text-white mb-2 underline">PROTOCOLO DE SEGURANÇA:</p>
          <p>
            A GERAÇÃO DESTE DOCUMENTO É DE USO EXCLUSIVO DA ADMINISTRAÇÃO. 
            MANTENHA OS DADOS PROTEGIDOS. 
            © 2026 ANDERSON SHITARA | 34 99188-8277.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportsTab;
