"use client"

import { useLanguage } from "@/contexts/language-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface OccupancyChartProps {
  data: {
    date: string
    occupancy: number
  }[]
}

export function OccupancyChart({ data }: OccupancyChartProps) {
  const { t } = useLanguage()

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>{t("daily_occupancy")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} padding={{ left: 10, right: 10 }} />
              <YAxis
                tickFormatter={(value) => `${value}%`}
                domain={[0, 100]}
                tickLine={false}
                axisLine={false}
                ticks={[0, 25, 50, 75, 100]}
              />
              <Tooltip formatter={(value) => [`${value}%`, t("occupancy_rate")]} labelFormatter={(label) => label} />
              <Line
                type="monotone"
                dataKey="occupancy"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

