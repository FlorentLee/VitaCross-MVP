"use client";

import React, { useState, useEffect } from 'react';
import { useLedgerStore } from '@/store/ledgerStore';
import { deleteLedgerItem, updateLedgerItem } from '@/lib/api';
import ExportToolbar from '@/components/ui/ExportToolbar';

export interface LedgerItem {
  id: number;
  invoice_number?: string;
  invoice_type?: string;
  amount?: number;
  total_amount?: number;
  created_at?: string;
  compliance_score?: number;
  patient_name?: string;
  hospital_name?: string;
  icd_code?: string;
  currency?: string;
  settlement_status?: string;
}

export default function DashboardScreen() {
  const [loading, setLoading] = useState(true);
  const { ledgerItems, fetchLedger } = useLedgerStore();

  // Modal and Edit states
  const [isViewAllOpen, setIsViewAllOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LedgerItem | null>(null);
  const [editForm, setEditForm] = useState<Partial<LedgerItem>>({});

  // Poll ledger data from backend
  useEffect(() => {
    const initialFetch = async () => {
      await fetchLedger();
      setLoading(false);
    };
    initialFetch();
    const interval = setInterval(fetchLedger, 10000);
    return () => clearInterval(interval);
  }, [fetchLedger]);

  const handleDelete = async (id: number) => {
    try {
      await deleteLedgerItem(id);
      await fetchLedger();
    } catch (error) {
      console.error("Failed to delete ledger item:", error);
      alert("删除失败，请稍后重试");
    }
  };

  const handleEditClick = (item: LedgerItem) => {
    setEditingItem(item);
    setEditForm({
      invoice_number: item.invoice_number || '',
      invoice_type: item.invoice_type || '',
      total_amount: item.total_amount ?? item.amount ?? 0,
      compliance_score: item.compliance_score ?? 0,
      patient_name: item.patient_name || '',
      hospital_name: item.hospital_name || '',
      icd_code: item.icd_code || '',
      currency: item.currency || 'CNY',
      settlement_status: item.settlement_status || 'PENDING',
    });
  };

  const handleUpdate = async () => {
    if (!editingItem) return;
    try {
      await updateLedgerItem(editingItem.id, editForm);
      setEditingItem(null);
      await fetchLedger();
    } catch (error) {
      console.error("Failed to update ledger item:", error);
      alert("更新失败，请稍后重试");
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'AUTO_SETTLED':
      case 'SETTLED':
        return <span className="inline-block py-1 px-2.5 rounded text-xs font-semibold bg-success/10 text-success border border-success/20">已结算</span>;
      case 'PENDING_INSURER_APPROVAL':
        return <span className="inline-block py-1 px-2.5 rounded text-xs font-semibold bg-warning/10 text-warning border border-warning/20">待保司审批</span>;
      case 'PENDING':
        return <span className="inline-block py-1 px-2.5 rounded text-xs font-semibold bg-blue-500/10 text-blue-500 border border-blue-500/20">跨境汇款中</span>;
      case 'REJECTED':
        return <span className="inline-block py-1 px-2.5 rounded text-xs font-semibold bg-danger/10 text-danger border border-danger/20">拒赔</span>;
      default:
        return <span className="inline-block py-1 px-2.5 rounded text-xs font-semibold bg-text-muted/10 text-text-muted border border-text-muted/20">待处理</span>;
    }
  };

  // Only show first 5 items on the dashboard
  const displayItems = isViewAllOpen ? ledgerItems : ledgerItems.slice(0, 5);

  const exportColumns = [
    { key: 'invoice_number', label: '单据号' },
    { key: 'patient_name', label: '患者' },
    { key: 'hospital_name', label: '医院' },
    { key: 'invoice_type', label: '单据类型' },
    { key: 'icd_code', label: 'ICD编码' },
    { key: 'total_amount', label: '金额' },
    { key: 'currency', label: '币种' },
    { key: 'created_at', label: '日期' },
    { key: 'compliance_score', label: 'AI评分' },
    { key: 'settlement_status', label: '结算状态' },
  ];

  return (
    <div className="p-4 md:p-6 relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-card border border-border-light shadow-sm rounded-xl p-5 relative overflow-hidden transition-all duration-200 hover:border-primary hover:shadow-md">
          <div className="absolute top-4 right-4 text-3xl opacity-20 filter grayscale">🏥</div>
          <div className="text-xs text-text-muted font-medium mb-1.5 uppercase tracking-wide">本月医疗结算额</div>
          <div className="text-3xl font-bold leading-none mb-2 text-text-main">¥ 2,847,320</div>
          <div className="text-xs text-text-muted flex items-center gap-1.5">
            <span className="text-success font-medium bg-success/10 px-1.5 py-0.5 rounded text-[10px]">↑ 18.6%</span>
            <span>较上月</span>
          </div>
        </div>

        <div className="bg-card border border-border-light shadow-sm rounded-xl p-5 relative overflow-hidden transition-all duration-200 hover:border-info hover:shadow-md">
          <div className="absolute top-4 right-4 text-3xl opacity-20 filter grayscale">🤖</div>
          <div className="text-xs text-text-muted font-medium mb-1.5 uppercase tracking-wide">AI处理病历数</div>
          <div className="text-3xl font-bold leading-none mb-2 text-text-main">1,284</div>
          <div className="text-xs text-text-muted flex items-center gap-1.5">
            <span className="text-success font-medium bg-success/10 px-1.5 py-0.5 rounded text-[10px]">↑ 43份</span>
            <span>今日新增</span>
          </div>
        </div>

        <div className="bg-card border border-border-light shadow-sm rounded-xl p-5 relative overflow-hidden transition-all duration-200 hover:border-success hover:shadow-md">
          <div className="absolute top-4 right-4 text-3xl opacity-20 filter grayscale">✅</div>
          <div className="text-xs text-text-muted font-medium mb-1.5 uppercase tracking-wide">保险核赔率</div>
          <div className="text-3xl font-bold leading-none mb-2 text-text-main">89.4%</div>
          <div className="text-xs text-text-muted flex items-center gap-1.5">
            <span className="text-success font-medium bg-success/10 px-1.5 py-0.5 rounded text-[10px]">↑ 2.1%</span>
            <span>较上季</span>
          </div>
        </div>

        <div className="bg-card border border-border-light shadow-sm rounded-xl p-5 relative overflow-hidden transition-all duration-200 hover:border-purple-500 hover:shadow-md">
          <div className="absolute top-4 right-4 text-3xl opacity-20 filter grayscale">⚡</div>
          <div className="text-xs text-text-muted font-medium mb-1.5 uppercase tracking-wide">平均结算周期</div>
          <div className="text-3xl font-bold leading-none mb-2 text-text-main">3.2天</div>
          <div className="text-xs text-text-muted flex items-center gap-1.5">
            <span className="text-success font-medium bg-success/10 px-1.5 py-0.5 rounded text-[10px]">↓ 45%</span>
            <span>AI加速后</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 md:gap-6 mb-6">
        {/* Revenue Chart */}
        <div className="bg-card border border-border-light shadow-sm rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm font-bold text-text-main">月度财务流水趋势 (2026年)</div>
            <div className="flex gap-4">
              <span className="text-xs text-text-muted flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-info"></span> 医疗流水</span>
              <span className="text-xs text-text-muted flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-warning"></span> 跨境赔付</span>
              <span className="text-xs text-text-muted flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-success"></span> 净收益</span>
            </div>
          </div>
          <div className="h-[200px] flex items-end gap-3 pb-6 relative px-2">
            <div className="absolute top-0 left-0 right-0 h-px bg-border-light"></div>
            <div className="absolute top-[33%] left-0 right-0 h-px bg-border-light"></div>
            <div className="absolute top-[66%] left-0 right-0 h-px bg-border-light"></div>

            {[
              { month: '1月', inc: '52%', exp: '30%', prof: '22%', incV: '¥1,560k', expV: '¥900k', profV: '¥660k' },
              { month: '2月', inc: '61%', exp: '35%', prof: '26%', incV: '¥1,830k', expV: '¥1,050k', profV: '¥780k' },
              { month: '3月', inc: '55%', exp: '40%', prof: '15%', incV: '¥1,650k', expV: '¥1,200k', profV: '¥450k' },
              { month: '4月', inc: '78%', exp: '45%', prof: '33%', incV: '¥2,340k', expV: '¥1,350k', profV: '¥990k' },
              { month: '5月', inc: '70%', exp: '38%', prof: '32%', incV: '¥2,100k', expV: '¥1,140k', profV: '¥960k' },
              { month: '6月', inc: '88%', exp: '42%', prof: '46%', incV: '¥2,640k', expV: '¥1,260k', profV: '¥1,380k' },
            ].map((col, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end cursor-pointer group relative z-10 hover:bg-bg-main/50 rounded-t-lg transition-colors">
                <div className="flex items-end gap-[2px] sm:gap-[4px] w-full justify-center h-full pb-1">
                  <div className="w-[25%] max-w-[14px] bg-info rounded-t-[3px] opacity-80 group-hover:opacity-100 transition-all duration-300" style={{ height: col.inc }} title={`流水: ${col.incV}`}></div>
                  <div className="w-[25%] max-w-[14px] bg-warning rounded-t-[3px] opacity-80 group-hover:opacity-100 transition-all duration-300" style={{ height: col.exp }} title={`赔付: ${col.expV}`}></div>
                  <div className="w-[25%] max-w-[14px] bg-success rounded-t-[3px] opacity-85 group-hover:opacity-100 transition-all duration-300 shadow-[0_0_8px_rgba(16,185,129,0.2)] group-hover:shadow-[0_0_12px_rgba(16,185,129,0.4)]" style={{ height: col.prof }} title={`收益: ${col.profV}`}></div>
                </div>
                <div className="text-[10px] scale-90 font-medium text-text-muted group-hover:text-primary transition-colors flex flex-col items-center leading-none">
                  <span>{col.month}</span>
                  <span className="text-[8px] opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-black/80 text-white p-1 rounded whitespace-nowrap z-50 text-center font-normal">
                    流:{col.incV}<br/>赔:{col.expV}<br/>益:{col.profV}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insight */}
        <div className="bg-card border border-border-light shadow-sm rounded-xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-bold text-text-main">🤖 AI 运营洞察</div>
            <span className="bg-primary/10 text-primary text-xs font-semibold px-2 py-0.5 rounded-full">实时推荐</span>
          </div>
          <div className="flex-1 flex flex-col gap-3">
            <div className="flex items-start gap-3 p-3 -mx-3 rounded-lg hover:bg-bg-main transition-colors border border-transparent hover:border-border-light">
              <span className="text-lg">🏥</span>
              <div className="flex-1">
                <div className="text-xs font-medium text-text-main mb-0.5">跨境结算额创历史新高</div>
                <div className="text-[11px] text-text-muted leading-relaxed">本月日韩和美加国际患者就诊数增加，带动跨境结算额环比上升18.6%。</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 -mx-3 rounded-lg hover:bg-bg-main transition-colors border border-transparent hover:border-border-light">
              <span className="text-lg">🤖</span>
              <div className="flex-1">
                <div className="text-xs font-medium text-text-main mb-0.5">AI多模态识别效率提升</div>
                <div className="text-[11px] text-text-muted leading-relaxed">病历与账单OCR自动解析率达91%，平均每单处理耗时降低45%。</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 -mx-3 rounded-lg hover:bg-bg-main transition-colors border border-transparent hover:border-border-light">
              <span className="text-lg">⚠️</span>
              <div className="flex-1">
                <div className="text-xs font-medium text-text-main mb-0.5">政策目录更新预警</div>
                <div className="text-[11px] text-text-muted leading-relaxed">AXA 安盛及 Cigna 保司近期更新了骨科手术预授权报销目录，建议维护规则库。</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card border border-border-light shadow-sm rounded-xl">
        <div className="p-5 border-b border-border-light flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-sm font-bold text-text-main flex items-center gap-2">
            <span>📋 最近处理记录</span>
          </div>
          <div className="flex items-center gap-4">
            <ExportToolbar data={ledgerItems} columns={exportColumns} filenamePrefix="vitacross_ledger" />
            {!isViewAllOpen && (
              <button
                onClick={() => setIsViewAllOpen(true)}
                className="text-xs text-primary font-medium hover:underline"
              >
                查看全部
              </button>
            )}
            {isViewAllOpen && (
              <button
                onClick={() => setIsViewAllOpen(false)}
                className="text-xs text-text-muted font-medium hover:underline"
              >
                收起列表
              </button>
            )}
          </div>
        </div>

        <div className="p-2 overflow-x-auto">
          <table className="w-full text-left border-spacing-0 min-w-[800px]">
            <thead>
              <tr>
                <th className="text-xs text-text-muted font-medium py-3 px-4 border-b border-border-light bg-bg-main/50 rounded-tl-lg">单据编号</th>
                <th className="text-xs text-text-muted font-medium py-3 px-4 border-b border-border-light bg-bg-main/50">患者</th>
                <th className="text-xs text-text-muted font-medium py-3 px-4 border-b border-border-light bg-bg-main/50">医院</th>
                <th className="text-xs text-text-muted font-medium py-3 px-4 border-b border-border-light bg-bg-main/50">项目类型</th>
                <th className="text-xs text-text-muted font-medium py-3 px-4 border-b border-border-light bg-bg-main/50">诊断/ICD</th>
                <th className="text-xs text-text-muted font-medium py-3 px-4 border-b border-border-light bg-bg-main/50">金额</th>
                <th className="text-xs text-text-muted font-medium py-3 px-4 border-b border-border-light bg-bg-main/50">币种</th>
                <th className="text-xs text-text-muted font-medium py-3 px-4 border-b border-border-light bg-bg-main/50">创建时间</th>
                <th className="text-xs text-text-muted font-medium py-3 px-4 border-b border-border-light bg-bg-main/50">AI评分</th>
                <th className="text-xs text-text-muted font-medium py-3 px-4 border-b border-border-light bg-bg-main/50">状态</th>
                <th className="text-xs text-text-muted font-medium py-3 px-4 border-b border-border-light bg-bg-main/50 rounded-tr-lg">操作</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={11} className="text-center py-8 text-text-muted text-sm">正在加载 SQLite 账簿...</td></tr>
              ) : displayItems.length === 0 ? (
                <tr><td colSpan={11} className="text-center py-8 text-text-muted text-sm">暂无动态记录，请前往票据上传测试</td></tr>
              ) : (
                displayItems.map((item) => (
                  <tr key={item.id} className="hover:bg-bg-main/50 transition-colors group">
                    <td className="py-3.5 px-4 text-xs font-mono text-text-main border-b border-border-light/50">{item.invoice_number || `SYS-${item.id}`}</td>
                    <td className="py-3.5 px-4 text-sm text-text-main border-b border-border-light/50">{item.patient_name || '-'}</td>
                    <td className="py-3.5 px-4 text-sm text-text-main border-b border-border-light/50">{item.hospital_name || '-'}</td>
                    <td className="py-3.5 px-4 text-sm text-text-main border-b border-border-light/50">{item.invoice_type || '未知类型'}</td>
                    <td className="py-3.5 px-4 text-xs border-b border-border-light/50">
                      {item.icd_code ? (
                        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{item.icd_code}</span>
                      ) : '-'}
                    </td>
                    <td className="py-3.5 px-4 text-sm text-text-main font-semibold border-b border-border-light/50">¥ {(item.total_amount ?? item.amount ?? 0).toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-xs border-b border-border-light/50">
                      {item.currency ? (
                        <span className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded font-bold text-[10px]">{item.currency}</span>
                      ) : 'CNY'}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-text-muted border-b border-border-light/50">{item.created_at ? new Date(item.created_at).toLocaleDateString() : '-'}</td>
                    <td className="py-3.5 px-4 text-sm border-b border-border-light/50">
                      {(item.compliance_score ?? 0) >= 90 ? (
                        <span className="text-success font-medium text-xs flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-success"></span> {item.compliance_score}分</span>
                      ) : (item.compliance_score ?? 0) >= 60 ? (
                        <span className="text-warning font-medium text-xs flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-warning"></span> {item.compliance_score}分</span>
                      ) : (item.compliance_score ?? 0) > 0 ? (
                        <span className="text-danger font-medium text-xs flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-danger"></span> {item.compliance_score}分</span>
                      ) : (
                        <span className="text-text-muted text-xs">-</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-sm border-b border-border-light/50">
                      {getStatusBadge(item.settlement_status)}
                    </td>
                    <td className="py-3.5 px-4 text-sm border-b border-border-light/50">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleEditClick(item)}
                          className="text-xs text-primary hover:text-primary/80 hover:underline transition-colors"
                        >
                          更改
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-xs text-danger hover:text-danger/80 hover:underline transition-colors"
                        >
                          移除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-md rounded-xl shadow-lg border border-border-light overflow-hidden">
            <div className="p-4 border-b border-border-light flex justify-between items-center">
              <h3 className="font-bold text-text-main">更改处理记录</h3>
              <button
                onClick={() => setEditingItem(null)}
                className="text-text-muted hover:text-text-main"
              >
                ✕
              </button>
            </div>
            <div className="p-4 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">票据编号</label>
                <input
                  type="text"
                  value={editForm.invoice_number || ''}
                  onChange={(e) => setEditForm({ ...editForm, invoice_number: e.target.value })}
                  className="w-full bg-bg-main border border-border-light rounded px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">患者姓名</label>
                <input
                  type="text"
                  value={editForm.patient_name || ''}
                  onChange={(e) => setEditForm({ ...editForm, patient_name: e.target.value })}
                  className="w-full bg-bg-main border border-border-light rounded px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">就诊医院</label>
                <input
                  type="text"
                  value={editForm.hospital_name || ''}
                  onChange={(e) => setEditForm({ ...editForm, hospital_name: e.target.value })}
                  className="w-full bg-bg-main border border-border-light rounded px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">项目类型</label>
                <input
                  type="text"
                  value={editForm.invoice_type || ''}
                  onChange={(e) => setEditForm({ ...editForm, invoice_type: e.target.value })}
                  className="w-full bg-bg-main border border-border-light rounded px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">ICD编码</label>
                <input
                  type="text"
                  value={editForm.icd_code || ''}
                  onChange={(e) => setEditForm({ ...editForm, icd_code: e.target.value })}
                  className="w-full bg-bg-main border border-border-light rounded px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">金额</label>
                <input
                  type="number"
                  value={editForm.total_amount || 0}
                  onChange={(e) => setEditForm({ ...editForm, total_amount: Number(e.target.value) })}
                  className="w-full bg-bg-main border border-border-light rounded px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">结算状态</label>
                <select
                  value={editForm.settlement_status || 'PENDING'}
                  onChange={(e) => setEditForm({ ...editForm, settlement_status: e.target.value })}
                  className="w-full bg-bg-main border border-border-light rounded px-3 py-2 text-sm focus:border-primary focus:outline-none"
                >
                  <option value="AUTO_SETTLED">已结算 (AUTO_SETTLED)</option>
                  <option value="SETTLED">已完成 (SETTLED)</option>
                  <option value="PENDING_INSURER_APPROVAL">待保司审批</option>
                  <option value="PENDING">处理中 (PENDING)</option>
                  <option value="REJECTED">拒赔 (REJECTED)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">AI评分 (0-100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editForm.compliance_score || 0}
                  onChange={(e) => setEditForm({ ...editForm, compliance_score: Number(e.target.value) })}
                  className="w-full bg-bg-main border border-border-light rounded px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>
            </div>
            <div className="p-4 border-t border-border-light flex justify-end gap-3 bg-bg-main/50">
              <button
                onClick={() => setEditingItem(null)}
                className="px-4 py-1.5 rounded text-sm font-medium text-text-main bg-white border border-border-light hover:bg-bg-main"
              >
                取消
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-1.5 rounded text-sm font-medium text-white bg-primary hover:bg-primary/90 shadow-sm"
              >
                保存更改
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
