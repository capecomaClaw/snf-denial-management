/**
 * SNF Denial Management Agent — Core Type Definitions
 * All interfaces used across the application are documented here.
 */

/** Root cause categories for claim denials */
export type DenialCategory =
  | "Medical necessity"
  | "Missing documentation"
  | "Coding error"
  | "Prior auth required"
  | "Duplicate claim"
  | "Timely filing"
  | "Eligibility issue"
  | "Coordination of benefits";

/** Appeal viability assessment */
export type AppealViability = "High" | "Medium" | "Low";

/** Denial workflow status */
export type DenialStatus = "New" | "In Appeal" | "Won" | "Lost";

/** Payer type — determines deadline calculation */
export type PayerType = "Medicare" | "Medicaid" | "Private";

/** CARC/RARC code with decoded meaning */
export interface DenialCode {
  code: string;
  type: "CARC" | "RARC";
  description: string;
  category: DenialCategory;
}

/** Structured output from Claude's denial analysis */
export interface DenialAnalysis {
  rootCause: DenialCategory;
  codes: DenialCode[];
  appealViability: AppealViability;
  appealReason: string;
  requiredDocumentation: string[];
  deadlineDays: number;
  summary: string;
}

/** Full denial record, persisted in tracker */
export interface DenialRecord {
  id: string;
  patientName: string;
  claimNumber: string;
  payer: string;
  payerType: PayerType;
  serviceDate: string;
  denialDate: string;
  deniedAmount: number;
  status: DenialStatus;
  analysis: DenialAnalysis | null;
  appealLetter: string | null;
  rawText: string;
  createdAt: string;
}

/** Summary stats for the tracker dashboard */
export interface TrackerStats {
  total: number;
  inAppeal: number;
  won: number;
  lost: number;
  winRate: number;
  revenueAtRisk: number;
}

/** API request body for /api/analyze */
export interface AnalyzeRequest {
  rawText: string;
  claimNumber?: string;
  payer?: string;
  payerType?: PayerType;
  denialDate?: string;
  deniedAmount?: number;
}

/** API response from /api/analyze */
export interface AnalyzeResponse {
  analysis: DenialAnalysis;
  appealLetter: string;
}

/** Demo denial record (pre-populated, no upload needed) */
export interface DemoScenario {
  id: string;
  label: string;
  denial: Omit<DenialRecord, "analysis" | "appealLetter">;
}
