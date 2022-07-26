import { Validator, ValidatorStatus } from "@/models/store/validator";

export const defaultValidators = [
  'c4evaloper1psaq0n2lzh84lzgh39kghuy0n256xltlg6yh4a',
  'c4evaloper1zwl9pd5mmn23mze2686494w9c2fyymxaqrhhl5',
  'c4evaloper1r2ennr6ywv567lks3q5gujt4def726fep2hpa8',
  'c4evaloper19473sdmlkkvcdh6z3tqedtqsdqj4jjv782dku2',
  'c4evaloper1tavkv9fpqwmw2v9drsm7s3yk7xlll9q8n7e6yl',
  'c4evaloper1e0ddzmhw2ze2glszkgjk6tfvcfzv68cmrg7euh',
];
export const defaultValidatorsParameters = [
  { jailed: false, status: "BOND_STATUS_BONDED", tokens: "113022978544", commission_rate: "0.100000000000000000" },
  { jailed: false, status: "BOND_STATUS_UNBONDED", tokens: "123022978544", commission_rate: "0.110000000000000000" },
  { jailed: false, status: "BOND_STATUS_UNBONDING", tokens: "133022978544", commission_rate: "0.120000000000000000" },
  { jailed: true, status: "BOND_STATUS_UNBONDED", tokens: "143022978544", commission_rate: "0.130000000000000000" },
  { jailed: true, status: "BOND_STATUS_UNBONDING", tokens: "153022978544", commission_rate: "0.140000000000000000" },
  { jailed: false, status: "BOND_STATUS_UNSPECIFIED", tokens: "163022978544", commission_rate: "0.150000000000000000" },
];

export function findValidatorParametersByValidator(validatorAddress: string,
  validators = defaultValidators,
  validatorsParameters = defaultValidatorsParameters) {
  if (validators.length !== validatorsParameters.length) {
    throw new Error('validators.length !== validatorsParameters.length');
  }
  for (let i = 0; i < validators.length; i++) {
    if (validators[i] === validatorAddress) {
      return validatorsParameters[i];
    }
  }
  return new Error('Validator : ' + validatorAddress + ' not found');
}

export function findNumberOfActiveValidators(validatorsParameters = defaultValidatorsParameters) {
  let active = 0;
  validatorsParameters.forEach(params => {
    if (params.status === 'BOND_STATUS_BONDED') {
      active++;
    }
  });
  return active;
}

export function createValidatorsResponseData(validators = defaultValidators,
  validatorsParameters = defaultValidatorsParameters,
  positionOffset = 0,
  total: number | undefined = undefined,
  nextKey: string | null = null) {
  return {
    validators: createValidators(validators, validatorsParameters, positionOffset),
    pagination: {
      next_key: nextKey,
      total: total === undefined ? validators.length : total
    }
  }
}

export function expectValidator(actualValidator: Validator, expectedBcValidator: any, expectedRank: number) {
  expect(actualValidator.operatorAddress).toBe(expectedBcValidator.operator_address);
  expect(actualValidator.jailed).toBe(expectedBcValidator.jailed);
  expect(actualValidator.status).toBe(getValidatorStatus(expectedBcValidator.status));
  expect(actualValidator.tokens).toBe(BigInt(expectedBcValidator.tokens));
  expect(actualValidator.description.moniker).toBe(expectedBcValidator.description.moniker);
  expect(actualValidator.description.identity).toBe(expectedBcValidator.description.identity);
  expect(actualValidator.description.website).toBe(expectedBcValidator.description.website);
  expect(actualValidator.description.securityContact).toBe(expectedBcValidator.description.security_contact);
  expect(actualValidator.description.details).toBe(expectedBcValidator.description.details);
  expect(actualValidator.commission.rate).toBe(Number(expectedBcValidator.commission.commission_rates.rate));
  expect(actualValidator.commission.maxRate).toBe(Number(expectedBcValidator.commission.commission_rates.max_rate));
  expect(actualValidator.commission.maxChangeRate).toBe(Number(expectedBcValidator.commission.commission_rates.max_change_rate));
  expect(actualValidator.rank).toBe(expectedRank);
}

export function expectValidators(validatorsData: { validators: Validator[], numberOfActive: number } | undefined,
  sortedAndRanked = true,
  expectedValidators = defaultValidators,
  expectedValidatorsParameters = defaultValidatorsParameters) {

  let expectedValidatorsData = createValidators(expectedValidators, expectedValidatorsParameters);
  if (sortedAndRanked) {
    expectedValidatorsData = expectedValidatorsData.sort(((a, b) => Number(b.tokens) - Number(a.tokens)));
  }
  expect(validatorsData).not.toBeUndefined();
  expect(validatorsData?.validators.length).toBe(expectedValidators.length);
  expect(validatorsData?.numberOfActive).toBe(findNumberOfActiveValidators(expectedValidatorsParameters));
  if (validatorsData !== undefined) {
    for (let i = 0; i < expectedValidators.length; i++) {
      const rank = sortedAndRanked ? i + 1 : 0;
      expectValidator(validatorsData?.validators[i], expectedValidatorsData[i], rank);
    }
  }
}

export function expectEmptyValidators(validatorsData: { validators: Validator[], numberOfActive: number } | undefined) {
  expect(validatorsData).not.toBeUndefined();
  expect(validatorsData?.validators.length).toBe(0);
  expect(validatorsData?.numberOfActive).toBe(0);
}

function getValidatorStatus(validatorStatus: string | undefined): ValidatorStatus {
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

export function createValidators(validators = defaultValidators,
  validatorsParameters = defaultValidatorsParameters, positionOffset = 0) {
  if (validators.length !== validatorsParameters.length) {
    throw new Error('validators.length !== validatorsParameters.length')
  }
  const validatorsArray = new Array();
  for (let i = 0; i < validators.length; i++) {
    const position = i + positionOffset;
    validatorsArray.push({
      operator_address: validators[i],
      consensus_pubkey: {
        "@type": "/cosmos.crypto.ed25519.PubKey",
        key: "d8LmF46U2/1Dq6PLvAAOHt747NqBrQoSjUPkxxDzw98="
      },
      jailed: validatorsParameters[i].jailed,
      status: validatorsParameters[i].status,
      tokens: validatorsParameters[i].tokens,
      delegator_shares: validatorsParameters[i].tokens + ".000000000000000000",
      description: {
        moniker: "Moniker " + position,
        identity: "Identity " + position,
        website: "Website " + position,
        security_contact: "SecContact " + position,
        details: "Setails " + position
      },
      unbonding_height: "123",
      unbonding_time: "1970-01-01T00:00:00Z",
      commission: {
        commission_rates: {
          rate: validatorsParameters[i].commission_rate,
          max_rate: "0.400000000000000000",
          max_change_rate: "0.010000000000000000"
        },
        update_time: "2022-05-27T08:10:48.208686026Z"
      },
      min_self_delegation: "1"
    })
  }
  return validatorsArray;
}

