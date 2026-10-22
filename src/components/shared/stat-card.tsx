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
      bg: "bg-blue-50/70 border-blue-100",
      iconBg: "bg-blue-600 text-white shadow-blue-500/20",
      accent: "text-blue-700",
    },
    emerald: {
      bg: "bg-emerald-50/70 border-emerald-100",
      iconBg: "bg-emerald-600 text-white shadow-emerald-500/20",
      accent: "text-emerald-700",
    },
    amber: {
      bg: "bg-amber-50/70 border-amber-100",
      iconBg: "bg-amber-500 text-white shadow-amber-500/20",
      accent: "text-amber-700",
    },
    purple: {
      bg: "bg-purple-50/70 border-purple-100",
      iconBg: "bg-purple-600 text-white shadow-purple-500/20",
      accent: "text-purple-700",
    },
    rose: {
      bg: "bg-rose-50/70 border-rose-100",
      iconBg: "bg-rose-600 text-white shadow-rose-500/20",
      accent: "text-rose-700",
    },
  };

  const style = variantStyles[variant];

  return (
    <div
      className={cn(
        "rounded-2xl border p-5 bg-white shadow-xs transition-all duration-200 hover:shadow-md flex flex-col justify-between",
        style.bg
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 truncate">
            {title}
          </p>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">
            {value}
          </h3>
        </div>
        <div
          className={cn(
            "w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-md",
            style.iconBg
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(description || trend) && (
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-200/50 text-xs">
          {trend && (
            <span
              className={cn(
                "font-bold px-1.5 py-0.5 rounded text-[11px]",
                trend.isPositive
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-rose-100 text-rose-800"
              )}
            >
              {trend.value}
            </span>
          )}
          {description && <span className="text-slate-500">{description}</span>}
        </div>
      )}
    </div>
  );
}
