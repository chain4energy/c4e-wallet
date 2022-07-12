import { Delegation as BcDelegation,} from "@/models/blockchain/staking";
import { Delegation as StoreDelegation, Delegations} from "@/models/store/staking";

export function mapDelegations(delegations: BcDelegation[] | undefined): Delegations  {
  if (delegations === undefined) {
    throw new Error('Delegations list is undefined');
  }

  const map = new Map<string, StoreDelegation>();
  let total = 0;
  delegations.forEach(del => {
    map.set(del.delegation.validator_address, mapDelegation(del))
    total += Number(del.balance.amount);
  })
  return new Delegations(map, total);
}

export function mapDelegation(delegation: BcDelegation | undefined): StoreDelegation  {
  if (delegation === undefined) {
      throw new Error('Delegation is undefined');
  }

  return new StoreDelegation(delegation.delegation.validator_address,
    delegation.balance.amount);
}


