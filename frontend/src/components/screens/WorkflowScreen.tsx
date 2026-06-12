"use client";

import React, { useState } from 'react';

interface PaletteNode {
  icon: string;
  title: string;
  desc: string;
}

interface CanvasNode {
  id: string;
  title: string;
  subtitle: string;
  desc: string;
  colorClass: string;
}

export default function WorkflowScreen() {
  const [paletteNodes] = useState<PaletteNode[]>([
    { icon: '🟢', title: '结算触发器', desc: '收到账单触发' },
    { icon: '🤖', title: 'AI合规审核', desc: '病历映射比对' },
    { icon: '👤', title: '保司预授权', desc: '审核保险条款' },
    { icon: '📊', title: '汇率条件分支', desc: '多币种条件判断' },
    { icon: '📧', title: '通知患者/医院', desc: '结算单分发' },
    { icon: '📒', title: '自动入账结算', desc: '完成跨境清算' },
  ]);

  const [canvasNodes, setCanvasNodes] = useState<CanvasNode[]>([
    {
      id: 'node-1',
      title: '结算触发器',
      subtitle: '触发事件',
      desc: '收到合作三甲医院国际部结算申请 · 自动触发',
      colorClass: 'border-l-4 border-l-success bg-success/5 hover:bg-success/10',
    },
    {
      id: 'node-2',
      title: 'VitaCross 多模态 OCR',
      subtitle: 'AI 解析引擎',
      desc: 'AI病历智能解析 · ICD-10/11 编码映射比对 · 合规评分校验',
      colorClass: 'border-l-4 border-l-primary bg-primary/5 hover:bg-primary/10',
    },
    {
      id: 'node-3',
      title: '保司预授权核查',
      subtitle: '规则校验',
      desc: '判断金额 > ¥50,000 → 触发人工审核流程 | 小于阈值自动确认',
      colorClass: 'border-l-4 border-l-purple-500 bg-purple-500/5 hover:bg-purple-500/10',
    },
    {
      id: 'node-4',
      title: '跨境汇率结算',
      subtitle: '支付通道',
      desc: '多币种结算规则比对 · SWIFT/CIPS/SEPA 通道智能寻路 · 汇率实时锁定',
      colorClass: 'border-l-4 border-l-warning bg-warning/5 hover:bg-warning/10',
    },
    {
      id: 'node-5',
      title: '自动入账通知',
      subtitle: '入账存档',
      desc: '结算凭证自动生成 · 入账归档 · 发送通知告知患者与医院',
      colorClass: 'border-l-4 border-l-success bg-success/5 hover:bg-success/10',
    },
  ]);

  const handleSave = () => {
    alert('跨境结算审批流配置保存成功！');
  };

  const handleRun = () => {
    alert('正在发起测试运行：自动读取一笔 mock 国际门诊单据并模拟 5 步结算核销流程。');
  };

  return (
    <div className="p-4 md:p-6 max-w-[1400px] mx-auto h-[calc(100vh-80px)] flex flex-col gap-4">
      
      {/* Main Container */}
      <div className="flex-1 flex gap-6 overflow-hidden min-h-0">
        
        {/* Left Side: Node Palette (Dark Theme) */}
        <div className="w-[260px] shrink-0 bg-slate-900 border border-slate-800 rounded-xl shadow-lg flex flex-col overflow-hidden text-white">
          <div className="p-5 border-b border-slate-800 bg-slate-950">
            <h2 className="text-sm font-bold flex items-center gap-2">
              <span className="w-1.5 h-4 bg-primary rounded-full"></span>
              结算节点组件库
            </h2>
            <p className="text-[11px] text-slate-400 mt-1">支持按需拖拽与设计您的审批流</p>
          </div>

          <div className="p-4 flex-1 overflow-y-auto flex flex-col gap-3">
            {paletteNodes.map((node, index) => (
              <div
                key={index}
                className="bg-slate-800 border border-slate-700 hover:border-primary p-3 rounded-lg flex items-center gap-3 cursor-grab transition-all hover:bg-slate-700/50 shadow-sm"
              >
                <span className="text-xl">{node.icon}</span>
                <div>
                  <h4 className="text-xs font-bold">{node.title}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">{node.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Flow Canvas */}
        <div className="flex-1 bg-white border border-border-light rounded-xl shadow-sm flex flex-col overflow-hidden relative">
          
          {/* Top Canvas Toolbar */}
          <div className="p-4 border-b border-border-light flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-bg-main/30 backdrop-blur-sm z-10 shrink-0">
            <div>
              <h2 className="text-base font-black text-text-main flex items-center gap-2">
                国际患者跨境结算标准审批流
                <span className="inline-flex items-center gap-1 bg-success/10 border border-success/20 text-success text-[10px] font-bold px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
                  运行中
                </span>
              </h2>
              <p className="text-[11px] text-text-muted mt-0.5">ID: WF-VITACROSS-001 · 适用于国际部就诊患者</p>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={handleRun}
                className="btn btn-ghost !py-1.5 !px-3 border border-border-light bg-white hover:bg-bg-main text-xs font-bold text-text-main"
              >
                测试运行
              </button>
              <button 
                onClick={handleSave}
                className="btn btn-primary !py-1.5 !px-3 text-xs font-bold"
              >
                保存流程
              </button>
            </div>
          </div>

          {/* Canvas Canvas Body */}
          <div className="flex-1 overflow-y-auto p-6 flex gap-6">
            
            {/* Center Flow Nodes */}
            <div className="flex-1 flex flex-col items-center justify-start py-4">
              <div className="w-full max-w-xl flex flex-col items-center">
                
                {canvasNodes.map((node, index) => (
                  <React.Fragment key={node.id}>
                    {/* Node Card */}
                    <div className={`w-full border border-border-light rounded-xl p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${node.colorClass}`}>
                      <div className="flex justify-between items-start">
                        <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{node.subtitle}</div>
                        <span className="text-xs text-text-muted cursor-pointer hover:text-primary">配置 ⚙️</span>
                      </div>
                      <h4 className="text-sm font-bold text-text-main mt-1">{node.title}</h4>
                      <p className="text-xs text-text-muted mt-2 leading-relaxed">{node.desc}</p>
                    </div>

                    {/* Connector Arrow (hide for last node) */}
                    {index < canvasNodes.length - 1 && (
                      <div className="my-4 text-border-dark flex flex-col items-center pointer-events-none">
                        <div className="w-[2px] h-6 bg-border-dark"></div>
                        <div className="text-xs -mt-1">▼</div>
                      </div>
                    )}
                  </React.Fragment>
                ))}

              </div>
            </div>

            {/* Right Flow Statistics Panel */}
            <div className="w-[280px] shrink-0 border-l border-border-light p-4 hidden md:flex flex-col gap-4 bg-bg-main/10">
              <h3 className="text-xs font-bold text-text-main flex items-center gap-1.5 pb-2 border-b border-border-light">
                📊 流程执行统计
              </h3>
              
              <div className="flex flex-col gap-3">
                <div className="bg-white border border-border-light rounded-lg p-3">
                  <div className="text-[10px] text-text-muted">本月结算处理</div>
                  <div className="text-xl font-bold text-text-main mt-0.5">47 笔</div>
                  <div className="w-full bg-slate-100 h-1 rounded-full mt-2 overflow-hidden">
                    <div className="bg-primary h-full w-[78%]"></div>
                  </div>
                </div>

                <div className="bg-white border border-border-light rounded-lg p-3">
                  <div className="text-[10px] text-text-muted">平均耗时</div>
                  <div className="text-xl font-bold text-primary mt-0.5">3.2 天</div>
                  <div className="text-[9px] text-success mt-1">⚡ 较传统渠道缩短 45%</div>
                </div>

                <div className="bg-white border border-border-light rounded-lg p-3">
                  <div className="text-[10px] text-text-muted">AI 自动入账率</div>
                  <div className="text-xl font-bold text-success mt-0.5">78%</div>
                  <div className="text-[9px] text-text-muted mt-1">22% 由大额转为保司人工审核</div>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom stats bar: processed amount by currency */}
          <div className="border-t border-border-light p-4 bg-slate-900 text-white shrink-0 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
              本月跨境交易流水汇总 (CNY Equivalent)
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
              <div className="bg-slate-800 px-3 py-1 rounded border border-slate-700">
                🇺🇸 USD: <span className="text-success">¥1.2M</span>
              </div>
              <div className="bg-slate-800 px-3 py-1 rounded border border-slate-700">
                🇯🇵 JPY: <span className="text-info">¥450K</span>
              </div>
              <div className="bg-slate-800 px-3 py-1 rounded border border-slate-700">
                🇪🇺 EUR: <span className="text-purple-400">¥320K</span>
              </div>
              <div className="bg-slate-800 px-3 py-1 rounded border border-slate-700">
                🇨🇳 CNY: <span className="text-warning">¥880K</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
