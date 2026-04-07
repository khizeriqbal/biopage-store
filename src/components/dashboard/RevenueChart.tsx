"use client";

import {
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    CartesianGrid,
    Area,
    AreaChart
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils"; // I'll create this in lib/utils.ts

interface RevenueChartProps {
    data: { date: string; revenue: number }[];
}

export function RevenueChart({ data }: RevenueChartProps) {
    return (
        <Card className="col-span-1 md:col-span-4 border-border bg-surface-raised/40 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-base font-semibold text-white">Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent className="h-[350px] w-full p-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#5C4EFA" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#5C4EFA" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#1E1E30" opacity={0.5} />
                        <XAxis
                            dataKey="date"
                            stroke="#8B87A8"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => value.split("-").slice(1).join("/")}
                        />
                        <YAxis
                            stroke="#8B87A8"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="bg-surface p-3 border border-border rounded-lg shadow-xl">
                                            <p className="text-xs text-muted-foreground mb-1">{payload[0].payload.date}</p>
                                            <p className="text-lg font-bold text-white">
                                                {formatPrice(payload[0].value as number)}
                                            </p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#5C4EFA"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorRevenue)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
