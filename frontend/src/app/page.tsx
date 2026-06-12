"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

import DashboardScreen from '@/components/screens/DashboardScreen';
import InvoiceScreen from '@/components/screens/InvoiceScreen';
import WorkflowScreen from '@/components/screens/WorkflowScreen';
import RiskScreen from '@/components/screens/RiskScreen';
import AnalyticsScreen from '@/components/screens/AnalyticsScreen';
import DeclareScreen from '@/components/screens/DeclareScreen';
import LedgerScreen from '@/components/screens/LedgerScreen';
import SettingsScreen from '@/components/screens/SettingsScreen';

export default function AppContainer() {
  const [activeScreen, setActiveScreen] = useState("dashboard");

  const screenTitles: Record<string, string> = {
    dashboard: "工作台总览",
    invoice: "AI病历解析 · VitaCross 多模态 OCR",
    workflow: "跨境结算审批流",
    ledger: "智能账目与结算",
    declare: "保司核赔申报",
    risk: "合规风控",
    analytics: "经营分析",
    settings: "系统设置",
  };

  const renderActiveScreen = () => {
    switch (activeScreen) {
      case "dashboard": return <DashboardScreen />;
      case "invoice":   return <InvoiceScreen />;
      case "workflow":  return <WorkflowScreen />;
      case "ledger":    return <LedgerScreen />;
      case "declare":   return <DeclareScreen />;
      case "risk":      return <RiskScreen />;
      case "analytics": return <AnalyticsScreen />;
      case "settings":  return <SettingsScreen />;
      default: return <div className="p-6 text-text-muted">敬请期待 ({activeScreen})...</div>;
    }
  };

  const mobileNavItems = [
    { id: 'dashboard', icon: '📊', label: '工作台' },
    { id: 'invoice',   icon: '🏥', label: '病历' },
    { id: 'ledger',    icon: '📒', label: '账目' },
    { id: 'analytics', icon: '📈', label: '分析' },
  ];

  return (
    <div className="flex h-screen w-full bg-bg-main overflow-hidden flex-col md:flex-row">
      <Sidebar currentScreen={activeScreen} onNavigate={setActiveScreen} />

      <main className="flex-1 flex flex-col min-w-0 bg-bg-main relative">
        <Topbar title={screenTitles[activeScreen] || "VitaCross"} />

        <div className="flex-1 overflow-y-auto content-scroll pb-16 md:pb-0">
          {renderActiveScreen()}
        </div>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-border-light flex justify-around items-center px-2 z-50">
          {mobileNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveScreen(item.id)}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 ${
                activeScreen === item.id ? 'text-primary' : 'text-text-muted'
              }`}
            >
              <span className="text-xl leading-none">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </main>
    </div>
  );
}
