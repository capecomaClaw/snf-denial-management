"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { DenialRecord } from "@/lib/types";
import { AlertCircle, Clock, CheckCircle, XCircle, FileText } from "lucide-react";

interface DenialCardProps {
  denial: DenialRecord;
  isSelected: boolean;
  onClick: () => void;
}

const STATUS_CONFIG = {
  New: { icon: AlertCircle, className: "bg-blue-50 text-blue-700 border-blue-200" },
  "In Appeal": { icon: Clock, className: "bg-amber-50 text-amber-700 border-amber-200" },
  Won: { icon: CheckCircle, className: "bg-green-50 text-green-700 border-green-200" },
  Lost: { icon: XCircle, className: "bg-red-50 text-red-700 border-red-200" },
};

const VIABILITY_CLASS: Record<string, string> = {
  High: "bg-green-50 text-green-700 border-green-200",
  Medium: "bg-amber-50 text-amber-700 border-amber-200",
  Low: "bg-red-50 text-red-700 border-red-200",
};

function deadlineCountdown(denialDate: string, deadlineDays: number): number {
  const denial = new Date(denialDate);
  const deadline = new Date(denial.getTime() + deadlineDays * 86400000);
  return Math.max(0, Math.ceil((deadline.getTime() - Date.now()) / 86400000));
}

export default function DenialCard({ denial, isSelected, onClick }: DenialCardProps) {
  const statusCfg = STATUS_CONFIG[denial.status];
  const StatusIcon = statusCfg.icon;
  const daysLeft = denial.analysis
    ? deadlineCountdown(denial.denialDate, denial.analysis.deadlineDays)
    : null;

  return (
    <Card
      onClick={onClick}
      className={`border cursor-pointer transition-all rounded-xl ${
        isSelected
          ? "border-[#00B0F0] shadow-md bg-[#F8FAFC]"
          : "border-slate-200 shadow-sm bg-white hover:border-slate-300"
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <FileText className="h-4 w-4 text-[#00B0F0] shrink-0" />
            <span className="text-sm font-semibold text-slate-900 truncate">{denial.patientName}</span>
          </div>
          <Badge className={`text-xs border shrink-0 ${statusCfg.className}`}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {denial.status}
          </Badge>
        </div>

        <p className="text-xs text-slate-500 mb-1">{denial.claimNumber}</p>
        <p className="text-xs text-slate-600 mb-2">{denial.payer}</p>

        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-[#ED7D31]">
            ${denial.deniedAmount.toLocaleString()}
          </span>
          {denial.analysis && (
            <Badge className={`text-xs border ${VIABILITY_CLASS[denial.analysis.appealViability]}`}>
              {denial.analysis.appealViability} viability
            </Badge>
          )}
        </div>

        {daysLeft !== null && (
          <p className={`text-xs mt-2 font-medium ${daysLeft < 30 ? "text-red-600" : "text-slate-500"}`}>
            {daysLeft}d until deadline
          </p>
        )}

        {denial.analysis && (
          <p className="text-xs text-slate-500 mt-1 truncate">{denial.analysis.rootCause}</p>
        )}
      </CardContent>
    </Card>
  );
}
