"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import type { PieLabelRenderProps } from "recharts";
import type {
  TimeSeriesPoint,
  TierBreakdown,
  RevenueSummary,
} from "@/lib/reporting";

const PURPOSE_COLORS: Record<string, string> = {
  MEMBERSHIP: "#c2873f",
  TICKET: "#2c4a8c",
  DONATION: "#b5502a",
  OTHER: "#888888",
};

const RADIAN = Math.PI / 180;

function PieLabel(props: PieLabelRenderProps) {
  const cx = Number(props.cx ?? 0);
  const cy = Number(props.cy ?? 0);
  const midAngle = Number(props.midAngle ?? 0);
  const innerRadius = Number(props.innerRadius ?? 0);
  const outerRadius = Number(props.outerRadius ?? 0);
  const percent = Number(props.percent ?? 0);
  const name = String(props.name ?? "");
  if (percent < 0.05) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={11}
      fontWeight="600"
    >
      {name}
      {"\n"}
      {(percent * 100).toFixed(0)}%
    </text>
  );
}

export function RevenueTrendChart({ data }: { data: TimeSeriesPoint[] }) {
  const purposes = ["MEMBERSHIP", "TICKET", "DONATION", "OTHER"] as const;
  const displayed = purposes.filter((p) => data.some((d) => d[p] > 0));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart
        data={data}
        margin={{ top: 4, right: 8, left: 8, bottom: 4 }}
        barCategoryGap="30%"
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fill: "rgba(255,255,255,0.4)" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v: string) => v.slice(5)} // MM-DD
        />
        <YAxis
          tick={{ fontSize: 10, fill: "rgba(255,255,255,0.4)" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v: number) =>
            v >= 1_000_000
              ? `${(v / 1_000_000).toFixed(1)}M`
              : v >= 1000
                ? `${(v / 1000).toFixed(0)}k`
                : String(v)
          }
        />
        <Tooltip
          contentStyle={{
            background: "#1a2540",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8,
            fontSize: 12,
          }}
          labelStyle={{ color: "rgba(255,255,255,0.6)", marginBottom: 4 }}
          itemStyle={{ color: "rgba(255,255,255,0.8)" }}
          formatter={(value) => [`$${Number(value).toLocaleString()}`, undefined]}
        />
        <Legend
          wrapperStyle={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}
        />
        {displayed.map((p) => (
          <Bar
            key={p}
            dataKey={p}
            stackId="revenue"
            fill={PURPOSE_COLORS[p]}
            radius={[0, 0, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

export function SourceSplitChart({ summary }: { summary: RevenueSummary }) {
  const data = summary.totalByPurpose
    .filter((p) => p.total > 0)
    .map((p) => ({ name: p.purpose, value: p.total }));

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-52 text-white/30 text-sm">
        No data
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={90}
          paddingAngle={2}
          dataKey="value"
          labelLine={false}
          label={PieLabel}
        >
          {data.map((entry) => (
            <Cell
              key={entry.name}
              fill={PURPOSE_COLORS[entry.name] ?? "#888"}
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: "#1a2540",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8,
            fontSize: 12,
          }}
          formatter={(value) => [`$${Number(value).toLocaleString()}`, undefined]}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function TierDistributionChart({ tiers }: { tiers: TierBreakdown[] }) {
  const data = tiers.map((t) => ({
    name: t.tierName,
    members: t.activeMembers,
    revenue: t.revenue,
    color: t.tierColor ?? "#888",
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart
        data={data}
        margin={{ top: 4, right: 8, left: 8, bottom: 4 }}
        barCategoryGap="40%"
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: "rgba(255,255,255,0.5)" }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          yAxisId="members"
          orientation="left"
          tick={{ fontSize: 10, fill: "rgba(255,255,255,0.35)" }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          yAxisId="revenue"
          orientation="right"
          tick={{ fontSize: 10, fill: "rgba(255,255,255,0.35)" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v: number) =>
            v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)
          }
        />
        <Tooltip
          contentStyle={{
            background: "#1a2540",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8,
            fontSize: 12,
          }}
          formatter={(value, name) =>
            name === "revenue"
              ? [`$${Number(value).toLocaleString()}`, "Revenue"]
              : [value, "Members"]
          }
        />
        <Bar yAxisId="members" dataKey="members" name="Members" radius={[4, 4, 0, 0]}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.color} />
          ))}
        </Bar>
        <Bar
          yAxisId="revenue"
          dataKey="revenue"
          name="Revenue"
          fill="rgba(194,135,63,0.3)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
