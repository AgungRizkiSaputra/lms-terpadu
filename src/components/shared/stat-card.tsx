import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  variant?: "blue" | "emerald" | "amber" | "purple" | "rose";
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  variant = "blue",
  trend,
}: StatCardProps) {
  const variantStyles = {
    blue: {
      accentBorder: "hover:border-blue-300",
      iconBg: "bg-blue-50 text-blue-700 border border-blue-100/80",
      indicator: "bg-blue-600",
    },
    emerald: {
      accentBorder: "hover:border-emerald-300",
      iconBg: "bg-emerald-50 text-emerald-700 border border-emerald-100/80",
      indicator: "bg-emerald-600",
    },
    amber: {
      accentBorder: "hover:border-amber-300",
      iconBg: "bg-amber-50 text-amber-700 border border-amber-100/80",
      indicator: "bg-amber-500",
    },
    purple: {
      accentBorder: "hover:border-purple-300",
      iconBg: "bg-purple-50 text-purple-700 border border-purple-100/80",
      indicator: "bg-purple-600",
    },
    rose: {
      accentBorder: "hover:border-rose-300",
      iconBg: "bg-rose-50 text-rose-700 border border-rose-100/80",
      indicator: "bg-rose-600",
    },
  };

  const style = variantStyles[variant];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs hover:shadow-xs transition-all duration-200 flex flex-col justify-between group",
        style.accentBorder
      )}
    >
      {/* Subtle top indicator bar */}
      <div className={cn("absolute top-0 left-0 right-0 h-1 opacity-80", style.indicator)} />

      <div className="flex items-start justify-between gap-3 pt-1">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 truncate">
            {title}
          </p>
          <h3 className="text-2xl font-black text-slate-900 mt-1.5 tracking-tight">
            {value}
          </h3>
        </div>
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105",
            style.iconBg
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(description || trend) && (
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
          {trend && (
            <span
              className={cn(
                "font-bold px-1.5 py-0.5 rounded text-[11px]",
                trend.isPositive
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200/60"
                  : "bg-rose-50 text-rose-800 border border-rose-200/60"
              )}
            >
              {trend.value}
            </span>
          )}
          {description && <span className="text-slate-500 font-medium">{description}</span>}
        </div>
      )}
    </div>
  );
}
