/**
 * Appeal letter templates by denial root cause category.
 * Each template returns a fully-formatted appeal letter string.
 */

import type { DenialRecord, DenialAnalysis } from "./types";

export interface TemplateContext {
  record: DenialRecord;
  analysis: DenialAnalysis;
}

function header({ record }: TemplateContext): string {
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  return `Date: ${today}\n\n${record.payer}\nAppeals Department\n\nRE: Appeal of Denied Claim\nClaim Number: ${record.claimNumber}\nPatient: ${record.patientName}\nDate of Service: ${record.serviceDate}\nDenied Amount: $${record.deniedAmount.toLocaleString()}\n\nTo Whom It May Concern:\n`;
}

const FOOTER = `\nWe request that you reconsider this denial and issue payment for the services rendered.\nPlease contact our billing department if additional information is required.\n\nSincerely,\n\nBilling & Appeals Department\n[Facility Name] | [Address] | [Phone] | [Email]`;

function docList(docs: string[]): string {
  return docs.map((d) => `  • ${d}`).join("\n");
}

export const APPEAL_TEMPLATES: Record<string, (ctx: TemplateContext) => string> = {
  "Medical necessity": (ctx) =>
    `${header(ctx)}\nWe are appealing the denial of the above claim on grounds of medical necessity.\n\nThe services provided were clinically appropriate and required skilled nursing facility level of care. Supporting evidence includes:\n\n${docList(ctx.analysis.requiredDocumentation)}\n\nApplicable codes: ${ctx.analysis.codes.map((c) => `${c.type} ${c.code}`).join(", ")}\n${FOOTER}`,

  "Missing documentation": (ctx) =>
    `${header(ctx)}\nWe are appealing the denial due to missing documentation. The following documents are enclosed:\n\n${docList(ctx.analysis.requiredDocumentation)}\n\nThese records substantiate the medical necessity and appropriateness of services provided. We request reprocessing with the enclosed materials.\n${FOOTER}`,

  "Coding error": (ctx) =>
    `${header(ctx)}\nWe are appealing the denial due to a coding discrepancy. Upon review, we identified a coding error on the original submission and are resubmitting with corrected codes.\n\nOriginal denial codes: ${ctx.analysis.codes.map((c) => `${c.type} ${c.code}`).join(", ")}\n\nCorrected billing information is enclosed. Please reprocess this claim.\n${FOOTER}`,

  "Prior auth required": (ctx) =>
    `${header(ctx)}\nWe are appealing the denial related to prior authorization. The services required immediate initiation of skilled nursing care. We request a retroactive authorization review based on clinical urgency.\n\nSupporting documentation enclosed: ${ctx.analysis.requiredDocumentation.join(", ")}.\n${FOOTER}`,

  "Timely filing": (ctx) =>
    `${header(ctx)}\nWe are appealing the denial based on timely filing. The claim was submitted within the required filing period. Enclosed is documentation confirming the original submission date and clearinghouse confirmation.\n\nIf the original submission was not received, circumstances beyond our control prevented timely filing. We request a waiver based on the enclosed evidence.\n${FOOTER}`,

  "Eligibility issue": (ctx) =>
    `${header(ctx)}\nWe are appealing the denial related to patient eligibility. At the time of service, we verified the patient's eligibility and coverage. Enclosed is a copy of the eligibility verification confirming active coverage on the date(s) of service.\n\nWe request that this claim be reprocessed based on the enclosed verification.\n${FOOTER}`,

  "Duplicate claim": (ctx) =>
    `${header(ctx)}\nWe are appealing the denial as a duplicate claim. The claim identified as a duplicate represents distinct services not previously billed or paid. Enclosed is documentation distinguishing this claim from any previously processed claims.\n${FOOTER}`,

  "Coordination of benefits": (ctx) =>
    `${header(ctx)}\nWe are appealing the denial related to coordination of benefits. Enclosed is the primary payer's EOB confirming your plan's secondary payer responsibility.\n\nPlease reprocess this claim as secondary payer based on the enclosed primary payer determination.\n${FOOTER}`,
};

export function getTemplate(category: string): ((ctx: TemplateContext) => string) | undefined {
  return APPEAL_TEMPLATES[category];
}
