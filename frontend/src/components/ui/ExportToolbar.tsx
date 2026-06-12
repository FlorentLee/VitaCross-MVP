"use client";

import React from 'react';

interface Column {
  key: string;
  label: string;
}

interface ExportToolbarProps {
  data: Record<string, any>[];
  columns: Column[];
  filenamePrefix?: string;
}

// ── CSV export (native, no deps) ───────────────────────────────────────────
function exportCSV(data: Record<string, any>[], columns: Column[], filename: string) {
  const header = columns.map(c => `"${c.label}"`).join(',');
  const rows = data.map(row =>
    columns.map(c => {
      const val = row[c.key] ?? '';
      return `"${String(val).replace(/"/g, '""')}"`;
    }).join(',')
  );
  const csv = [header, ...rows].join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' }); // BOM for Excel
  triggerDownload(blob, `${filename}.csv`);
}

// ── Word export (HTML blob as .doc, zero extra deps) ───────────────────────
function exportWord(data: Record<string, any>[], columns: Column[], filename: string) {
  const thead = columns.map(c => `<th style="background:#2563EB;color:#fff;padding:8px 12px;border:1px solid #ddd;">${c.label}</th>`).join('');
  const tbody = data.map((row, i) => {
    const bg = i % 2 === 0 ? '#F8FAFC' : '#FFFFFF';
    const tds = columns.map(c => `<td style="padding:7px 12px;border:1px solid #ddd;">${row[c.key] ?? ''}</td>`).join('');
    return `<tr style="background:${bg};">${tds}</tr>`;
  }).join('');

  const html = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office'
          xmlns:w='urn:schemas-microsoft-com:office:word'
          xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'><title>VitaCross Export</title></head>
    <body>
      <h2 style="font-family:sans-serif;color:#2563EB;">VitaCross — ${filename}</h2>
      <table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:13px;">
        <thead><tr>${thead}</tr></thead>
        <tbody>${tbody}</tbody>
      </table>
    </body></html>`;
  const blob = new Blob([html], { type: 'application/msword' });
  triggerDownload(blob, `${filename}.doc`);
}

// ── PDF export (jsPDF + autotable) ─────────────────────────────────────────
async function exportPDF(data: Record<string, any>[], columns: Column[], filename: string) {
  try {
    const jsPDFModule = await import('jspdf');
    const autoTableModule = await import('jspdf-autotable');
    const jsPDF = jsPDFModule.default;
    const autoTable = autoTableModule.default;

    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

    // Header
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, 297, 18, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('VitaCross | AI Medical & Payment Platform', 10, 12);
    doc.setFontSize(9);
    doc.text(`Export: ${filename}  |  ${new Date().toLocaleDateString('zh-CN')}`, 200, 12);

    autoTable(doc, {
      startY: 22,
      head: [columns.map(c => c.label)],
      body: data.map(row => columns.map(c => String(row[c.key] ?? ''))),
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      margin: { top: 22, left: 10, right: 10 },
    });

    doc.save(`${filename}.pdf`);
  } catch (err) {
    console.error('[VitaCross] PDF export failed — jsPDF not installed?', err);
    alert('PDF 导出失败，请确认已安装 jspdf 和 jspdf-autotable 依赖。');
  }
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ── Component ──────────────────────────────────────────────────────────────
export default function ExportToolbar({ data, columns, filenamePrefix = 'vitacross_export' }: ExportToolbarProps) {
  const filename = `${filenamePrefix}_${new Date().toISOString().slice(0, 10)}`;

  if (!data || data.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-text-muted font-medium mr-1">导出:</span>
      <button
        onClick={() => exportCSV(data, columns, filename)}
        title="导出 CSV"
        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border border-border-dark bg-white hover:bg-success/5 hover:border-success hover:text-success text-text-muted transition-all duration-150 font-medium"
      >
        📄 CSV
      </button>
      <button
        onClick={() => exportPDF(data, columns, filename)}
        title="导出 PDF"
        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border border-border-dark bg-white hover:bg-danger/5 hover:border-danger hover:text-danger text-text-muted transition-all duration-150 font-medium"
      >
        📕 PDF
      </button>
      <button
        onClick={() => exportWord(data, columns, filename)}
        title="导出 Word"
        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border border-border-dark bg-white hover:bg-primary/5 hover:border-primary hover:text-primary text-text-muted transition-all duration-150 font-medium"
      >
        📝 Word
      </button>
    </div>
  );
}
