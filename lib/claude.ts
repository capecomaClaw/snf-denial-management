/**
 * Claude API integration for SNF denial analysis.
 * Single responsibility: call Claude and parse structured denial analysis.
 */

import Anthropic from "@anthropic-ai/sdk";
import type { DenialAnalysis, DenialCategory, AppealViability } from "./types";
import { DENIAL_CODES } from "./denialCodes";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are an expert SNF (Skilled Nursing Facility) billing and appeals specialist with deep knowledge of Medicare, Medicaid, and commercial payer denial management.

Analyze the provided denial EOB/remittance text and return a JSON object with this exact structure:
{
  "rootCause": one of ["Medical necessity", "Missing documentation", "Coding error", "Prior auth required", "Duplicate claim", "Timely filing", "Eligibility issue", "Coordination of benefits"],
  "codes": [{ "code": "50", "type": "CARC", "description": "...", "category": "..." }],
  "appealViability": one of ["High", "Medium", "Low"],
  "appealReason": "one-sentence reason for viability rating",
  "requiredDocumentation": ["list", "of", "documents", "needed"],
  "deadlineDays": 120,
  "summary": "2-3 sentence plain English summary of the denial and recommended action"
}

Rules:
- deadlineDays: 120 for Medicare, 90 for Medicaid, 180 for private payers
- Appeal viability: High if documentation can be gathered, Medium if clinical judgment needed, Low if policy exclusion
- Extract actual CARC/RARC codes from the text when present
- Return ONLY valid JSON, no markdown or explanation`;

export async function analyzeDenial(rawText: string, payerType?: string): Promise<DenialAnalysis> {
  const userMessage = `Analyze this SNF claim denial:\n\n${rawText}\n\nPayer type: ${payerType || "Unknown"}`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userMessage }],
  });

  const content = response.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type from Claude");

  const parsed = JSON.parse(content.text) as {
    rootCause: DenialCategory;
    codes: Array<{ code: string; type: "CARC" | "RARC"; description: string; category: string }>;
    appealViability: AppealViability;
    appealReason: string;
    requiredDocumentation: string[];
    deadlineDays: number;
    summary: string;
  };

  // Enrich codes with our local lookup where possible
  const enrichedCodes = parsed.codes.map((c) => {
    const known = DENIAL_CODES.find((d) => d.code === c.code && d.type === c.type);
    return known ?? { code: c.code, type: c.type, description: c.description, category: parsed.rootCause };
  });

  return {
    rootCause: parsed.rootCause,
    codes: enrichedCodes,
    appealViability: parsed.appealViability,
    appealReason: parsed.appealReason,
    requiredDocumentation: parsed.requiredDocumentation,
    deadlineDays: parsed.deadlineDays,
    summary: parsed.summary,
  };
}
