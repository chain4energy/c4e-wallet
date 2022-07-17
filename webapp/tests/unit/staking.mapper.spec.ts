import { createDelegatorDelegations, createDelegatorUnbondingDelegations, defaultDelegatorDelegationsValidators, defaultDelegatorUnbondingDelegationsValidators, defaultDenom, findDelegatorDelegationAmountByValidator, findDelegatorDelegationTotalAmount, findDelegatorUnbondingDelegationAmountByValidator, findDelegatorUnbondingDelegationTotalAmount } from '../utils/blockchain.data.util';
import { mapAndAddDelegations, mapAndAddUnbondingDelegations, mapDelegation, mapDelegations, mapUnbondingDelegation, mapUnbondingDelegations } from "@/models/mapper/staking.mapper";

const address = 'c4e13zg4u07ymq83uq73t2cq3dj54jj37zzgqfwjpg';
const validatorAddress = defaultDelegatorDelegationsValidators[0];

describe('tests mapping of staking related data', () => {

  it('maps undefined delegation', async () => {
    expect(() => { mapDelegation(undefined) }).toThrowError(new Error(`Delegation is undefined`))
  });

  it('maps delegation', async () => {
    const amount = '123456';
    const bcDelegation = createDelegatorDelegations(address, [validatorAddress], [amount])[0];
    const storeDelegations = mapDelegation(bcDelegation);

    expect(storeDelegations.amount).toBe(amount);
    expect(storeDelegations.validatorAddress).toBe(validatorAddress);

  });

  it('maps undefined delegations', async () => {
    expect(() => { mapDelegations(undefined) }).toThrowError(new Error(`Delegations list is undefined`))
  });

  it('maps delegations', async () => {
    const bcDelegations = createDelegatorDelegations(address);
    const storeDelegations = mapDelegations(bcDelegations);

    expect(storeDelegations.delegations.size).toBe(defaultDelegatorDelegationsValidators.length);
    expect(storeDelegations.totalDelegated).toBe(findDelegatorDelegationTotalAmount());
    defaultDelegatorDelegationsValidators.forEach(validatorAddress => {
      const delegation = storeDelegations.delegations.get(validatorAddress);
      expect(delegation?.amount).toBe(findDelegatorDelegationAmountByValidator(validatorAddress));
      expect(delegation?.validatorAddress).toBe(validatorAddress);
    });
  });

  it('maps and adds undefined delegations', async () => {
    const bcDelegations = createDelegatorDelegations(address);
    const storeDelegations = mapDelegations(bcDelegations);

    expect(() => { mapAndAddDelegations(storeDelegations, undefined) }).toThrowError(new Error(`BcDelegations list is undefined`))

  });

  it('maps and adds delegations', async () => {

    const validators1 = [
      'c4evaloper1psaq0n2lzh84lzgh39kghuy0n256xltlg6yh4a',
      'c4evaloper1zwl9pd5mmn23mze2686494w9c2fyymxaqrhhl5',
      'c4evaloper1r2ennr6ywv567lks3q5gujt4def726fep2hpa8',
    ];
    const balances1 = [
      '100011000000',
      '98012949002',
      '100013000000',
    ];

    const validators2 = [
      'c4evaloper19473sdmlkkvcdh6z3tqedtqsdqj4jjv782dku2',
      'c4evaloper1tavkv9fpqwmw2v9drsm7s3yk7xlll9q8n7e6yl',
      'c4evaloper1e0ddzmhw2ze2glszkgjk6tfvcfzv68cmrg7euh',
    ];
    const balances2 = [
      '100014000000',
      '100015000000',
      '100016000000',
    ];

    const validatorsAll = validators1.concat(validators2)
    const balancesAll = balances1.concat(balances2)

    let bcDelegations = createDelegatorDelegations(address, validators1, balances1);
    let storeDelegations = mapDelegations(bcDelegations);

    bcDelegations = createDelegatorDelegations(address, validators2, balances2);
    storeDelegations = mapAndAddDelegations(storeDelegations, bcDelegations);

    expect(storeDelegations.delegations.size).toBe(validatorsAll.length);
    expect(storeDelegations.totalDelegated).toBe(findDelegatorDelegationTotalAmount(balancesAll));
    validatorsAll.forEach(validatorAddress => {
      const delegation = storeDelegations.delegations.get(validatorAddress);
      expect(delegation?.amount).toBe(findDelegatorDelegationAmountByValidator(validatorAddress, validatorsAll, balancesAll));
      expect(delegation?.validatorAddress).toBe(validatorAddress);
    });

  });





  it('maps undefined unbonding delegation', async () => {
    expect(() => { mapUnbondingDelegation(undefined) }).toThrowError(new Error(`Unbondig Delegation is undefined`))
  });

  it('maps unbonding delegation', async () => {
    const amount1 = '123456';
    const amount2 = '207896';
    const entries = [amount1, amount2];
    const bcUndelegation = createDelegatorUnbondingDelegations(address, [validatorAddress], [entries])[0];
    const storeUndelegations = mapUnbondingDelegation(bcUndelegation);
    expect(storeUndelegations.entries.length).toBe(entries.length);

    for (let i = 0; i < entries.length; i++) {
      expect(storeUndelegations.entries[i].amount).toBe(entries[i]);
    }
    expect(storeUndelegations.validatorAddress).toBe(validatorAddress);

  });

  it('maps undefined unbonding delegations', async () => {
    expect(() => { mapUnbondingDelegations(undefined) }).toThrowError(new Error(`Unbonding Delegations list is undefined`))
  });

  it('maps unbonding delegations', async () => {
    const bcUndelegations = createDelegatorUnbondingDelegations(address);
    const storeUndelegations = mapUnbondingDelegations(bcUndelegations);

    expect(storeUndelegations.undelegations.size).toBe(defaultDelegatorUnbondingDelegationsValidators.length);
    expect(storeUndelegations.totalUndelegating).toBe(findDelegatorUnbondingDelegationTotalAmount());
    defaultDelegatorUnbondingDelegationsValidators.forEach(validatorAddress => {
      const undelegation = storeUndelegations.undelegations.get(validatorAddress);
      const validatorExpecedEntries = findDelegatorUnbondingDelegationAmountByValidator(validatorAddress);
      expect(undelegation?.entries.length).toBe(validatorExpecedEntries.length);
      for (let i = 0; i < validatorExpecedEntries.length; i++) {
        expect(undelegation?.entries[i].amount).toBe(validatorExpecedEntries[i]);

      }
      expect(undelegation?.validatorAddress).toBe(validatorAddress);
    });


  });

  it('maps and adds undefined unbonding delegations', async () => {
    const bcDelegations = createDelegatorDelegations(address);
    const storeDelegations = mapDelegations(bcDelegations);

    expect(() => { mapAndAddDelegations(storeDelegations, undefined) }).toThrowError(new Error(`BcDelegations list is undefined`))

  });

  it('maps and adds unbonding delegations', async () => {

    const validators1 = [
      'c4evaloper1psaq0n2lzh84lzgh39kghuy0n256xltlg6yh4a',
      'c4evaloper1zwl9pd5mmn23mze2686494w9c2fyymxaqrhhl5',
      'c4evaloper1r2ennr6ywv567lks3q5gujt4def726fep2hpa8',
    ];
    const entries1 = [
      ['100011000000', '12312434'],
      ['98012949002', '356345'],
      ['100013000000', '345534'],
    ];

    const validators2 = [
      'c4evaloper19473sdmlkkvcdh6z3tqedtqsdqj4jjv782dku2',
      'c4evaloper1tavkv9fpqwmw2v9drsm7s3yk7xlll9q8n7e6yl',
      'c4evaloper1e0ddzmhw2ze2glszkgjk6tfvcfzv68cmrg7euh',
    ];
    const entries2 = [
      ['100014000000', '657765'],
      ['100015000000', '21234'],
      ['100016000000', '75632'],
    ];

    const validatorsAll = validators1.concat(validators2)
    const entiresAll = entries1.concat(entries2)

    let bcUndelegations = createDelegatorUnbondingDelegations(address, validators1, entries1);
    let storeUndelegations = mapUnbondingDelegations(bcUndelegations);

    bcUndelegations = createDelegatorUnbondingDelegations(address, validators2, entries2);
    storeUndelegations = mapAndAddUnbondingDelegations(storeUndelegations, bcUndelegations);

    expect(storeUndelegations.undelegations.size).toBe(validatorsAll.length);
    expect(storeUndelegations.totalUndelegating).toBe(findDelegatorUnbondingDelegationTotalAmount(entiresAll));
    defaultDelegatorUnbondingDelegationsValidators.forEach(validatorAddress => {
      const undelegation = storeUndelegations.undelegations.get(validatorAddress);
      const validatorExpecedEntries = findDelegatorUnbondingDelegationAmountByValidator(validatorAddress, validatorsAll, entiresAll);
      expect(undelegation?.entries.length).toBe(validatorExpecedEntries.length);
      for (let i = 0; i < validatorExpecedEntries.length; i++) {
        expect(undelegation?.entries[i].amount).toBe(validatorExpecedEntries[i]);

      }
      expect(undelegation?.validatorAddress).toBe(validatorAddress);
    });


  });


});