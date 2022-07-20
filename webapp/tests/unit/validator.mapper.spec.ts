import { mapAndAddValidators, mapValidator, mapValidators, sortAndRankValidators } from "@/models/mapper/validator.mapper";
import { createValidators, defaultValidators, defaultValidatorsParameters, expectValidator, expectValidators, findNumberOfActiveValidators } from "../utils/validator.blockchain.data.util";

const validatorAddress = defaultValidators[0];
const validatorParams = defaultValidatorsParameters[0];

describe('tests mapping of validators related data', () => {

  it('maps undefined validator', async () => {
    expect(() => { mapValidator(undefined) }).toThrowError(new Error(`Validator is undefined`))
  });

  it('maps validator', async () => {
    const bcValidator = createValidators([validatorAddress], [validatorParams])[0];
    const storeValidator = mapValidator(bcValidator);
    expectValidator(storeValidator, bcValidator, 0);
  });

  it('maps undefined validators', async () => {
    expect(() => { mapValidators(undefined) }).toThrowError(new Error(`Validators list is undefined`))
  });

  it('maps validators', async () => {
    const bcValidators = createValidators();
    const storeValidators = mapValidators(bcValidators);

    expectValidators(storeValidators, false);

  });

  it('maps and adds undefined validators', async () => {
    const bcValidators = createValidators();
    const storeValidators = mapValidators(bcValidators);

    expect(() => { mapAndAddValidators(storeValidators.validators, undefined, storeValidators.numberOfActive) }).toThrowError(new Error(`BcValidator list is undefined`))

  });

  it('maps and adds validators', async () => {

    const validators1 = [
      'c4evaloper1psaq0n2lzh84lzgh39kghuy0n256xltlg6yh4a',
      'c4evaloper1zwl9pd5mmn23mze2686494w9c2fyymxaqrhhl5',
      'c4evaloper1r2ennr6ywv567lks3q5gujt4def726fep2hpa8',
    ];
    const params1 = [
      {jailed: false, status: "BOND_STATUS_BONDED", tokens: "113022978544", commission_rate: "0.100000000000000000"},
      {jailed: false, status: "BOND_STATUS_UNBONDED", tokens: "123022978544", commission_rate: "0.110000000000000000"},
      {jailed: false, status: "BOND_STATUS_UNBONDING", tokens: "133022978544", commission_rate: "0.120000000000000000"},
    ];

    const validators2 = [
      'c4evaloper19473sdmlkkvcdh6z3tqedtqsdqj4jjv782dku2',
      'c4evaloper1tavkv9fpqwmw2v9drsm7s3yk7xlll9q8n7e6yl',
      'c4evaloper1e0ddzmhw2ze2glszkgjk6tfvcfzv68cmrg7euh',
    ];
    const params2 = [
      {jailed: true, status: "BOND_STATUS_UNBONDED", tokens: "143022978544", commission_rate: "0.130000000000000000"},
      {jailed: true, status: "BOND_STATUS_UNBONDING", tokens: "153022978544", commission_rate: "0.140000000000000000"},
      {jailed: false, status: "BOND_STATUS_BONDED", tokens: "163022978544", commission_rate: "0.150000000000000000"},
    ];

    const validatorsAll = validators1.concat(validators2)
    const paramsAll = params1.concat(params2)

    let bcValidators = createValidators(validators1, params1);
    let storeValidators = mapValidators(bcValidators);

    bcValidators = createValidators(validators2, params2, 3);
    storeValidators = mapAndAddValidators(storeValidators.validators, bcValidators, storeValidators.numberOfActive);

    expectValidators(storeValidators, false, validatorsAll, paramsAll);

  });

  it('sort and rank validators', async () => {
    const bcValidators = createValidators();
    let storeValidators = mapValidators(bcValidators);
    expectValidators(storeValidators, false);
    storeValidators.validators = sortAndRankValidators(storeValidators.validators)
    expectValidators(storeValidators);
  });

});