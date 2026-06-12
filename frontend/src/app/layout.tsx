import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'VitaCross | AI-Powered Medical & Cross-Border Payment Platform',
  description: 'VitaCross — 多模态 OCR 病历解析、ICD-10/11 自动映射、跨境保险结算一体化 SaaS 平台',
  keywords: 'inbound medical, ICD-10, cross-border payment, insurance claims, AI OCR, VitaCross',
  openGraph: {
    title: 'VitaCross — AI Medical & Payment Infrastructure',
    description: 'AI-driven inbound medical care & cross-border payment platform for international patients in China.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
