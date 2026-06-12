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

export default function LedgerScreen() {
  const [loading, setLoading] = useState(true);
  const { ledgerItems, fetchLedger } = useLedgerStore();

  // Modal and Edit states
  const [editingItem, setEditingItem] = useState<LedgerItem | null>(null);
  const [editForm, setEditForm] = useState<Partial<LedgerItem>>({});

  useEffect(() => {
    const loadData = async () => {
      await fetchLedger();
      setLoading(false);
    };
    loadData();
  }, [fetchLedger]);

  const handleDelete = async (id: number) => {
    if (confirm("确定要删除此条结算记录吗？")) {
      try {
        await deleteLedgerItem(id);
        await fetchLedger();
      } catch (error) {
        console.error("Failed to delete ledger item:", error);
        alert("删除失败，请稍后重试");
      }
    }
  };

  const handleEditClick = (item: LedgerItem) => {
    setEditingItem(item);
    setEditForm({
      invoice_number: item.invoice_number || '',
      patient_name: item.patient_name || '',
      hospital_name: item.hospital_name || '',
      invoice_type: item.invoice_type || '',
      icd_code: item.icd_code || '',
      total_amount: item.total_amount ?? item.amount ?? 0,
      currency: item.currency || 'CNY',
      settlement_status: item.settlement_status || 'PENDING',
      compliance_score: item.compliance_score ?? 0,
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
        return <span className="inline-block py-1 px-2 rounded text-xs font-semibold bg-success/10 text-success border border-success/20">已结算</span>;
      case 'PENDING_INSURER_APPROVAL':
        return <span className="inline-block py-1 px-2 rounded text-xs font-semibold bg-warning/10 text-warning border border-warning/20">待保司审批</span>;
      case 'PENDING':
        return <span className="inline-block py-1 px-2 rounded text-xs font-semibold bg-blue-500/10 text-blue-500 border border-blue-500/20">处理中</span>;
      case 'REJECTED':
        return <span className="inline-block py-1 px-2 rounded text-xs font-semibold bg-danger/10 text-danger border border-danger/20">拒赔</span>;
      default:
        return <span className="inline-block py-1 px-2 rounded text-xs font-semibold bg-text-muted/10 text-text-muted border border-text-muted/20">处理中</span>;
    }
  };

  const getCurrencyBadge = (currency?: string) => {
    switch (currency) {
      case 'USD':
        return <span className="bg-success/15 text-success px-1.5 py-0.5 rounded font-bold text-[10px]">USD</span>;
      case 'JPY':
        return <span className="bg-blue-500/15 text-blue-500 px-1.5 py-0.5 rounded font-bold text-[10px]">JPY</span>;
      case 'EUR':
        return <span className="bg-purple-500/15 text-purple-500 px-1.5 py-0.5 rounded font-bold text-[10px]">EUR</span>;
      default:
        return <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-bold text-[10px]">CNY</span>;
    }
  };

  // Summary Metrics
  const totalAmountSum = ledgerItems.reduce((sum, item) => sum + (item.total_amount ?? item.amount ?? 0), 0);
  const pendingCount = ledgerItems.filter(item => item.settlement_status === 'PENDING' || item.settlement_status === 'PENDING_INSURER_APPROVAL').length;
  const avgComplianceScore = ledgerItems.length > 0 
    ? Math.round(ledgerItems.reduce((sum, item) => sum + (item.compliance_score ?? 0), 0) / ledgerItems.length) 
    : 0;

  const exportColumns = [
    { key: 'invoice_number', label: '单据号' },
    { key: 'patient_name', label: '患者' },
    { key: 'hospital_name', label: '医院' },
    { key: 'icd_code', label: 'ICD Code' },
    { key: 'total_amount', label: '金额' },
    { key: 'currency', label: '币种' },
    { key: 'settlement_status', label: '结算状态' },
    { key: 'created_at', label: '日期' },
    { key: 'compliance_score', label: 'AI评分' },
  ];

  return (
    <div className="p-4 md:p-6 max-w-[1200px] mx-auto">
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-xl font-black text-text-main flex items-center gap-2">
          <span>🏥 VitaCross 智能账目与跨境结算</span>
        </h1>
        <p className="text-xs text-text-muted mt-1">医疗费用划转与保险核赔记账明细看板</p>
      </div>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-card border border-border-light rounded-xl p-5 shadow-sm">
          <div className="text-xs text-text-muted font-medium mb-1">总结算金额</div>
          <div className="text-2xl font-bold text-text-main">
            ¥ {totalAmountSum.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-text-muted mt-1">已计入国际直付与垫付账户</div>
        </div>
        <div className="bg-card border border-border-light rounded-xl p-5 shadow-sm">
          <div className="text-xs text-text-muted font-medium mb-1">待处理结算</div>
          <div className="text-2xl font-bold text-warning">{pendingCount} 笔</div>
          <div className="text-[10px] text-text-muted mt-1">待保司预授权或跨境清算确认</div>
        </div>
        <div className="bg-card border border-border-light rounded-xl p-5 shadow-sm">
          <div className="text-xs text-text-muted font-medium mb-1">平均 AI 合规评分</div>
          <div className="text-2xl font-bold text-success">{avgComplianceScore} 分</div>
          <div className="text-[10px] text-text-muted mt-1">系统拦截疑似不合规或错录 3 笔</div>
        </div>
      </div>

      {/* Ledger Table Section */}
      <div className="bg-card border border-border-light rounded-xl shadow-sm flex flex-col mb-6">
        <div className="p-5 border-b border-border-light flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-sm font-bold text-text-main flex items-center gap-2">
            <span className="w-1 h-4 bg-primary rounded-full"></span>
            国际结算明细账套
          </div>
          <div className="flex items-center gap-3">
            <ExportToolbar data={ledgerItems} columns={exportColumns} filenamePrefix="vitacross_ledger" />
            <button 
              onClick={fetchLedger}
              className="btn btn-ghost !py-1.5 !px-3 border border-border-light bg-white hover:bg-bg-main text-xs font-semibold"
            >
              刷新列表
            </button>
          </div>
        </div>

        <div className="p-2 overflow-x-auto">
          <table className="w-full text-left border-spacing-0 min-w-[950px]">
            <thead>
              <tr>
                <th className="text-xs text-text-muted font-bold py-3 px-4 bg-bg-main border-y border-border-light rounded-tl-lg">单据号</th>
                <th className="text-xs text-text-muted font-bold py-3 px-4 bg-bg-main border-y border-border-light">患者</th>
                <th className="text-xs text-text-muted font-bold py-3 px-4 bg-bg-main border-y border-border-light">就诊医院</th>
                <th className="text-xs text-text-muted font-bold py-3 px-4 bg-bg-main border-y border-border-light">项目类型</th>
                <th className="text-xs text-text-muted font-bold py-3 px-4 bg-bg-main border-y border-border-light">诊断/ICD Badges</th>
                <th className="text-xs text-text-muted font-bold py-3 px-4 bg-bg-main border-y border-border-light text-right">金额</th>
                <th className="text-xs text-text-muted font-bold py-3 px-4 bg-bg-main border-y border-border-light text-center">结算币种</th>
                <th className="text-xs text-text-muted font-bold py-3 px-4 bg-bg-main border-y border-border-light text-center">AI 评分</th>
                <th className="text-xs text-text-muted font-bold py-3 px-4 bg-bg-main border-y border-border-light text-center">结算状态</th>
                <th className="text-xs text-text-muted font-bold py-3 px-4 bg-bg-main border-y border-border-light rounded-tr-lg text-center">操作</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={10} className="text-center py-8 text-text-muted text-sm">正在加载 SQLite 账簿...</td>
                </tr>
              ) : ledgerItems.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-8 text-text-muted text-sm">暂无结算账目，请前往多模态 OCR 模块上传病历或收据。</td>
                </tr>
              ) : (
                ledgerItems.map((item) => (
                  <tr key={item.id} className="hover:bg-bg-main/50 transition-colors group">
                    <td className="py-3.5 px-4 text-xs font-mono text-primary font-medium border-b border-border-light/50">
                      {item.invoice_number || `SYS-${item.id}`}
                    </td>
                    <td className="py-3.5 px-4 text-sm text-text-main font-semibold border-b border-border-light/50">
                      {item.patient_name || '-'}
                    </td>
                    <td className="py-3.5 px-4 text-sm text-text-main border-b border-border-light/50 truncate max-w-[150px]">
                      {item.hospital_name || '-'}
                    </td>
                    <td className="py-3.5 px-4 text-sm text-text-main border-b border-border-light/50">
                      {item.invoice_type || '一般结算'}
                    </td>
                    <td className="py-3.5 px-4 text-xs border-b border-border-light/50">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-text-main font-medium">{item.invoice_type}</span>
                        {item.icd_code && (
                          <span className="inline-block bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold text-[9px] w-max">
                            {item.icd_code}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-sm font-bold text-text-main text-right border-b border-border-light/50">
                      ¥ {(item.total_amount ?? item.amount ?? 0).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-center border-b border-border-light/50">
                      {getCurrencyBadge(item.currency)}
                    </td>
                    <td className="py-3.5 px-4 text-center border-b border-border-light/50">
                      <span className={`font-semibold text-xs ${
                        (item.compliance_score ?? 0) >= 90 ? 'text-success' : 
                        (item.compliance_score ?? 0) >= 60 ? 'text-warning' : 'text-danger'
                      }`}>
                        {item.compliance_score ?? 100} 分
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center border-b border-border-light/50">
                      {getStatusBadge(item.settlement_status)}
                    </td>
                    <td className="py-3.5 px-4 text-center border-b border-border-light/50">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => handleEditClick(item)}
                          className="text-xs text-primary font-bold hover:underline"
                        >
                          编辑
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="text-xs text-danger font-bold hover:underline"
                        >
                          删除
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
            <div className="p-4 border-b border-border-light flex justify-between items-center bg-white">
              <h3 className="font-bold text-text-main">编辑结算账目</h3>
              <button onClick={() => setEditingItem(null)} className="text-text-muted hover:text-text-main">✕</button>
            </div>
            <div className="p-4 flex flex-col gap-4 max-h-[70vh] overflow-y-auto bg-white">
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">单据号</label>
                <input 
                  type="text" 
                  value={editForm.invoice_number || ''} 
                  onChange={(e) => setEditForm({ ...editForm, invoice_number: e.target.value })}
                  className="w-full bg-bg-main border border-border-light rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">患者姓名</label>
                <input 
                  type="text" 
                  value={editForm.patient_name || ''} 
                  onChange={(e) => setEditForm({ ...editForm, patient_name: e.target.value })}
                  className="w-full bg-bg-main border border-border-light rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">就诊医院</label>
                <input 
                  type="text" 
                  value={editForm.hospital_name || ''} 
                  onChange={(e) => setEditForm({ ...editForm, hospital_name: e.target.value })}
                  className="w-full bg-bg-main border border-border-light rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">ICD编码</label>
                <input 
                  type="text" 
                  value={editForm.icd_code || ''} 
                  onChange={(e) => setEditForm({ ...editForm, icd_code: e.target.value })}
                  className="w-full bg-bg-main border border-border-light rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">金额</label>
                <input 
                  type="number" 
                  value={editForm.total_amount || 0} 
                  onChange={(e) => setEditForm({ ...editForm, total_amount: Number(e.target.value) })}
                  className="w-full bg-bg-main border border-border-light rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">结算币种</label>
                <select 
                  value={editForm.currency || 'CNY'} 
                  onChange={(e) => setEditForm({ ...editForm, currency: e.target.value })}
                  className="w-full bg-bg-main border border-border-light rounded px-3 py-2 text-sm focus:outline-none focus:border-primary bg-white"
                >
                  <option value="CNY">人民币 (CNY)</option>
                  <option value="USD">美元 (USD)</option>
                  <option value="JPY">日元 (JPY)</option>
                  <option value="EUR">欧元 (EUR)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">结算状态</label>
                <select 
                  value={editForm.settlement_status || 'PENDING'} 
                  onChange={(e) => setEditForm({ ...editForm, settlement_status: e.target.value })}
                  className="w-full bg-bg-main border border-border-light rounded px-3 py-2 text-sm focus:outline-none focus:border-primary bg-white"
                >
                  <option value="AUTO_SETTLED">已结算 (AUTO_SETTLED)</option>
                  <option value="SETTLED">已完成 (SETTLED)</option>
                  <option value="PENDING_INSURER_APPROVAL">待保司审批</option>
                  <option value="PENDING">处理中 (PENDING)</option>
                  <option value="REJECTED">拒赔 (REJECTED)</option>
                </select>
              </div>
            </div>
            <div className="p-4 border-t border-border-light flex justify-end gap-3 bg-bg-main/50">
              <button onClick={() => setEditingItem(null)} className="px-4 py-1.5 rounded text-sm font-medium text-text-main bg-white border border-border-light hover:bg-bg-main">取消</button>
              <button onClick={handleUpdate} className="px-4 py-1.5 rounded text-sm font-medium text-white bg-primary hover:bg-primary/90 shadow-sm">保存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
