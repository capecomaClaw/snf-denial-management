"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DenialRecord, TrackerStats } from "@/lib/types";
import { TrendingUp, DollarSign, AlertCircle, Trophy } from "lucide-react";

interface DenialTrackerProps {
  denials: DenialRecord[];
  stats: TrackerStats;
  onStatusChange: (id: string, status: DenialRecord["status"]) => void;
}

const STAT_CARDS = [
  { key: "total" as const, label: "Total Denials", icon: AlertCircle, color: "text-[#1B2052]" },
  { key: "revenueAtRisk" as const, label: "Revenue at Risk", icon: DollarSign, color: "text-[#ED7D31]" },
  { key: "inAppeal" as const, label: "In Appeal", icon: TrendingUp, color: "text-[#00B0F0]" },
  { key: "winRate" as const, label: "Win Rate", icon: Trophy, color: "text-green-600" },
];

function formatStat(key: keyof TrackerStats, value: number): string {
  if (key === "revenueAtRisk") return `$${value.toLocaleString()}`;
  if (key === "winRate") return `${value}%`;
  return String(value);
}

export default function DenialTracker({ denials, stats, onStatusChange }: DenialTrackerProps) {
  return (
    <div>
      <div className="grid grid-cols-4 gap-4 mb-6">
        {STAT_CARDS.map(({ key, label, icon: Icon, color }) => (
          <Card key={key} className="border border-slate-200 shadow-sm rounded-xl bg-white">
            <CardHeader className="pb-1 pt-4 px-4">
              <CardTitle className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                <Icon className={`h-3.5 w-3.5 ${color}`} />
                {label}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <p className={`text-2xl font-bold ${color}`}>{formatStat(key, stats[key])}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-2">
        {denials.length === 0 && (
          <p className="text-sm text-slate-500 text-center py-12">
            No denials loaded. Use the Analyze tab or load demo data.
          </p>
        )}
        {denials.map((d) => (
          <Card key={d.id} className="border border-slate-200 shadow-sm rounded-xl bg-white">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-semibold text-slate-900">{d.patientName}</span>
                  <span className="text-xs text-slate-400">{d.claimNumber}</span>
                </div>
                <p className="text-xs text-slate-500">
                  {d.payer} · {d.analysis?.rootCause ?? "Pending analysis"}
                </p>
              </div>
              <span className="text-sm font-bold text-[#ED7D31] shrink-0">
                ${d.deniedAmount.toLocaleString()}
              </span>
              <select
                className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#00B0F0] bg-white"
                value={d.status}
                onChange={(e) => onStatusChange(d.id, e.target.value as DenialRecord["status"])}
              >
                {["New", "In Appeal", "Won", "Lost"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
