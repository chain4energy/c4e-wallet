import { Delegation as BcDelegation, UnbondigDelegation as BcUnbondigDelegation} from "@/models/blockchain/staking";
import { Delegation as StoreDelegation, Delegations, UnbondingDelegation as StoreUnbondigDelegation, UnbondingDelegationEntry, UnbondingDelegations } from "@/models/store/staking";

export function mapDelegations(delegations: BcDelegation[] | undefined): Delegations  {
  if (delegations === undefined) {
    throw new Error('Delegations list is undefined');
  }

  const map = new Map<string, StoreDelegation>();
  const total = mapAndAddDelegationsToMap(map, delegations);
  return new Delegations(map, total);
}

export function mapAndAddDelegations(delegationsToAdd: Delegations, bcDelegations: BcDelegation[] | undefined): Delegations  {
  if (bcDelegations === undefined) {
    throw new Error('BcDelegations list is undefined');
  }
  delegationsToAdd.totalDelegated +=  mapAndAddDelegationsToMap(delegationsToAdd.delegations, bcDelegations);
  return delegationsToAdd;
}

function mapAndAddDelegationsToMap(map: Map<string, StoreDelegation>, bcDelegations: BcDelegation[] | undefined): number  {
  if (bcDelegations === undefined) {
    throw new Error('BcDelegations list is undefined');
  }
  let total = 0;
  bcDelegations.forEach(del => {
    map.set(del.delegation.validator_address, mapDelegation(del))
    total += Number(del.balance.amount);
  })
  return total;
}

export function mapDelegation(delegation: BcDelegation | undefined): StoreDelegation  {
  if (delegation === undefined) {
      throw new Error('Delegation is undefined');
  }

  return new StoreDelegation(delegation.delegation.validator_address,
    delegation.balance.amount);
}

export function mapUnbondingDelegations(undelegations: BcUnbondigDelegation[] | undefined): UnbondingDelegations  {
  if (undelegations === undefined) {
    throw new Error('Unbonding Delegations list is undefined');
  }

  const map = new Map<string, StoreUnbondigDelegation>();
  let total = 0;
  undelegations.forEach(del => {
    map.set(del.validator_address, mapUnbondingDelegation(del))
    del.entries.forEach(en => total += Number(en.balance));
  })
  return new UnbondingDelegations(map, total);
}

export function mapUnbondingDelegation(undelegation: BcUnbondigDelegation | undefined): StoreUnbondigDelegation  {
  if (undelegation === undefined) {
      throw new Error('Unbondig Delegation is undefined');
  }
  const entries = new Array<UnbondingDelegationEntry>()
  undelegation.entries.forEach(e => {
    entries.push(new UnbondingDelegationEntry(e.balance))
  })

  return new StoreUnbondigDelegation(undelegation.validator_address, entries);
}

