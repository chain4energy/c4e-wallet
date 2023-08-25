export interface InitSessionResponse {
  session_id: string
}

export interface KycStatusResponse {
  kycLevel: number,
  kycServiceState: Map<KycStepName, KycProgressStatus>,
}

export enum KycProgressStatus {
  PENDING_VERIFICATION='PENDING_VERIFICATION',
  APPROVED='APPROVED',
  SUBMISSION_REQUIRED='SUBMISSION_REQUIRED',
  RESUBMISSION_REQUIRED='RESUBMISSION_REQUIRED',
  REJECTED='REJECTED',
  RESET='RESET'
}

export enum KycStepName {
  LIVENESS='LIVENESS',
  ID_DOCUMENT='ID_DOCUMENT',
  PHONE='PHONE',
  PROOF_OF_ADDRESS="PROOF_OF_ADDRESS"
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
