import {KycStep, KycTier, SessionOverviewResponse} from "@/models/user/kyc";

export function mapKycSteps(steps: SessionOverviewResponse | undefined): KycTier  {
  if (steps === undefined) {
    throw new Error('Steps list is undefined');
  }
  const result = Array<KycStep>();

  steps.steps.forEach(step => {
    result.push({name: step.name, state: step.state});
  });
  return {kycStep: result};
}


