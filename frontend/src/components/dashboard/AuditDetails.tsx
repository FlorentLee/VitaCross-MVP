"use client"

import { useEffect, useState } from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { getLedger } from "@/lib/api"

const statusMap = {
    Passed: { label: "通过", variant: "success" },
    Warning: { label: "警告", variant: "warning" },
    Failed: { label: "失败", variant: "destructive" },
} as const

const riskMap = {
    Low: { label: "低风险", color: "text-green-600" },
    Medium: { label: "中风险", color: "text-yellow-600" },
    High: { label: "高风险", color: "text-red-600" },
} as const

interface AuditDetailsProps {
    refreshKey?: number; // Used to trigger refetch
}

export function AuditDetails({ refreshKey = 0 }: AuditDetailsProps) {
    const [auditItems, setAuditItems] = useState<any[]>([])

    useEffect(() => {
        const fetchLedger = async () => {
            try {
                const data = await getLedger()
                const formatted = data.map((item: any) => ({
                    id: item.invoice_number || `SYS-${item.id}`,
                    date: new Date().toISOString().split('T')[0], // Demo
                    company: "动态解析结果",
                    amount: `¥${item.total_amount?.toLocaleString()}`,
                    status: item.invoice_type === "UNKNOWN" ? "Warning" : "Passed",
                    risk: item.invoice_type === "UNKNOWN" ? "Medium" : "Low",
                }))
                // 补充一些静态做兜底演示
                setAuditItems(formatted.length > 0 ? formatted.slice(0, 5) : [
                     {
                         id: "DEMO-001",
                         date: "2024-03-13",
                         company: "阿里巴巴网络技术有限公司",
                         amount: "¥12,400.00",
                         status: "Passed",
                         risk: "Low",
                     }
                ])
            } catch (err) {
                console.error("查账失败", err)
            }
        }
        fetchLedger()
    }, [refreshKey])

    return (
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>最近审计详情 (来自 SQLite)</CardTitle>
                <CardDescription>
                    显示后端返回的发票审计记录及其风险评估结果。
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>发票编号</TableHead>
                            <TableHead>日期</TableHead>
                            <TableHead>对方单位</TableHead>
                            <TableHead>金额</TableHead>
                            <TableHead>审计状态</TableHead>
                            <TableHead className="text-right">风险等级</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {auditItems.map((item, index) => (
                            <motion.tr
                                key={item.id + index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group hover:bg-muted/50 cursor-pointer"
                            >
                                <TableCell className="font-medium">{item.id}</TableCell>
                                <TableCell>{item.date}</TableCell>
                                <TableCell>{item.company}</TableCell>
                                <TableCell>{item.amount}</TableCell>
                                <TableCell>
                                    <Badge variant={statusMap[item.status as keyof typeof statusMap]?.variant as any || "outline"}>
                                        {statusMap[item.status as keyof typeof statusMap]?.label || "处理中"}
                                    </Badge>
                                </TableCell>
                                <TableCell className={`text-right font-semibold ${riskMap[item.risk as keyof typeof riskMap]?.color}`}>
                                    {riskMap[item.risk as keyof typeof riskMap]?.label || "未知"}
                                </TableCell>
                            </motion.tr>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
