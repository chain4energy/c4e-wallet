import {LoyaltyDropPoolConfig, LoyaltyDropUserBoost} from "@/models/store/loyaltyDrop";
import {LoyaltyDropPoolConfigResponse, LoyaltyDropUserBoostResponse} from "@/models/loyaltydrop/loyaltyDrop";

export function mapLoyaltyDropConfig(loyaltyDropPoolConfigResp: LoyaltyDropPoolConfigResponse[] | undefined): LoyaltyDropPoolConfig[]  {
  if (loyaltyDropPoolConfigResp === undefined) {
    throw new Error('LoyaltyDropPoolConfigResp is undefined');
  }
  if(loyaltyDropPoolConfigResp === null){
    console.log("loyaltyDropPoolConfigResp is null");
    return [];
  }
  const loyaltyDropPoolConfig:LoyaltyDropPoolConfig[] = Array<LoyaltyDropPoolConfig>();
  loyaltyDropPoolConfigResp.forEach(b=> loyaltyDropPoolConfig.push(new LoyaltyDropPoolConfig(
    b.id,
    b.pool_description,
    b.vesting_type_name,
    b.base_tokens,
    b.rewards_tokens,
    b.used_tokens,
    b.reserved_tokens,
    b.granted_rewards,
    b.epoch_number,
    b.epoch_period,
    new Date(b.epoch_start_date)
  ))
  );
  return loyaltyDropPoolConfig;
}

export function mapLoyaltyDropUserBoostArray(loyaltyDropUserBoostResp: LoyaltyDropUserBoostResponse[] | undefined): LoyaltyDropUserBoost[]  {


  if (loyaltyDropUserBoostResp === undefined) {
    throw new Error('LoyaltyDropPoolConfigResp is undefined');
  }
  if(loyaltyDropUserBoostResp === null){
    console.log("loyaltyDropUserBoostResp is null");
    return [];
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
    b.last_reward_date ? new Date(b.last_reward_date) : null,
    b.lock_start ? new Date(b.lock_start) : null,
    b.lock_end ? new Date(b.lock_end) : null
    ))
  );
  return userBoost;
}

export function mapLoyaltyDropUserBoost(loyaltyDropUserBoostResp: LoyaltyDropUserBoostResponse | undefined): LoyaltyDropUserBoost{
  if (loyaltyDropUserBoostResp === undefined) {
    throw new Error('LoyaltyDropPoolConfigResp is undefined');
  }
  return new LoyaltyDropUserBoost(
    loyaltyDropUserBoostResp.boost_pool_id,
    loyaltyDropUserBoostResp.vesting_pool_name,
    loyaltyDropUserBoostResp.base_account_address,
    loyaltyDropUserBoostResp.status,
    loyaltyDropUserBoostResp.tx_hash,
    loyaltyDropUserBoostResp.granted_rewards,
    loyaltyDropUserBoostResp.amount,
    loyaltyDropUserBoostResp.last_reward_date ? new Date(loyaltyDropUserBoostResp.last_reward_date) : null,
    loyaltyDropUserBoostResp.lock_start ? new Date(loyaltyDropUserBoostResp.lock_start) : null,
    loyaltyDropUserBoostResp.lock_end ? new Date(loyaltyDropUserBoostResp.lock_end) : null
  );
}
