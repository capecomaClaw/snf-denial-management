/**
 * CARC (Claim Adjustment Reason Codes) and RARC (Remittance Advice Remark Codes)
 * Most common codes seen in SNF claim denials.
 */

import type { DenialCode } from "./types";

export const DENIAL_CODES: DenialCode[] = [
  // Medical Necessity
  { code: "50", type: "CARC", description: "These are non-covered services because this is not deemed a medical necessity by the payer.", category: "Medical necessity" },
  { code: "B22", type: "RARC", description: "This payment is adjusted based on the diagnosis.", category: "Medical necessity" },
  { code: "M15", type: "RARC", description: "Separately billed services/tests have been bundled as they are considered components of the same procedure.", category: "Medical necessity" },

  // Missing Documentation
  { code: "16", type: "CARC", description: "Claim/service lacks information or has submission/billing error(s).", category: "Missing documentation" },
  { code: "M76", type: "RARC", description: "Missing/incomplete/invalid diagnosis or condition.", category: "Missing documentation" },
  { code: "N30", type: "RARC", description: "Patient ineligible for this service.", category: "Missing documentation" },
  { code: "252", type: "CARC", description: "An attachment/other document is required to adjudicate this claim/service.", category: "Missing documentation" },

  // Coding Errors
  { code: "4", type: "CARC", description: "The service/equipment/drug is not covered under this benefit category.", category: "Coding error" },
  { code: "B7", type: "RARC", description: "This provider was not certified/eligible to be paid for this procedure/service on this date of service.", category: "Coding error" },
  { code: "M20", type: "RARC", description: "Missing/incomplete/invalid HCPCS/CPT code.", category: "Coding error" },

  // Prior Authorization
  { code: "15", type: "CARC", description: "Payment adjusted because the submitted authorization number is missing, invalid, or does not apply to the billed services or provider.", category: "Prior auth required" },
  { code: "197", type: "CARC", description: "Precertification/authorization/notification absent.", category: "Prior auth required" },
  { code: "N527", type: "RARC", description: "A referral was not obtained or was not valid.", category: "Prior auth required" },

  // Duplicate Claim
  { code: "18", type: "CARC", description: "Exact duplicate claim/service (use only with Group Code OA except where state workers' compensation regulations require CO).", category: "Duplicate claim" },
  { code: "119", type: "CARC", description: "Benefit maximum for this time period or occurrence has been reached.", category: "Duplicate claim" },

  // Timely Filing
  { code: "29", type: "CARC", description: "The time limit for filing has expired.", category: "Timely filing" },
  { code: "M86", type: "RARC", description: "Service denied because payment already made for same/similar procedure within set time frame.", category: "Timely filing" },

  // Eligibility
  { code: "27", type: "CARC", description: "Expenses incurred after coverage terminated.", category: "Eligibility issue" },
  { code: "31", type: "CARC", description: "Patient cannot be identified as our insured.", category: "Eligibility issue" },
  { code: "96", type: "CARC", description: "Non-covered charge(s).", category: "Eligibility issue" },

  // Coordination of Benefits
  { code: "22", type: "CARC", description: "This care may be covered by another payer per coordination of benefits.", category: "Coordination of benefits" },
  { code: "23", type: "CARC", description: "The impact of prior payer(s) adjudication including payments and/or adjustments.", category: "Coordination of benefits" },
];

export function findCode(code: string): DenialCode | undefined {
  return DENIAL_CODES.find((c) => c.code === code);
}

export function getCodesByCategory(category: string): DenialCode[] {
  return DENIAL_CODES.filter((c) => c.category === category);
}
