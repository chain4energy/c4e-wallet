import { Validator as BcValidator,} from "@/models/blockchain/validator";
import { Validator as StoreValidator, ValidatorCommission, ValidatorDescription, ValidatorStatus} from "@/models/store/validator";
import {ValidatorDescriptionResponse} from "@/models/hasura/validatorDescriptionResponse";

export function mapValidators(validators: BcValidator[] | undefined): { validators: StoreValidator[], numberOfActive: number}  {
  if (validators === undefined) {
    throw new Error('Validators list is undefined');
  }
  const result = Array<StoreValidator>();
  const active = mapAndAddValidatorsToArray(result, validators);

  return { validators: result, numberOfActive: active};
}

export function mapAndAddValidators(validatorsDst: StoreValidator[], bcValidators: BcValidator[] | undefined, numberOfActive: number): { validators: StoreValidator[], numberOfActive: number}  {
  if (bcValidators === undefined) {
    throw new Error('BcValidator list is undefined');
  }
  const active = numberOfActive + mapAndAddValidatorsToArray(validatorsDst, bcValidators);
  return { validators: validatorsDst, numberOfActive: active};
}

function mapAndAddValidatorsToArray(array: StoreValidator[], bcValidators: BcValidator[]): number  {
  let active = 0;
  bcValidators.forEach(validator => {
    const mapped = mapValidator(validator);
    array.push(mapped);
    if (mapped.status === ValidatorStatus.Bonded) {
      active++;
    }
  });
  return active;
}

export function sortAndRankValidators(array: StoreValidator[]): StoreValidator[]  {
  array.sort((a, b) => b.tokens - a.tokens < 0n ? -1 : b.tokens - a.tokens === 0n ? 0 : 1);
  let i = 1;
  array.forEach(val => val.rank = i++);
  return array;
}

export function mapValidator(validator: BcValidator | undefined): StoreValidator  {
  if (validator === undefined) {
      throw new Error('Validator is undefined');
  }

  const status = mapValidatorStatus(validator.status);
  const commission = new ValidatorCommission(Number(validator.commission.commission_rates.rate),
    Number(validator.commission.commission_rates.max_rate),
    Number(validator.commission.commission_rates.max_change_rate));
  const desciption = new ValidatorDescription(
    validator.description.moniker,
    validator.description.identity,
    validator.description.website,
    validator.description.security_contact,
    validator.description.details);

  return new StoreValidator(validator.operator_address,
    validator.jailed,
    status,
    BigInt(validator.tokens),
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

export function mapValidatorDescription(hasuraData: ValidatorDescriptionResponse | undefined):Map<string, string> {
  if (hasuraData === undefined) {
    throw new Error('mapValidatorDescription - ValidatorDescription response is undefined');
  }
  if (hasuraData.data === undefined) {
    throw new Error('mapValidatorDescription - ValidatorDescription.data is undefined');
  }
  if (hasuraData.data.validator === undefined) {
    throw new Error('mapValidatorDescription - ValidatorDescription.data.validator is undefined');
  }
  const retValue = new Map<string, string>();
  hasuraData.data.validator.forEach(object => {
    if (!object.validator_infos || object.validator_infos.length == 0) {
      console.warn('mapValidatorDescription - ValidatorDescription.data.validator.validator_infos is undefined:' + JSON.stringify(object));
    } else if (!object.validator_infos[0].operator_address) {
      console.warn('mapValidatorDescription - ValidatorDescription.data.validator.validator_infos[0].operator_address is undefined'+ JSON.stringify(object));
    } else if (!object.validator_descriptions || object.validator_descriptions.length == 0) {
      console.warn('mapValidatorDescription - ValidatorDescription.data.validator.validator_descriptions is undefined'+ JSON.stringify(object));
    } else if (!object.validator_descriptions[0].avatar_url) {
      console.warn('mapValidatorDescription - ValidatorDescription.data.validator.validator_descriptions[0].avatar_url is undefined'+ JSON.stringify(object));
    } else {
      retValue.set(object.validator_infos[0].operator_address, object.validator_descriptions[0].avatar_url);
    }
  });
  return retValue;
}
