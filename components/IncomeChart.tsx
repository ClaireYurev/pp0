"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ChartContainer } from "@/components/ui/chart"

interface IncomeData {
  issueDate: Date
  amount: number
}

export function IncomeChart({ data }: { data: IncomeData[] }) {
  const [chartData, setChartData] = useState<{ date: string; amount: number }[]>([])

  useEffect(() => {
    // Transform the data for the chart
    const transformed = data.map((item) => ({
      date: new Date(item.issueDate).toLocaleDateString(),
      amount: item.amount,
    }))
    setChartData(transformed)
  }, [data])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income Overview</CardTitle>
        <CardDescription>Your income trends over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            amount: {
              label: "Amount",
              color: "hsl(var(--primary))",
            },
          }}
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip />
              <Line type="monotone" dataKey="amount" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default IncomeChart

