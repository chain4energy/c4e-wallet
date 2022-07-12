import { Validator as BcValidator,} from "@/models/blockchain/validator";
import { Validator as StoreValidator, ValidatorCommission, ValidatorDescription, ValidatorStatus} from "@/models/store/validator";

export function mapValidators(validators: BcValidator[] | undefined): StoreValidator[]  {
  if (validators === undefined) {
    throw new Error('Validators list is undefined');
  }
  let result = Array<StoreValidator>();
  validators.forEach(validator => result.push(mapValidator(validator)))
  result = result.sort((a, b) => Number(b.tokens) - Number(a.tokens))
  let i = 1
  result.forEach(val => val.rank = i++)
  return result;
}

export function mapValidator(validator: BcValidator | undefined): StoreValidator  {
  if (validator === undefined) {
      throw new Error('Validator is undefined');
  }

  const status = mapValidatorStatus(validator.status)
  const commission = new ValidatorCommission(validator.commission.commission_rates.rate,
    validator.commission.commission_rates.max_rate,
    validator.commission.commission_rates.max_change_rate);
  const desciption = new ValidatorDescription(validator.description.moniker,
    validator.description.identity,
    validator.description.website,
    validator.description.security_contact,
    validator.description.details);

  return new StoreValidator(validator.operator_address,
    validator.jailed,
    status,
    validator.tokens,
    desciption,
    commission);
}

function mapValidatorStatus(validatorStatus: string | undefined): ValidatorStatus  {
  switch (validatorStatus) {
    case "BOND_STATUS_UNSPECIFIED": {
      return ValidatorStatus.Unspecified;
    }
    case "BOND_STATUS_UNBONDED": {
      return ValidatorStatus.Unbonded;
    }
    case "BOND_STATUS_UNBONDING": {
      return ValidatorStatus.Unbonding;
    }
    case "BOND_STATUS_BONDED": {
      return ValidatorStatus.Bonded;
    }

    default:
      throw new Error(`Unsupported validoator status type: '${validatorStatus}'`);
  }
}

