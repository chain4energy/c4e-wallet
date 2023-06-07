export interface InitSessionResponse {
  session_id: string
}

export interface KycStatusResponse {
  kycLevel: number
}

export enum KycProgressStatus {
  VALIDATED='VALIDATED',
  PENDING='PENDING',
}

export enum KycStepName {
  LIVENESS='LIVENESS',
  IDENTITY='IDENTITY',
  PHONE='PHONE'
}

export interface KycTier {
  kycStep: KycStep[]
}
export interface KycStep {
  state: KycProgressStatus,
  name: KycStepName
}

export interface SessionOverviewResponse {
  steps: SessionOverviewStep[]
}

export interface SessionOverviewStep {
  state: KycProgressStatus,
  name: KycStepName
}
export enum KycTierEnum {
  TIER_0,
  TIER_1,
  TIER_2,
  TIER_3
}
export interface KycStepInfo {
  name: KycStepName,
  state: KycProgressStatus | undefined
}
