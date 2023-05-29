export interface InitSessionResponse {
  session_id: string
}

export enum KycStatus {
  VALIDATED='VALIDATED',
  PENDING='PENDING',
  NOT_STARTED='NOT_STARTED'
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
  state: KycStatus,
  name: KycStepName
}

export interface SessionOverviewResponse {
  steps: SessionOverviewStep[]
}

export interface SessionOverviewStep {
  state: KycStatus,
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
  state: KycStatus | undefined
}
