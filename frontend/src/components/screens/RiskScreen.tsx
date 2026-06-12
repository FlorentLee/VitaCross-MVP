"use client";

import React from 'react';
import ExportToolbar from '@/components/ui/ExportToolbar';

export default function RiskScreen() {
  const riskItems = [
    {
      id: 1,
      title: 'ICD编码不匹配',
      description: 'Emma Rodriguez案例：I25.10编码与心脏手术诊断描述不符，保司已拒赔，需人工核验重新提交。',
      level: '高危',
      date: '截止日期：2026年6月20日',
      amountLabel: '涉及金额',
      amountValue: '¥85,000',
      btnText: '人工核查',
      colorClass: 'danger',
    },
    {
      id: 2,
      title: '手术费用超区域均值',
      description: 'Sarah Johnson手术费¥185,000，高于广州三甲医院同类手术均值18%，建议补充说明材料以通过保险核赔。',
      level: '中危',
      date: '截止日期：2026年6月25日',
      amountLabel: '超标比例',
      amountValue: '18%',
      btnText: '补充材料',
      colorClass: 'warning',
    },
    {
      id: 3,
      title: '预授权超时提醒',
      description: 'Yuki Tanaka案例Cigna预授权申请已超48小时SLA，需人工跟进协调。',
      level: '提醒',
      date: '建议：今日加急沟通',
      amountLabel: '保障金额',
      amountValue: '¥120,000',
      btnText: '加急跟进',
      colorClass: 'warning',
    },
  ];

  const exportColumns = [
    { key: 'title', label: '风险名称' },
    { key: 'description', label: '风险描述' },
    { key: 'level', label: '风险级别' },
    { key: 'amountValue', label: '金额/值' },
  ];

  return (
    <div className="p-4 md:p-6 max-w-[1200px] mx-auto">
      {/* Top 3 Score Cards */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-6">
        <div className="flex-1 bg-card border border-border-light rounded-xl p-6 shadow-sm flex flex-col items-center justify-center text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-success">
          <div className="text-xs font-semibold text-text-muted mb-3 uppercase tracking-wider">ICD 编码合规率</div>
          <div className="text-6xl font-black mb-2 text-success">94<span className="text-xl ml-1 text-text-muted font-bold">%</span></div>
          <div className="text-xs font-semibold px-2.5 py-1 rounded-md bg-success/10 text-success border border-success/20">低风险 · 运行正常</div>
          <div className="w-full max-w-[80%] h-2 bg-bg-main rounded-full overflow-hidden mt-5">
            <div className="h-full bg-success w-[94%] rounded-full"></div>
          </div>
          <div className="mt-3 text-[10px] text-text-muted">✅ 符合国际保司准入规范</div>
        </div>

        <div className="flex-1 bg-card border border-border-light rounded-xl p-6 shadow-sm flex flex-col items-center justify-center text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-warning">
          <div className="text-xs font-semibold text-text-muted mb-3 uppercase tracking-wider">医院定价偏差指数</div>
          <div className="text-6xl font-black mb-2 text-warning">72<span className="text-xl ml-1 text-text-muted font-bold">%</span></div>
          <div className="text-xs font-semibold px-2.5 py-1 rounded-md bg-warning/10 text-warning border border-warning/20">中等风险 · 需关注 2项</div>
          <div className="w-full max-w-[80%] h-2 bg-bg-main rounded-full overflow-hidden mt-5">
            <div className="h-full bg-warning w-[72%] rounded-full"></div>
          </div>
          <div className="mt-3 text-[10px] text-text-muted">📊 2项收费项目高于均值</div>
        </div>

        <div className="flex-1 bg-card border border-border-light rounded-xl p-6 shadow-sm flex flex-col items-center justify-center text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-danger">
          <div className="text-xs font-semibold text-text-muted mb-3 uppercase tracking-wider">保险覆盖排除项</div>
          <div className="text-6xl font-black mb-2 text-danger">58<span className="text-xl ml-1 text-text-muted font-bold">分</span></div>
          <div className="text-xs font-semibold px-2.5 py-1 rounded-md bg-danger/10 text-danger border border-danger/20">高危 · 3项待处理</div>
          <div className="w-full max-w-[80%] h-2 bg-bg-main rounded-full overflow-hidden mt-5">
            <div className="h-full bg-danger w-[58%] rounded-full"></div>
          </div>
          <div className="mt-3 text-[10px] text-text-muted">🚨 需补充说明以避免拒赔</div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-4 md:gap-6">
        {/* Left Column: Risk Details */}
        <div className="bg-card border border-border-light rounded-xl shadow-sm flex flex-col">
          <div className="p-5 border-b border-border-light flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm font-bold text-text-main flex items-center gap-2">
              <span className="w-1 h-4 bg-danger rounded-full"></span>
              风险明细列表
            </div>
            <div className="flex items-center gap-3">
              <ExportToolbar data={riskItems} columns={exportColumns} filenamePrefix="vitacross_risks" />
              <button className="text-xs text-primary font-medium hover:underline">一键 AI 规则优化</button>
            </div>
          </div>

          <div className="p-4 flex flex-col gap-3">
            {riskItems.map((item) => {
              const isDanger = item.colorClass === 'danger';
              return (
                <div key={item.id} className={`flex flex-col sm:flex-row gap-4 p-4 bg-bg-main border border-border-light rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md hover:bg-white group ${isDanger ? 'hover:border-danger' : 'hover:border-warning'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-lg ${isDanger ? 'bg-danger/10 text-danger' : 'bg-warning/10 text-warning'}`}>
                    {isDanger ? '⚠️' : '⏱️'}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-text-main mb-1 group-hover:text-primary transition-colors">{item.title}</div>
                    <div className="text-xs text-text-muted mb-2 leading-relaxed">{item.description}</div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-semibold border ${isDanger ? 'bg-danger/10 text-danger border-danger/20' : 'bg-warning/10 text-warning border-warning/20'}`}>{item.level}</span>
                      <span className="text-[10px] text-text-muted">{item.date}</span>
                    </div>
                  </div>
                  <div className="text-right flex sm:flex-col justify-between items-end min-w-[120px] border-t sm:border-t-0 pt-2 sm:pt-0 mt-2 sm:mt-0 border-border-light">
                    <div className="text-sm font-bold text-text-main">{item.amountLabel} <span className={isDanger ? 'text-danger' : 'text-warning'}>{item.amountValue}</span></div>
                    <button className="btn btn-primary !py-1 !px-3 !text-xs mt-2 w-full">{item.btnText}</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: AI Policy RAG */}
        <div className="bg-card border border-border-light rounded-xl shadow-sm flex flex-col">
          <div className="p-5 border-b border-border-light">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold py-0.5 px-2 rounded-md tracking-wide">RAG 实时政策匹配</span>
            </div>
            <div className="text-sm font-bold text-text-main mt-1">智能保险规则推送</div>
            <div className="text-xs text-text-muted mt-1">根据病历诊断自动适配的保司最新条款</div>
          </div>

          <div className="p-4 flex flex-col gap-3">
            <div className="p-3 bg-bg-main rounded-lg border border-border-light/50 hover:bg-primary/5 transition-colors cursor-pointer group">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-bold text-text-main flex items-center gap-1.5"><span className="text-primary">🔵</span> BCBS 预授权核赔细则</div>
                <div className="text-[10px] text-text-muted">BCBS-2026</div>
              </div>
              <div className="text-xs text-text-muted leading-relaxed">
                Blue Cross Blue Shield 规则：所有非急诊住院、心脏介入及骨科复杂手术需在就诊前 48 小时提交预授权申请。
              </div>
              <div className="mt-2 text-[10px] text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">查看保司核赔大纲 →</div>
            </div>

            <div className="p-3 bg-bg-main rounded-lg border border-border-light/50 hover:bg-primary/5 transition-colors cursor-pointer group">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-bold text-text-main flex items-center gap-1.5"><span className="text-primary">🟢</span> Cigna Global 直付网络规范</div>
                <div className="text-[10px] text-text-muted">Cigna-V3</div>
              </div>
              <div className="text-xs text-text-muted leading-relaxed">
                中国境内 200+ 三甲特需及国际医疗中心直付网络，报销比例 80%-100%，符合 ICD 条款的项目可实时结算。
              </div>
              <div className="mt-2 text-[10px] text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">查看直付结算指南 →</div>
            </div>

            <button className="btn btn-ghost w-full mt-2 text-xs">查看全部保司合规数据库</button>
          </div>
        </div>
      </div>
    </div>
  );
}
