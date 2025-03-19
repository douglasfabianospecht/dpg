"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface KpiCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  meta?: string
  metaValue?: string
  percentChange?: number
  iconColor?: string
}

export function KpiCard({ title, value, icon: Icon, meta, metaValue, percentChange, iconColor }: KpiCardProps) {
  const { t } = useLanguage()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={cn("h-4 w-4", iconColor)} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {meta && (
          <p className="text-xs text-muted-foreground">
            {t("goal")}: {metaValue}
          </p>
        )}
        {percentChange !== undefined && (
          <div className={cn("mt-2 flex items-center text-xs", percentChange > 0 ? "text-green-500" : "text-red-500")}>
            <span className="mr-1">{percentChange > 0 ? "↑" : "↓"}</span>
            {Math.abs(percentChange)}% {t("vs_goal")}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

