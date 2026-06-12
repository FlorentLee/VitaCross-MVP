import React from 'react';

interface TopbarProps {
  title: string;
  subtitle?: string;
  onRefresh?: () => void;
}

export default function Topbar({ title, subtitle, onRefresh }: TopbarProps) {
  return (
    <div className="h-16 bg-white border-b border-border-light flex items-center justify-between px-6 shrink-0 relative z-10 shadow-sm">
      {/* Breadcrumb / Title Area */}
      <div className="flex items-center gap-2">
        <div className="text-sm text-text-muted hover:text-primary cursor-pointer transition-colors">VitaCross Beta</div>
        <span className="text-text-muted text-xs">/</span>
        <span className="text-sm font-bold text-text-main">{title}</span>
        {subtitle && (
          <span className="text-[12px] text-text-muted ml-2 font-normal bg-bg-main px-2 py-0.5 rounded-md border border-border-light">
            {subtitle}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <div className="relative group">
          <button className="btn btn-ghost !py-1.5 !px-3 !text-xs flex items-center gap-1">
            ⬇ 导出报表 <span className="text-[10px]">▼</span>
          </button>
          <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-border-light rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
            <div className="py-1">
              <button className="w-full text-left px-4 py-2 text-xs text-text-main hover:bg-bg-main hover:text-primary transition-colors" onClick={() => alert('导出 CSV 成功')}>
                📄 导出 CSV
              </button>
              <button className="w-full text-left px-4 py-2 text-xs text-text-main hover:bg-bg-main hover:text-primary transition-colors" onClick={() => alert('导出 PDF 成功')}>
                📕 导出 PDF
              </button>
              <button className="w-full text-left px-4 py-2 text-xs text-text-main hover:bg-bg-main hover:text-primary transition-colors" onClick={() => alert('导出 Word 成功')}>
                📘 导出 Word
              </button>
            </div>
          </div>
        </div>

        <button className="btn btn-primary !py-1.5 !px-3 !text-xs flex gap-1.5 items-center ml-2">
          <span className="text-[14px] leading-none">+</span> 新增操作
        </button>
        <div className="w-8 h-8 rounded-full bg-bg-main border border-border-light flex items-center justify-center cursor-pointer relative text-text-muted transition-colors hover:border-border-dark hover:text-text-main ml-2">
          🔔
          <div className="absolute top-[6px] right-[6px] w-[8px] h-[8px] bg-danger rounded-full border-2 border-white"></div>
        </div>
      </div>
    </div>
  );
}
