"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { FileText, CheckCircle, AlertTriangle, Clock } from "lucide-react"

const container = {
    hidden: { opacity: 1, scale: 0 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            delayChildren: 0.1,
            staggerChildren: 0.1
        }
    }
}

const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1
    }
}

export function StatusCards({
    warningCount = 42,
    totalProcessed = 1284,
    complianceScore = 87.2
}: {
    warningCount?: number,
    totalProcessed?: number,
    complianceScore?: number
}) {
    const stats = [
        {
            title: "总票据数",
            value: totalProcessed.toLocaleString(),
            icon: FileText,
            description: "本月新增 +12%",
            color: "text-blue-500",
        },
        {
            title: "合规健康度",
            value: `${complianceScore}%`,
            icon: CheckCircle,
            description: "通过率稳定",
            color: "text-green-500",
        },
        {
            title: "异常预警",
            value: warningCount.toString(),
            icon: AlertTriangle,
            description: "需要人工核对",
            color: "text-red-500",
        },
        {
            title: "待处理",
            value: "122",
            icon: Clock,
            description: "平均处理时间 2h",
            color: "text-yellow-500",
        },
    ]

    return (
        <motion.div
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
            variants={container}
            initial="hidden"
            animate="visible"
        >
            {stats.map((stat, index) => (
                <motion.div key={index} variants={item}>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </motion.div>
    )
}
