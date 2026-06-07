/**
 * @vertex/auth-pattern - sdl-client.ts
 *
 * Wave 1 client / KYC canonical data contract (Shared Contract CONTRACT_VERSION 1.2.0, S26).
 * Ratified SYNC-1 (hub -> PB). Build-once: SAAS / PB / PMI reuse these enums + shapes (no divergence).
 * KYC status is canonical in PB (KYC_DIVERGENCE_PROHIBITED) - non-PB consumers hold a reference only.
 *
 * Wire format: snake_case (Contract v1.1 §2-bis). Monetary fields = INTEGER minor units (cents), never float.
 */

export const KYC_STATUS = ['NONE', 'PENDING', 'ACTIVE', 'EXPIRED', 'BLOCKED', 'ESCALATED'] as const;
export type KycStatus = (typeof KYC_STATUS)[number];

export const CDD_VERDICT = ['CLEAR', 'EDD_REQUIRED', 'PEP_REVIEW', 'SANCTIONS_HIT', 'BLOCKED'] as const;
export type CddVerdict = (typeof CDD_VERDICT)[number];

export const EIDAS_GRADE = ['SUBSTANTIAL', 'HIGH'] as const;
export type EidasGrade = (typeof EIDAS_GRADE)[number];

export const CLIENT_SEGMENT = ['RETAIL', 'PROFESSIONAL', 'ELIGIBLE_COUNTERPARTY'] as const;
export type ClientSegment = (typeof CLIENT_SEGMENT)[number];

export const RISK_PROFILE = ['CONSERVATIVE', 'MODERATE', 'BALANCED', 'DYNAMIC', 'AGGRESSIVE'] as const;
export type RiskProfile = (typeof RISK_PROFILE)[number];

/** MiFID suitability risk_tolerance 1..5 -> RiskProfile (ratified mapping, SYNC-1). */
export const RISK_TOLERANCE_TO_PROFILE: Record<1 | 2 | 3 | 4 | 5, RiskProfile> = {
  1: 'CONSERVATIVE',
  2: 'MODERATE',
  3: 'BALANCED',
  4: 'DYNAMIC',
  5: 'AGGRESSIVE',
};

export const DATA_CLASS = ['PUBLIC', 'INTERNAL', 'PII', 'SENSITIVE_PII'] as const;
export type DataClass = (typeof DATA_CLASS)[number];

export type KycBasis = 'kyc_processing'; // GDPR Art.6(1)(c) legal obligation

/** Compliance Metadata Block (Contract v1.1 §8). Required on every SENSITIVE_PII record. */
export interface ClientCmb {
  data_class: 'SENSITIVE_PII';
  legal_basis: KycBasis;
  retention_until: string; // ISO8601 = onboarded_at + 10y (KYC/AML, §8.2)
  rls_scope: 'tenant_t1';
  anonymizable: boolean; // GDPR Art.17 via ANONYMIZE event, not physical DELETE (§8.3.1)
  pii_masked_in_logs: boolean;
}

/** client.* snapshot. Uniqueness: (tenant_t1, client_id) latest-only. PB-owned, hub consumes by reference. */
export interface ClientSnapshot {
  schema_version: string; // pin to CONTRACT_VERSION, e.g. '1.2.0'
  client_id: string;
  customer_universal_id: string; // cross-kernel correlation key
  onboarding_id: string;
  tenant_t1: string;
  tenant_t3_pb_owner: string;
  segment: ClientSegment;
  risk_profile: RiskProfile;
  kyc_status: KycStatus; // PB canonical
  identity_verified: boolean;
  eidas_grade: EidasGrade;
  cdd_verdict: CddVerdict;
  initial_aum_estimate_eur: number; // INTEGER minor units (cents)
  is_sandbox: boolean;
  onboarded_at: string; // ISO8601
  last_assessment_ts: string; // ISO8601
  producer_skill: string;
  kyc_basis: KycBasis;
  data_class: 'SENSITIVE_PII';
  cmb: ClientCmb;
}

/** POST /v1/kyc/onboarding/extended - MiFID II step 3 profiling. Gate: agents:invoke (submit). */
export interface KycOnboardingExtendedRequest {
  onboarding_id: string;
  tenant_id: string; // match JWT<->body (§3 gate)
  eidas_grade: EidasGrade;
  profiling: {
    investment_objective: string;
    time_horizon: 'SHORT' | 'MEDIUM' | 'LONG';
    risk_tolerance: 1 | 2 | 3 | 4 | 5;
    knowledge_experience: string;
    financial_situation: {
      income_band: string;
      net_worth_band: string;
      initial_aum_estimate_eur: number; // cents
    };
  };
}

export interface KycOnboardingExtendedResponse {
  onboarding_id: string;
  client_id: string;
  customer_universal_id: string;
  kyc_status: KycStatus;
  cdd_verdict: CddVerdict;
  segment: ClientSegment;
  risk_profile: RiskProfile;
  identity_verified: boolean;
  eidas_grade: EidasGrade;
  last_assessment_ts: string;
  audit_ref: string; // SHA-256 audit chain record (§2/§8)
  data_class: 'SENSITIVE_PII';
}

/** Submit gate for /v1/kyc/onboarding/extended. Escalated CDD verdicts route to human-gate proactive:approve. */
export const KYC_ONBOARDING_EXTENDED_PERMISSION = 'agents:invoke' as const;
