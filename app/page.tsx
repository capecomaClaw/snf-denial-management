import DenialApp from "@/components/DenialApp";
import { Building2 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Sticky Header */}
      <header className="sticky top-0 z-20 bg-[#1B2052] border-b border-[#252d6b] shadow-md">
        <div className="max-w-screen-xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#ED7D31] rounded-lg p-1.5">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-white font-bold text-base tracking-tight">SNF Denial Agent</span>
              <span className="text-[#00B0F0] text-xs ml-2">by HorizonCare AI</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-400">Medicare · Medicaid · Private Payers</span>
            <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" title="AI Ready" />
          </div>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto">
        <DenialApp />
      </main>
    </div>
  );
}
