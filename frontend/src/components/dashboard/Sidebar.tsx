"use client"

import {
    Bell,
    BookImage,
    Home,
    LineChart,
    Package,
    Settings,
    Users,
    Wallet,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { motion } from "framer-motion"

export function Sidebar() {
    return (
        <div className="hidden border-r bg-muted/40 md:block">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                    <Link href="/" className="flex items-center gap-2 font-semibold">
                        <BookImage className="h-6 w-6" />
                        <span className="">VitaCross</span>
                    </Link>
                    <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
                        <Bell className="h-4 w-4" />
                        <span className="sr-only">Toggle notifications</span>
                    </Button>
                </div>
                <div className="flex-1">
                    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                        <NavItem href="/dashboard" icon={<Home className="h-4 w-4" />} label="总览" active />
                        <NavItem href="/analytics" icon={<LineChart className="h-4 w-4" />} label="AI 报告" />
                        <NavItem href="#" icon={<Wallet className="h-4 w-4" />} label="资本化视图" />
                        <NavItem href="#" icon={<Package className="h-4 w-4" />} label="票据中心" />
                        <NavItem href="#" icon={<Users className="h-4 w-4" />} label="用户管理" />
                        <NavItem href="#" icon={<Settings className="h-4 w-4" />} label="设置" />
                    </nav>
                </div>
                <div className="mt-auto p-4">
                    <Card>
                        <CardHeader className="p-2 pt-0 md:p-4">
                            <CardTitle>需要帮助？</CardTitle>
                            <CardDescription>
                                我们的AI客服可以为您解答大部分常见问题。
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                            <Button size="sm" className="w-full">
                                联系我们
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

function NavItem({ href, icon, label, active = false }: { href: string, icon: React.ReactNode, label: string, active?: boolean }) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${active ? "bg-muted text-primary" : "text-muted-foreground"
                }`}
        >
            <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                {icon}
            </motion.div>
            {label}
        </Link>
    )
}
