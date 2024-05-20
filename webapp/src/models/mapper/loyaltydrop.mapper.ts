import {LoyaltyDropPoolConfig, LoyaltyDropUserBoost} from "@/models/store/loyaltyDrop";
import {LoyaltyDropPoolConfigResponse, LoyaltyDropUserBoostResponse} from "@/models/loyaltydrop/loyaltyDrop";

export function mapLoyaltyDropConfig(loyaltyDropPoolConfigResp: LoyaltyDropPoolConfigResponse[] | undefined): LoyaltyDropPoolConfig[]  {
  if (loyaltyDropPoolConfigResp === undefined) {
    throw new Error('LoyaltyDropPoolConfigResp is undefined');
  }
  const loyaltyDropPoolConfig:LoyaltyDropPoolConfig[] = Array<LoyaltyDropPoolConfig>();
  loyaltyDropPoolConfigResp.forEach(b=> loyaltyDropPoolConfig.push(new LoyaltyDropPoolConfig(
    b.id,
    b.pool_description,
    b.prefix_name,
    b.vesting_type_name,
    b.base_tokens,
    b.rewards_tokens,
    b.used_tokens,
    b.reserved_tokens,
    b.epoch_number,
    b.epoch_period,
    new Date(b.epoch_start_date),
    b.apr
  ))
  );
  return loyaltyDropPoolConfig;
}

export function mapLoyaltyDropUserBoost(loyaltyDropUserBoostResp: LoyaltyDropUserBoostResponse[] | undefined): LoyaltyDropUserBoost[]  {
  if (loyaltyDropUserBoostResp === undefined) {
    throw new Error('LoyaltyDropPoolConfigResp is undefined');
  }
  const userBoost:LoyaltyDropUserBoost[] = Array<LoyaltyDropUserBoost>();
  loyaltyDropUserBoostResp.forEach(b=> userBoost.push(new LoyaltyDropUserBoost(
    b.boost_pool_id,
    b.vesting_pool_name,
    b.base_account_address,
    b.status,
    b.tx_hash,
    b.granted_rewards,
    b.amount,
    new Date(b.last_reward_date),
    new Date(b.lock_start),
    new Date(b.lock_end)
    ))
  );
  return userBoost;
}
