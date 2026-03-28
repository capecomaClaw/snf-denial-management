"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { PenLine, RefreshCw } from "lucide-react";
import ExportButton from "./ExportButton";
import type { DenialRecord } from "@/lib/types";

interface AppealDraftProps {
  denial: DenialRecord | null;
  appealLetter: string | null;
  isLoading: boolean;
  onRegenerate?: () => void;
}

export default function AppealDraft({ denial, appealLetter, isLoading, onRegenerate }: AppealDraftProps) {
  const [editedLetter, setEditedLetter] = useState(appealLetter ?? "");

  useEffect(() => {
    setEditedLetter(appealLetter ?? "");
  }, [appealLetter]);

  if (isLoading) {
    return (
      <Card className="border border-slate-200 shadow-sm rounded-xl bg-white">
        <CardHeader className="pb-3">
          <Skeleton className="h-4 w-40" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className={`h-4 w-${i % 2 === 0 ? "full" : "3/4"}`} />)}
        </CardContent>
      </Card>
    );
  }

  if (!denial || !appealLetter) {
    return (
      <Card className="border border-slate-200 shadow-sm rounded-xl bg-white">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <PenLine className="h-10 w-10 text-slate-300 mb-3" />
          <p className="text-sm text-slate-500">Appeal letter will appear here</p>
          <p className="text-xs text-slate-400 mt-1">Analyze a denial to generate a draft</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-slate-200 shadow-sm rounded-xl bg-white">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <PenLine className="h-4 w-4 text-[#00B0F0]" />
            Appeal Letter Draft
          </CardTitle>
          <div className="flex gap-2">
            {onRegenerate && (
              <Button variant="ghost" size="sm" className="text-xs text-slate-500 hover:text-slate-700" onClick={onRegenerate}>
                <RefreshCw className="h-3 w-3 mr-1" />
                Regenerate
              </Button>
            )}
            <ExportButton denial={denial} letterText={editedLetter} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-slate-400 mb-2 italic">Edit directly before exporting</p>
        <textarea
          className="w-full text-xs font-mono border border-slate-200 rounded-xl p-3 h-96 resize-none focus:outline-none focus:ring-2 focus:ring-[#00B0F0] text-slate-700 leading-relaxed"
          value={editedLetter}
          onChange={(e) => setEditedLetter(e.target.value)}
        />
      </CardContent>
    </Card>
  );
}
