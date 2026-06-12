"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Brain, Zap, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react'

interface WorkflowNode {
    id: string
    name: string
    type: string
}

interface WorkflowViewProps {
    data: {
        nodes: WorkflowNode[]
    }
    lastAnalysis?: any
}

const WorkflowView: React.FC<WorkflowViewProps> = ({ data, lastAnalysis }) => {
    const isDuplicate = lastAnalysis?.duplicate_detected || false
    const activeNodeId = isDuplicate ? 'node_2' : (lastAnalysis ? 'node_4' : 'node_1')

    // 节点状态判断
    const getNodeStatus = (nodeId: string) => {
        const nodeIndex = data.nodes.findIndex(n => n.id === nodeId)
        const activeIndex = data.nodes.findIndex(n => n.id === activeNodeId)

        if (isDuplicate && nodeId === 'node_2') return 'error'
        if (nodeIndex < activeIndex) return 'completed'
        if (nodeId === activeNodeId) return 'processing'
        return 'pending'
    }

    return (
        <div className="mt-8">
            <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-200">
                    <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-800 tracking-tight">AI 大脑决策中心</h3>
                    <p className="text-xs text-slate-500 font-medium">低代码工作流可视化 · 实时审计流转</p>
                </div>
            </div>

            <div className="relative flex items-center justify-between w-full px-8 py-12 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
                {/* 背景装饰线 */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-slate-100" />
                </div>

                {data.nodes.map((node, index) => {
                    const status = getNodeStatus(node.id)
                    const isLast = index === data.nodes.length - 1

                    return (
                        <React.Fragment key={node.id}>
                            <div className="relative flex flex-col items-center z-10">
                                {/* 状态提示 (仅针对重复发票拦截) */}
                                {isDuplicate && node.id === 'node_2' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        className="absolute -top-16 flex flex-col items-center"
                                    >
                                        <div className="relative">
                                            <Zap className="w-8 h-8 text-red-500 fill-red-500" />
                                            <motion.div
                                                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                                transition={{ repeat: Infinity, duration: 1 }}
                                                className="absolute inset-0 bg-red-400 rounded-full -z-10 blur-md"
                                            />
                                        </div>
                                        <span className="mt-1 text-[11px] font-bold text-red-600 whitespace-nowrap bg-red-50 px-3 py-1 rounded-full border border-red-100 shadow-sm">
                                            检测到重复发票，已拦截
                                        </span>
                                    </motion.div>
                                )}

                                {/* 节点主体 - 玻璃拟态 */}
                                <motion.div
                                    animate={status === 'processing' ? {
                                        scale: [1, 1.02, 1],
                                        boxShadow: ["0 0 0px rgba(79, 70, 229, 0)", "0 0 25px rgba(79, 70, 229, 0.3)", "0 0 0px rgba(79, 70, 229, 0)"]
                                    } : {}}
                                    transition={{ repeat: Infinity, duration: 2.5 }}
                                    className={`
                                        w-36 h-24 rounded-2xl flex flex-col items-center justify-center p-4 text-center transition-all duration-700
                                        backdrop-blur-xl border shadow-sm relative overflow-hidden
                                        ${status === 'completed' ? 'bg-indigo-50/40 border-indigo-200/50 text-indigo-700' :
                                            status === 'processing' ? 'bg-white/90 border-indigo-500 text-indigo-900 ring-4 ring-indigo-500/10' :
                                                status === 'error' ? 'bg-red-50/60 border-red-200 text-red-700' :
                                                    'bg-slate-50/30 border-slate-200/60 text-slate-400'}
                                    `}
                                >
                                    {/* 内部装饰 */}
                                    {status === 'processing' && (
                                        <motion.div
                                            className="absolute bottom-0 left-0 h-1 bg-indigo-500"
                                            initial={{ width: 0 }}
                                            animate={{ width: "100%" }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                        />
                                    )}

                                    {status === 'completed' && <CheckCircle2 className="w-5 h-5 mb-2 text-indigo-500" />}
                                    {status === 'error' && <AlertCircle className="w-5 h-5 mb-2 text-red-500" />}
                                    <span className="text-[13px] font-bold leading-snug">{node.name}</span>
                                    <span className="text-[9px] mt-1.5 opacity-50 uppercase tracking-widest font-semibold">{node.type.replace('_', ' ')}</span>
                                </motion.div>
                            </div>

                            {/* 连接箭头与动态流光 */}
                            {!isLast && (
                                <div className="flex-1 relative h-1 mx-2 flex items-center">
                                    <div className="w-full h-[2px] bg-slate-100 relative overflow-hidden rounded-full">
                                        {/* 流光效果 */}
                                        {(status === 'completed' || status === 'processing') && !isDuplicate && (
                                            <motion.div
                                                initial={{ left: "-100%" }}
                                                animate={{ left: "100%" }}
                                                transition={{
                                                    repeat: Infinity,
                                                    duration: status === 'completed' ? 1.5 : 3,
                                                    ease: "linear"
                                                }}
                                                className={`absolute top-0 bottom-0 w-2/3 bg-gradient-to-r from-transparent ${status === 'completed' ? 'via-indigo-400' : 'via-slate-300'} to-transparent`}
                                            />
                                        )}
                                    </div>
                                    <div className={`ml-[-4px] z-10 ${status === 'completed' ? 'text-indigo-400' : 'text-slate-200'}`}>
                                        <ArrowRight size={16} strokeWidth={3} />
                                    </div>
                                </div>
                            )}
                        </React.Fragment>
                    )
                })}
            </div>
        </div>
    )
}

export default WorkflowView
