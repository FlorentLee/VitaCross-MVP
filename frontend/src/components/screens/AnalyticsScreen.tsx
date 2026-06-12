"use client";

import React, { useState, useEffect } from 'react';
import { getCEOReport } from '@/lib/api';
import ExportToolbar from '@/components/ui/ExportToolbar';

export default function AnalyticsScreen() {
  const [reportText, setReportText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const incomeData = [
    { category: '检验与影像', amount: 1280000, percentage: '45%', icon: '🔬', color: 'bg-primary' },
    { category: '药品与耗材', amount: 854000, percentage: '30%', icon: '💊', color: 'bg-info' },
    { category: '手术与操作', amount: 427000, percentage: '15%', icon: '🩺', color: 'bg-success' },
    { category: '住院床位费', amount: 284000, percentage: '10%', icon: '🏨', color: 'bg-warning' }
  ];

  const exportColumns = [
    { key: 'category', label: '医疗服务项目' },
    { key: 'amount', label: '金额 (CNY)' },
    { key: 'percentage', label: '占比' }
  ];

  const generateReport = async (isMounted: boolean) => {
    setIsGenerating(true);
    setReportText("");
    try {
      const response = await getCEOReport();
      const textToStream = response.report || "老板，本月VitaCross运营健康。医疗跨境结算处理时效整体提升45%...";

      let currentText = "";
      let idx = 0;
      const typingInterval = setInterval(() => {
        if (!isMounted) {
          clearInterval(typingInterval);
          return;
        }
        if (idx < textToStream.length) {
          currentText += textToStream.charAt(idx);
          setReportText(currentText);
          idx++;
        } else {
          clearInterval(typingInterval);
          setIsGenerating(false);
        }
      }, 30);

    } catch (error) {
      console.error("Report gen failed", error);
      if (isMounted) {
        setReportText("⚠️ 生成报告失败，请检查网络或配置。");
        setIsGenerating(false);
      }
    }
  };

  useEffect(() => {
    let isMounted = true;
    generateReport(isMounted);
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="p-4 md:p-6 max-w-[1200px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-4 md:gap-6 mb-6">
        {/* Income Structure */}
        <div className="bg-card border border-border-light rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="text-sm font-bold text-text-main flex items-center gap-2">
              <span>🏥 本月医疗服务收入结构</span>
            </div>
            <ExportToolbar data={incomeData} columns={exportColumns} filenamePrefix="vitacross_revenue_structure" />
          </div>
          <div className="flex h-10 w-full rounded-full overflow-hidden mb-6 shadow-inner">
            <div className="h-full bg-primary" style={{ width: '45%' }}></div>
            <div className="h-full bg-info" style={{ width: '30%' }}></div>
            <div className="h-full bg-success" style={{ width: '15%' }}></div>
            <div className="h-full bg-warning" style={{ width: '10%' }}></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {incomeData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-bg-main rounded-lg border border-border-light">
                <span className="text-lg">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-text-muted">{item.category}</div>
                  <div className="text-sm font-bold text-text-main truncate">
                    ¥ {item.amount.toLocaleString()} <span className="text-[10px] text-text-muted font-normal ml-1">{item.percentage}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ICD Target Trend */}
        <div className="bg-card border border-border-light rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="text-sm font-bold text-text-main flex items-center gap-2">
              <span>📊 ICD编码映射准确率趋势</span>
            </div>
            <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded border border-success/20 font-semibold">较行业基准高 12.4%</span>
          </div>

          <div className="relative h-[160px] flex items-end justify-between px-4 pb-0 mt-4">
            <div className="absolute top-[30%] left-0 right-0 h-px bg-border-light border-dashed"></div>

            {[
              { m: 'Q1', r: 88.2, h: '88%', c: 'bg-primary' },
              { m: 'Q2', r: 91.6, h: '91%', c: 'bg-info' },
              { m: 'Q3', r: 94.8, h: '94%', c: 'bg-purple-500' },
              { m: 'Q4', r: 97.3, h: '97%', c: 'bg-success shadow-[0_0_12px_rgba(16,185,129,0.3)] border border-success' }
            ].map((bar, i) => (
              <div key={i} className="flex flex-col justify-end items-center gap-2 w-12 h-full group cursor-pointer relative z-10">
                <div className="text-[10px] font-bold text-text-muted group-hover:text-text-main transition-colors">{bar.r}%</div>
                <div className={`w-full rounded-t-md opacity-90 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100 ${bar.c}`} style={{ height: bar.h }}></div>
                <div className="text-xs text-text-muted mt-1 font-medium">{bar.m}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI CEO Report */}
      <div className="bg-gradient-to-br from-card to-blue-50/30 border border-primary/20 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-primary/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-xl">🤖</div>
            <div>
              <div className="text-sm font-bold text-primary flex items-center gap-2">
                🤖 VitaCross 医疗运营高管简报
                {isGenerating && <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></span>}
              </div>
              <div className="text-xs text-text-muted mt-0.5" id="reportTime">
                AI Generated · Gemini 多模态驱动 · VitaCross 多模态 OCR · {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => generateReport(true)}
              className="btn btn-ghost !text-xs !py-1.5 !px-3 hover:text-primary hover:border-primary"
            >
              重新生成
            </button>
            <button className="btn btn-primary !text-xs !py-1.5 !px-3 font-semibold shadow-md shadow-primary/20"
              onClick={() => alert("高管简报已发送至对接群")}>通知高管群</button>
          </div>
        </div>

        <div className="px-4 py-2 min-h-[160px]">
          <p className="text-sm text-text-main leading-relaxed whitespace-pre-wrap font-medium">
            {reportText || "等待 VitaCross AI 引擎总结..."}
          </p>
        </div>
      </div>
    </div>
  );
}
