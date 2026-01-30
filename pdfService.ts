
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Resident, ServiceProvider } from './types';

export const pdfService = {
  generateResidentCard: (resident: Resident) => {
    const doc = new jsPDF();
    
    const drawCard = (yOffset: number) => {
      const pageWidth = doc.internal.pageSize.width;
      
      // Background and Border
      doc.setDrawColor(30, 41, 59); // Slate-800
      doc.setLineWidth(3.0); 
      doc.rect(10, yOffset, 190, 135);
      
      // Discrete Header - Developer Info
      doc.setFontSize(6);
      doc.setTextColor(71, 85, 105); // Slate-600
      doc.text(`DESENVOLVEDOR ANDERSON SHITARA | (34) 99188-8277`, 195, yOffset + 4, { align: 'right' });

      // Header Bar
      doc.setFillColor(241, 245, 249);
      doc.rect(10.6, yOffset + 0.6, 188.8, 14, 'F');
      
      doc.setFontSize(14);
      doc.setTextColor(30, 41, 59);
      doc.setFont('helvetica', 'bold');
      doc.text('FICHA DE CONTROLE DE ACESSO - CONDOGUARD PRO', 105, yOffset + 10, { align: 'center' });
      
      doc.setLineWidth(0.5);
      doc.line(10, yOffset + 15, 200, yOffset + 15);
      
      // Resident Data Section
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('DADOS DO MORADOR / OBRA', 15, yOffset + 22);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Morador: ${(resident.name || "---").toUpperCase()}`, 15, yOffset + 28);
      doc.text(`Casa: ${resident.houseNumber}`, 15, yOffset + 34);
      doc.text(`Telefone: ${resident.phone}`, 15, yOffset + 40);
      
      doc.text(`Início da Obra: ${resident.startDate}`, 110, yOffset + 34);
      doc.text(`Previsão de Fim: ${resident.endDate}`, 110, yOffset + 40);
      
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.2);
      doc.line(15, yOffset + 45, 195, yOffset + 45);
      
      // Providers Header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(51, 65, 85);
      doc.text('PRESTADORES DE SERVIÇO AUTORIZADOS', 105, yOffset + 51, { align: 'center' });
      
      // Table Layout for Providers
      doc.setFillColor(248, 250, 252);
      doc.rect(15, yOffset + 55, 180, 7, 'F');
      doc.setDrawColor(30, 41, 59);
      doc.setLineWidth(0.5);
      doc.rect(15, yOffset + 55, 180, 7);
      
      doc.setFontSize(9);
      doc.text('NOME COMPLETO', 20, yOffset + 60);
      doc.text('DOCUMENTO (CPF/RG)', 110, yOffset + 60);
      
      // Provider Rows
      const providers = resident.providers || [];
      providers.forEach((p, i) => {
        const rowY = yOffset + 62 + (i * 11);
        doc.setLineWidth(0.3);
        doc.rect(15, rowY, 180, 11);
        doc.setFont('helvetica', 'normal');
        doc.text(p.name ? p.name.toUpperCase() : '---', 20, rowY + 7);
        doc.text(p.document || '---', 110, rowY + 7);
      });
      
      // Signature Area
      const sigY = yOffset + 125;
      doc.line(120, sigY, 190, sigY);
      doc.setFontSize(7);
      doc.text('ASSINATURA DO RESPONSÁVEL / SEGURANÇA', 155, sigY + 4, { align: 'center' });
      
      doc.text(`Emitido em: ${new Date().toLocaleString()}`, 15, sigY + 4);

      // Footer Professional & Discrete
      doc.setFontSize(7);
      doc.setTextColor(71, 85, 105); 
      doc.setFont('helvetica', 'bold');
      const footerText = `DESENVOLVEDOR ANDERSON SHITARA | (34) 99188-8277`;
      doc.text(footerText.toUpperCase(), 105, yOffset + 132, { align: 'center' });
    };

    drawCard(5);
    drawCard(150);

    const safeName = (resident.name || "Ficha").replace(/\s+/g, '_');
    doc.save(`${safeName}.pdf`);
  },

  generateReport: (residents: Resident[]) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    
    const addFooter = () => {
      // Professional line
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.1);
      doc.line(20, pageHeight - 15, pageWidth - 20, pageHeight - 15);

      doc.setFontSize(7);
      doc.setTextColor(71, 85, 105);
      doc.setFont('helvetica', 'bold');
      const pageInfo = `PÁGINA ${doc.getCurrentPageInfo().pageNumber}`;
      const devInfo = `DESENVOLVEDOR ANDERSON SHITARA | (34) 99188-8277`;
      const footerText = `${pageInfo}   |   ${devInfo}`;
      doc.text(footerText.toUpperCase(), pageWidth / 2, pageHeight - 10, { align: 'center' });
    };

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('RELATÓRIO SEMESTRAL DE OBRAS E SERVIÇOS', 105, 15, { align: 'center' });
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`Gerado em: ${new Date().toLocaleString()}`, 105, 22, { align: 'center' });
    
    const tableData = residents.map(r => [
      (r.name || "").toUpperCase(),
      r.houseNumber,
      r.startDate,
      r.endDate,
      (r.status || "").toUpperCase(),
      (r.providers || []).map(p => p.name?.toUpperCase()).filter(n => n).join(', ')
    ]);

    autoTable(doc, {
      startY: 30,
      head: [['MORADOR', 'CASA', 'INÍCIO', 'FIM', 'STATUS', 'PRESTADORES']],
      body: tableData,
      headStyles: { fillColor: [30, 41, 59], fontSize: 9, halign: 'center', fontStyle: 'bold' },
      styles: { fontSize: 8, cellPadding: 3, valign: 'middle' },
      columnStyles: {
        0: { fontStyle: 'bold' },
        1: { halign: 'center' },
        4: { halign: 'center' },
        5: { cellWidth: 50 }
      },
      didDrawPage: () => {
        addFooter();
      }
    });

    doc.save('Relatorio_Semestral_CondoGuard.pdf');
  }
};
