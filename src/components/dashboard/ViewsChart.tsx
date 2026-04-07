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
import { formatCompactNumber } from "@/lib/utils";

interface ViewsChartProps {
    data: { date: string; views: number }[];
}

export function ViewsChart({ data }: ViewsChartProps) {
    return (
        <Card className="col-span-1 border-border bg-surface-raised/40 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-base font-semibold text-white">Audience Growth (Views)</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] w-full p-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#C6FF4E" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#C6FF4E" stopOpacity={0} />
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
                            tickFormatter={(value) => formatCompactNumber(value)}
                        />
                        <Tooltip
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="bg-surface p-3 border border-border rounded-lg shadow-xl">
                                            <p className="text-xs text-muted-foreground mb-1">{payload[0].payload.date}</p>
                                            <p className="text-lg font-bold text-white">
                                                {formatCompactNumber(payload[0].value as number)} views
                                            </p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="views"
                            stroke="#C6FF4E"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorViews)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
