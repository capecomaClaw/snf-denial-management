/**
 * POST /api/analyze
 * Accepts denial text, calls Claude, returns analysis + appeal letter.
 */

import { NextRequest, NextResponse } from "next/server";
import { analyzeDenial } from "@/lib/claude";
import { getTemplate } from "@/lib/appealTemplates";
import type { AnalyzeRequest, AnalyzeResponse, DenialRecord } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body: AnalyzeRequest = await req.json();

    if (!body.rawText || body.rawText.trim().length < 10) {
      return NextResponse.json({ error: "rawText is required and must be meaningful." }, { status: 400 });
    }

    const analysis = await analyzeDenial(body.rawText, body.payerType);

    // Build a minimal record for template rendering
    const record: DenialRecord = {
      id: crypto.randomUUID(),
      patientName: "Patient",
      claimNumber: body.claimNumber ?? "Unknown",
      payer: body.payer ?? "Unknown Payer",
      payerType: body.payerType ?? "Medicare",
      serviceDate: new Date().toLocaleDateString(),
      denialDate: body.denialDate ?? new Date().toLocaleDateString(),
      deniedAmount: body.deniedAmount ?? 0,
      status: "New",
      analysis,
      appealLetter: null,
      rawText: body.rawText,
      createdAt: new Date().toISOString(),
    };

    const templateFn = getTemplate(analysis.rootCause);
    const appealLetter = templateFn
      ? templateFn({ record, analysis })
      : `Appeal letter for ${analysis.rootCause} denial — please contact your billing department.`;

    const response: AnalyzeResponse = { analysis, appealLetter };
    return NextResponse.json(response);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/analyze]", message);
    return NextResponse.json({ error: `Analysis failed: ${message}` }, { status: 500 });
  }
}
