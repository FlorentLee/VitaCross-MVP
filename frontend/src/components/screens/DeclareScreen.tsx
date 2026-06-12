"use client";

import React, { useState } from 'react';
import ExportToolbar from '@/components/ui/ExportToolbar';

export default function DeclareScreen() {
  const [insurers, setInsurers] = useState([
    {
      id: 1,
      name: 'Blue Cross Blue Shield',
      logo: '🔵',
      claimsCount: 8,
      totalAmount: 284600,
      currency: 'CNY',
      status: '直付处理中',
      statusColor: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    },
    {
      id: 2,
      name: 'Cigna Global',
      logo: '🟢',
      claimsCount: 5,
      totalAmount: 192400,
      currency: 'CNY',
      status: '待预授权',
      statusColor: 'text-warning bg-warning/10 border-warning/20',
    },
    {
      id: 3,
      name: 'AXA 安盛',
      logo: '🟡',
      claimsCount: 10,
      totalAmount: 370320,
      currency: 'CNY',
      status: '已核准',
      statusColor: 'text-success bg-success/10 border-success/20',
    },
  ]);

  const recentClaims = [
    { id: 1, patient: 'Emma Rodriguez', icd_code: 'I25.10', amount: 85000, currency: 'CNY', insurer: 'Blue Cross', date: '2026-06-11', status: '待审批' },
    { id: 2, patient: 'Sarah Johnson', icd_code: 'M17.0', amount: 185000, currency: 'CNY', insurer: 'AXA 安盛', date: '2026-06-10', status: '已核准' },
    { id: 3, patient: 'Yuki Tanaka', icd_code: 'K21.9', amount: 12000, currency: 'JPY', insurer: 'Cigna Global', date: '2026-06-09', status: '处理中' },
    { id: 4, patient: 'John Doe', icd_code: 'J45.909', amount: 28400, currency: 'USD', insurer: 'Blue Cross', date: '2026-06-08', status: '直付处理中' },
    { id: 5, patient: 'Elena Rostova', icd_code: 'N20.0', amount: 45000, currency: 'EUR', insurer: 'AXA 安盛', date: '2026-06-07', status: '已核准' }
  ];

  const exportColumns = [
    { key: 'patient', label: '患者' },
    { key: 'icd_code', label: 'ICD码' },
    { key: 'amount', label: '金额' },
    { key: 'currency', label: '币种' },
    { key: 'insurer', label: '保司' },
    { key: 'date', label: '提交日期' },
    { key: 'status', label: '状态' },
  ];

  const handleInsurerAction = (id: number, name: string) => {
    alert(`已向 ${name} 发起批量对账与直付申请。`);
  };

  return (
    <div className="p-4 md:p-6 max-w-[1200px] mx-auto">
      {/* Page Title */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-text-main flex items-center gap-2">
            <span>📋 保司核赔申报 (Claims Submission)</span>
          </h1>
          <p className="text-xs text-text-muted mt-1">批量向国际保险公司发起直付结算申报与预授权比对</p>
        </div>
        <div className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg flex items-center gap-3">
          <div className="text-2xl">⚡</div>
          <div>
            <div className="text-xs font-bold text-primary">AI核对通道</div>
            <div className="text-xs font-bold text-text-main">
              保司专线已连接 <span className="text-success ml-1">延迟 18ms</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-card border border-border-light rounded-xl p-5 shadow-sm">
          <div className="text-xs text-text-muted font-medium mb-1">本月提交核赔</div>
          <div className="text-2xl font-bold text-primary">23 笔</div>
          <div className="text-[10px] text-text-muted mt-1">均自动映射 ICD-10 编码</div>
        </div>
        <div className="bg-card border border-border-light rounded-xl p-5 shadow-sm">
          <div className="text-xs text-text-muted font-medium mb-1">待审批金额</div>
          <div className="text-2xl font-bold text-warning">¥ 847,320</div>
          <div className="text-[10px] text-text-muted mt-1">其中 3 笔大额需人工补充凭证</div>
        </div>
        <div className="bg-card border border-border-light rounded-xl p-5 shadow-sm">
          <div className="text-xs text-text-muted font-medium mb-1">已核准结算</div>
          <div className="text-2xl font-bold text-success">¥ 1,284,000</div>
          <div className="text-[10px] text-text-muted mt-1">已进入跨境汇款结算队列</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        {/* Main Insurer Grid */}
        <div className="flex flex-col gap-4">
          <div className="text-sm font-bold text-text-main flex items-center gap-2 mb-1">
            <span>🏢 国际合作保司结算状态</span>
          </div>
          
          {insurers.map((insurer) => (
            <div key={insurer.id} className="bg-card border border-border-light rounded-xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:border-primary transition-colors">
              <div className="flex items-center gap-3">
                <div className="text-3xl w-12 h-12 bg-bg-main rounded-lg flex items-center justify-center shrink-0">
                  {insurer.logo}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text-main">{insurer.name}</h3>
                  <div className="text-xs text-text-muted mt-1">
                    当前提交: <span className="font-semibold text-text-main">{insurer.claimsCount} 笔</span> · 币种: {insurer.currency}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 sm:gap-6 justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-border-light">
                <div className="text-right sm:text-right">
                  <div className="text-[10px] text-text-muted uppercase">申报金额</div>
                  <div className="text-sm font-bold text-text-main">¥ {insurer.totalAmount.toLocaleString()}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${insurer.statusColor}`}>
                    {insurer.status}
                  </span>
                  <button 
                    onClick={() => handleInsurerAction(insurer.id, insurer.name)}
                    className="btn btn-primary !py-1.5 !px-3 !text-xs"
                  >
                    对账申报
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Recent Activity & Channels */}
        <div className="flex flex-col gap-6">
          {/* Recent Claims Table */}
          <div className="bg-card border border-border-light rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs font-bold text-text-main">📋 最近申报记录</div>
              <ExportToolbar data={recentClaims} columns={exportColumns} filenamePrefix="vitacross_recent_claims" />
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border-light bg-bg-main/50">
                    <th className="py-2 px-1 text-text-muted font-medium">患者</th>
                    <th className="py-2 px-1 text-text-muted font-medium">ICD码</th>
                    <th className="py-2 px-1 text-text-muted font-medium">金额</th>
                    <th className="py-2 px-1 text-text-muted font-medium">状态</th>
                  </tr>
                </thead>
                <tbody>
                  {recentClaims.map((claim) => (
                    <tr key={claim.id} className="border-b border-border-light/50 hover:bg-bg-main/30">
                      <td className="py-2 px-1 text-text-main font-medium truncate max-w-[80px]">{claim.patient}</td>
                      <td className="py-2 px-1 font-mono text-primary">{claim.icd_code}</td>
                      <td className="py-2 px-1 text-text-main font-semibold">
                        {claim.currency === 'USD' ? '$' : '¥'}{claim.amount.toLocaleString()}
                      </td>
                      <td className="py-2 px-1">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${
                          claim.status === '已核准' ? 'bg-success/10 text-success' : 
                          claim.status === '待审批' ? 'bg-warning/10 text-warning' : 'bg-blue-500/10 text-blue-500'
                        }`}>
                          {claim.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Channel Status */}
          <div className="bg-gradient-to-br from-card to-primary/5 border border-primary/20 rounded-xl p-5 shadow-sm">
            <div className="text-xs font-bold text-primary mb-2 flex items-center gap-1">
              🤖 RAG 智能校验通道
            </div>
            <div className="text-[11px] text-text-muted mb-4 leading-relaxed">
              实时比对 Cigna, AXA 及 Blue Cross 系统规则，核赔准确率保证 98% 以上。
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center bg-white/50 border border-primary/10 rounded px-2.5 py-1.5">
                <span className="text-[10px] text-text-main font-bold">BCBS 网关</span>
                <span className="px-1.5 py-0.5 rounded bg-success/10 text-success text-[9px] font-bold">已连接</span>
              </div>
              <div className="flex justify-between items-center bg-white/50 border border-primary/10 rounded px-2.5 py-1.5">
                <span className="text-[10px] text-text-main font-bold">Cigna API</span>
                <span className="px-1.5 py-0.5 rounded bg-success/10 text-success text-[9px] font-bold">已连接</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
