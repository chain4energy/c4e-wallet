import { UnbondingDelegationEntry } from "@/models/store/staking";
import { Validator } from "@/models/store/validator";
import { useUserStore } from "@/store/user.store";
import { useValidatorsStore } from "@/store/validators.store";

export enum ValidatorsDataTableType {
  VALIDATORS = 'validators',
  DELEGATIONS = 'delegations',
  UNDELEGATIONS = 'undelegations',
}

export class ValidatorUnstaking {

  validator: Validator;
  entry: UnbondingDelegationEntry;

  constructor(validator: Validator, entry: UnbondingDelegationEntry) {
    this.validator = validator;
    this.entry = entry;

  }

  public get description() {
    return this.validator.description;
  }

  public get undelegatingViewAmount() {
    return this.validator.undelegatingViewAmount;
  }
}

export function getUnstakings(validators: Validator[]) {
  const validatorUnstakings = new Array<ValidatorUnstaking>()
  const undelegations = useUserStore().getUndelegations.undelegations;
  validators.forEach((v) => {
    if (undelegations.has(v.operatorAddress)) {
      const undel = undelegations.get(v.operatorAddress);
      undel?.entries.forEach((e) => {
        validatorUnstakings.push(new ValidatorUnstaking(v, e));
      })
    }
  })
  return validatorUnstakings;
}