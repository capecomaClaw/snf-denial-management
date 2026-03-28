"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Zap, Loader2, AlertCircle } from "lucide-react";

interface DenialUploadProps {
  onAnalyze: (text: string, meta?: { claimNumber?: string; payer?: string; deniedAmount?: number }) => void;
  isAnalyzing: boolean;
  onDemoLoad: () => void;
  isDemoLoading: boolean;
}

export default function DenialUpload({ onAnalyze, isAnalyzing, onDemoLoad, isDemoLoading }: DenialUploadProps) {
  const [text, setText] = useState("");
  const [claimNumber, setClaimNumber] = useState("");
  const [payer, setPayer] = useState("");
  const [deniedAmount, setDeniedAmount] = useState("");
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("text/") && file.type !== "application/pdf") {
      setError("Please upload a text or PDF file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => setText(e.target?.result as string ?? "");
    reader.readAsText(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleSubmit = () => {
    setError("");
    if (!text.trim()) {
      setError("Please paste denial text or upload a file.");
      return;
    }
    onAnalyze(text, {
      claimNumber: claimNumber || undefined,
      payer: payer || undefined,
      deniedAmount: deniedAmount ? parseFloat(deniedAmount) : undefined,
    });
  };

  return (
    <Card className="border border-slate-200 shadow-sm rounded-xl bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
          <Upload className="h-4 w-4 text-[#00B0F0]" />
          Upload Denial EOB / Remittance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <input className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00B0F0]" placeholder="Claim Number" value={claimNumber} onChange={(e) => setClaimNumber(e.target.value)} />
          <input className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00B0F0]" placeholder="Payer Name" value={payer} onChange={(e) => setPayer(e.target.value)} />
        </div>
        <input className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00B0F0]" placeholder="Denied Amount ($)" type="number" value={deniedAmount} onChange={(e) => setDeniedAmount(e.target.value)} />

        <div
          className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${isDragging ? "border-[#00B0F0] bg-blue-50" : "border-slate-200 hover:border-slate-300"}`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-input")?.click()}
        >
          <Upload className="h-6 w-6 text-slate-400 mx-auto mb-1" />
          <p className="text-xs text-slate-500">Drop EOB file here or click to browse</p>
          <input id="file-input" type="file" accept=".txt,.pdf,.eob" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </div>

        <textarea
          className="w-full text-sm border border-slate-200 rounded-xl p-3 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-[#00B0F0]"
          placeholder="Or paste denial text / EOB content here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {error && (
          <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">
            <AlertCircle className="h-3 w-3 shrink-0" /> {error}
          </div>
        )}

        <div className="flex gap-2">
          <Button className="flex-1 bg-[#1B2052] hover:bg-[#252d6b] text-white text-sm" onClick={handleSubmit} disabled={isAnalyzing}>
            {isAnalyzing ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Analyzing...</> : "Analyze Denial"}
          </Button>
          <Button variant="outline" className="border-[#ED7D31] text-[#ED7D31] hover:bg-orange-50 text-sm" onClick={onDemoLoad} disabled={isDemoLoading}>
            {isDemoLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Zap className="h-4 w-4 mr-1" />Demo</>}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
