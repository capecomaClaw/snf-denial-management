"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { DenialRecord } from "@/lib/types";
import { FileSearch, Tag, BookOpen, Calendar } from "lucide-react";

interface DenialViewerProps {
  denial: DenialRecord | null;
  isLoading: boolean;
}

const VIABILITY_CLASS: Record<string, string> = {
  High: "bg-green-50 text-green-700 border-green-200",
  Medium: "bg-amber-50 text-amber-700 border-amber-200",
  Low: "bg-red-50 text-red-700 border-red-200",
};

export default function DenialViewer({ denial, isLoading }: DenialViewerProps) {
  if (isLoading) {
    return (
      <Card className="border border-slate-200 shadow-sm rounded-xl bg-white">
        <CardHeader className="pb-3">
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
        </CardContent>
      </Card>
    );
  }

  if (!denial) {
    return (
      <Card className="border border-slate-200 shadow-sm rounded-xl bg-white">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <FileSearch className="h-10 w-10 text-slate-300 mb-3" />
          <p className="text-sm text-slate-500">Select a denial to view details</p>
          <p className="text-xs text-slate-400 mt-1">or load demo denials to get started</p>
        </CardContent>
      </Card>
    );
  }

  const { analysis } = denial;

  return (
    <Card className="border border-slate-200 shadow-sm rounded-xl bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
          <FileSearch className="h-4 w-4 text-[#00B0F0]" />
          Denial Details — {denial.patientName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div><span className="text-slate-500 text-xs">Claim #</span><p className="font-medium text-slate-800">{denial.claimNumber}</p></div>
          <div><span className="text-slate-500 text-xs">Payer</span><p className="font-medium text-slate-800">{denial.payer}</p></div>
          <div><span className="text-slate-500 text-xs">Service Date</span><p className="font-medium text-slate-800">{denial.serviceDate}</p></div>
          <div><span className="text-slate-500 text-xs">Denied Amount</span><p className="font-bold text-[#ED7D31]">${denial.deniedAmount.toLocaleString()}</p></div>
        </div>

        <Separator />

        {analysis ? (
          <>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Tag className="h-3 w-3 text-[#00B0F0]" />
                <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Root Cause</span>
              </div>
              <p className="text-sm font-semibold text-[#1B2052]">{analysis.rootCause}</p>
              <p className="text-xs text-slate-500 mt-1">{analysis.summary}</p>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Badge className={`text-xs border ${VIABILITY_CLASS[analysis.appealViability]}`}>
                {analysis.appealViability} Appeal Viability
              </Badge>
              {analysis.codes.map((c) => (
                <Badge key={c.code} className="text-xs bg-blue-50 text-blue-700 border-blue-200 border">
                  {c.type} {c.code}
                </Badge>
              ))}
            </div>

            {analysis.codes.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-3 w-3 text-[#00B0F0]" />
                  <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Code Meanings</span>
                </div>
                <div className="space-y-1">
                  {analysis.codes.map((c) => (
                    <div key={c.code} className="text-xs text-slate-600 bg-slate-50 rounded-lg p-2">
                      <span className="font-semibold">{c.type} {c.code}:</span> {c.description}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-3 w-3 text-[#00B0F0]" />
                <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Required Documentation</span>
              </div>
              <ul className="space-y-1">
                {analysis.requiredDocumentation.map((doc, i) => (
                  <li key={i} className="text-xs text-slate-600 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#00B0F0] shrink-0" />
                    {doc}
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <p className="text-xs text-slate-500 italic">Analysis not yet performed for this denial.</p>
        )}
      </CardContent>
    </Card>
  );
}
