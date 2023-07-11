import {LoginTypeEnum} from "@/store/userService.store";
import {KycProgressStatus, KycStepName} from "@/models/user/kyc";

export interface PasswordAuthenticateRequest {
  login: string,
  password: string
}

export interface CreateAccountRequest {
  contactEmail?: string,
  firstName?: string,
  lastName?: string,
  login: string,
  password: string,
  phone?: string
}

export interface AccountRequest{
  accountType: LoginTypeEnum,
  claimAddress: string,
  ethereumAddress: string,
  kycInfo: KycInfo
  login: string,
  terms: boolean,
}

export interface KycInfo {
  kycLevel: number,
  kycServiceState: Map<KycStepName, KycProgressStatus>,
}
