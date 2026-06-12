import React from 'react';

interface SidebarProps {
  currentScreen: string;
  onNavigate: (screenId: string) => void;
}

export default function Sidebar({ currentScreen, onNavigate }: SidebarProps) {
  const navItems = [
    { title: '核心功能' },
    { id: 'dashboard', icon: '📊', label: '工作台总览' },
    { id: 'invoice', icon: '🏥', label: 'AI病历解析' },
    { id: 'workflow', icon: '💱', label: '跨境结算流' },
    { id: 'ledger', icon: '📒', label: '智能账目' },
    { id: 'declare', icon: '🛡️', label: '保司核赔', badge: '5', badgeColor: 'bg-warning text-white' },

    { title: '智能分析' },
    { id: 'risk', icon: '⚠️', label: '合规风控', badge: '3', badgeColor: 'bg-danger text-white' },
    { id: 'analytics', icon: '📈', label: '经营分析' },

    { title: '系统管理' },
    { id: 'settings', icon: '⚙️', label: '系统设置' },
  ];

  return (
    <aside className="hidden md:flex w-sidebar bg-sidebar-bg flex-col shrink-0 relative z-20 shadow-lg">
      {/* Logo Area */}
      <div className="h-16 px-5 border-b border-white/10 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-white shadow-md shrink-0"
          style={{ background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)' }}>
          V+
        </div>
        <div className="leading-tight">
          <div className="text-base font-bold text-white tracking-wide">VitaCross</div>
          <div className="text-[10px] text-slate-400 tracking-wider font-medium uppercase mt-0.5">Medical × Finance</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map((item, idx) => {
          if ('title' in item) {
            return (
              <div key={`title-${idx}`} className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest px-6 pt-4 pb-2">
                {item.title}
              </div>
            );
          }

          const isActive = currentScreen === item.id;

          return (
            <div
              key={item.id}
              onClick={() => onNavigate(item.id!)}
              className={`flex items-center gap-3 py-2.5 px-6 cursor-pointer text-sm font-medium transition-colors relative mx-2 rounded-md mb-1
                ${isActive
                  ? 'bg-sidebar-active text-white shadow-md'
                  : 'text-slate-300 hover:bg-sidebar-hover hover:text-white'
                }`}
            >
              <span className="text-base w-5 text-center flex-shrink-0 opacity-90">{item.icon}</span>
              <span>{item.label}</span>

              {item.badge && (
                <span className={`ml-auto text-[10px] font-bold py-0.5 px-2 rounded-full min-w-[20px] text-center shadow-sm ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer / User Profile */}
      <div className="p-4 px-5 border-t border-white/10 flex items-center gap-3 hover:bg-sidebar-hover cursor-pointer transition-colors">
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 border border-slate-600 shadow-sm"
          style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
          VC
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-white truncate">管理员</div>
          <div className="text-[10px] text-slate-400 truncate">admin@vitacross.ai</div>
        </div>
        <div className="text-slate-500">⋮</div>
      </div>
    </aside>
  );
}
