import { StakingPool as BcStakingPool} from "@/models/blockchain/tokens";
import { StakingPool as StoreStakingPool } from "@/models/store/tokens";

export function mapStakingPool(pool: BcStakingPool | undefined): StoreStakingPool  {
  if (pool === undefined) {
      throw new Error('Staking Pool is undefined');
  }
  if (pool.bonded_tokens === undefined || pool.not_bonded_tokens === undefined) {
    throw new Error('no bonded_tokens or not_bonded_tokens defined');
  }
  return new StoreStakingPool(pool.bonded_tokens, pool.not_bonded_tokens);
}

