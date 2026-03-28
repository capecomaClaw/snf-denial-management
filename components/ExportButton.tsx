"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import type { DenialRecord } from "@/lib/types";

interface ExportButtonProps {
  denial: DenialRecord;
  letterText: string;
}

export default function ExportButton({ denial, letterText }: ExportButtonProps) {
  const exportLetter = () => {
    const blob = new Blob([letterText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `appeal-${denial.claimNumber}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportJson = () => {
    const summary = {
      claimNumber: denial.claimNumber,
      patientName: denial.patientName,
      payer: denial.payer,
      deniedAmount: denial.deniedAmount,
      status: denial.status,
      denialDate: denial.denialDate,
      analysis: denial.analysis,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(summary, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `denial-summary-${denial.claimNumber}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-1">
      <Button
        size="sm"
        variant="outline"
        className="text-xs border-[#1B2052] text-[#1B2052] hover:bg-slate-50"
        onClick={exportLetter}
      >
        <Download className="h-3 w-3 mr-1" />
        Letter
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="text-xs border-slate-300 text-slate-600 hover:bg-slate-50"
        onClick={exportJson}
      >
        <Download className="h-3 w-3 mr-1" />
        JSON
      </Button>
    </div>
  );
}
