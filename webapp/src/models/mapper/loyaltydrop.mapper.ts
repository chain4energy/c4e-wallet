import {LoyaltyDropPoolConfig} from "@/models/store/loyaltyDrop";
import {LoyaltyDropPoolConfigResponse} from "@/models/loyaltydrop/loyaltyDrop";

export function mapBoostConfig(loyaltyDropPoolConfigResp: LoyaltyDropPoolConfigResponse[] | undefined): LoyaltyDropPoolConfig[]  {
  if (loyaltyDropPoolConfigResp === undefined) {
    throw new Error('LoyaltyDropPoolConfigResp is undefined');
  }
  const loyaltyDropPoolConfig:LoyaltyDropPoolConfig[] = Array<LoyaltyDropPoolConfig>();
  loyaltyDropPoolConfigResp.forEach(b=> loyaltyDropPoolConfig.push(new LoyaltyDropPoolConfig(
    b.pool_description,
    b.prefix_name,
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
