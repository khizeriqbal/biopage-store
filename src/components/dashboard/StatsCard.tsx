import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: string;
    description?: string;
    trend?: {
        value: number;
        isUp: boolean;
    };
    isActive?: boolean;
}

export function StatsCard({ title, value, description, trend, isActive }: StatsCardProps) {
    return (
        <Card className={cn(
            "border-border bg-surface-raised/40 backdrop-blur-sm transition-all hover:bg-surface-hover/50 hover:border-brand/30",
            isActive && "border-brand bg-brand/5"
        )}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold tracking-tight text-white">{value}</div>
                {(description || trend) && (
                    <div className="flex items-center gap-1.5 mt-1">
                        {trend && (
                            <span className={cn(
                                "flex items-center text-xs font-medium",
                                trend.isUp ? "text-accent" : "text-destructive"
                            )}>
                                {trend.isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                                {trend.value}%
                            </span>
                        )}
                        {description && (
                            <p className="text-xs text-muted-foreground">
                                {description}
                            </p>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
