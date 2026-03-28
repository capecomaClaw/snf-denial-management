"use client";

import { useState, useCallback } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import DenialCard from "./DenialCard";
import DenialUpload from "./DenialUpload";
import DenialViewer from "./DenialViewer";
import AppealDraft from "./AppealDraft";
import DenialTracker from "./DenialTracker";
import type { DenialRecord, AnalyzeResponse, TrackerStats } from "@/lib/types";
import { AlertCircle } from "lucide-react";

export default function DenialApp() {
  const [denials, setDenials] = useState<DenialRecord[]>([]);
  const [selected, setSelected] = useState<DenialRecord | null>(null);
  const [appealLetter, setAppealLetter] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [analyzeError, setAnalyzeError] = useState("");

  const handleAnalyze = useCallback(async (
    text: string,
    meta?: { claimNumber?: string; payer?: string; deniedAmount?: number }
  ) => {
    setIsAnalyzing(true);
    setAnalyzeError("");
    setAppealLetter(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText: text, payerType: "Medicare", ...meta }),
      });
      const data: AnalyzeResponse & { error?: string } = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Analysis failed");

      const record: DenialRecord = {
        id: crypto.randomUUID(),
        patientName: meta?.claimNumber ? "Uploaded Patient" : "New Patient",
        claimNumber: meta?.claimNumber ?? `CLM-${Date.now()}`,
        payer: meta?.payer ?? "Unknown Payer",
        payerType: "Medicare",
        serviceDate: new Date().toLocaleDateString(),
        denialDate: new Date().toLocaleDateString(),
        deniedAmount: meta?.deniedAmount ?? 0,
        status: "New",
        analysis: data.analysis,
        appealLetter: data.appealLetter,
        rawText: text,
        createdAt: new Date().toISOString(),
      };
      setDenials((prev) => [record, ...prev]);
      setSelected(record);
      setAppealLetter(data.appealLetter);
    } catch (err) {
      setAnalyzeError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const handleDemoLoad = useCallback(async () => {
    setIsDemoLoading(true);
    try {
      const res = await fetch("/api/demo");
      const data: { denials: DenialRecord[] } = await res.json();
      setDenials(data.denials);
      setSelected(data.denials[0]);
      setAppealLetter(null);
    } finally {
      setIsDemoLoading(false);
    }
  }, []);

  const handleSelectDenial = (denial: DenialRecord) => {
    setSelected(denial);
    setAppealLetter(denial.appealLetter);
    setAnalyzeError("");
  };

  const updateStatus = (id: string, status: DenialRecord["status"]) => {
    setDenials((prev) => prev.map((d) => d.id === id ? { ...d, status } : d));
    if (selected?.id === id) setSelected((s) => s ? { ...s, status } : s);
  };

  const stats: TrackerStats = {
    total: denials.length,
    inAppeal: denials.filter((d) => d.status === "In Appeal").length,
    won: denials.filter((d) => d.status === "Won").length,
    lost: denials.filter((d) => d.status === "Lost").length,
    winRate: denials.length > 0 ? Math.round((denials.filter((d) => d.status === "Won").length / denials.length) * 100) : 0,
    revenueAtRisk: denials.filter((d) => d.status !== "Won").reduce((s, d) => s + d.deniedAmount, 0),
  };

  return (
    <Tabs defaultValue="analyze" className="w-full">
      <div className="sticky top-16 z-10 bg-[#F8FAFC] border-b border-slate-200 px-6 py-2">
        <TabsList className="bg-white border border-slate-200">
          <TabsTrigger value="analyze" className="text-sm">Analyze &amp; Appeal</TabsTrigger>
          <TabsTrigger value="tracker" className="text-sm">
            Tracker
            {denials.length > 0 && (
              <Badge className="ml-2 bg-[#ED7D31] text-white text-xs border-0">{denials.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="analyze" className="p-6">
        {analyzeError && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
            <AlertCircle className="h-4 w-4 shrink-0" /> {analyzeError}
          </div>
        )}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-3 space-y-3">
            <DenialUpload onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} onDemoLoad={handleDemoLoad} isDemoLoading={isDemoLoading} />
            <div className="space-y-2 max-h-[calc(100vh-320px)] overflow-y-auto pr-1">
              {denials.map((d) => (
                <DenialCard key={d.id} denial={d} isSelected={selected?.id === d.id} onClick={() => handleSelectDenial(d)} />
              ))}
            </div>
          </div>
          <div className="col-span-4">
            <DenialViewer denial={selected} isLoading={isAnalyzing} />
          </div>
          <div className="col-span-5">
            <AppealDraft denial={selected} appealLetter={appealLetter} isLoading={isAnalyzing} />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="tracker" className="p-6">
        <DenialTracker denials={denials} stats={stats} onStatusChange={updateStatus} />
      </TabsContent>
    </Tabs>
  );
}
