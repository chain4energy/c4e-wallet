import {BoostConfigResponse} from "@/models/boost/boost";
import {BoostConfig} from "@/models/store/boostConfig";
import {Coin} from "@/models/store/common";

export function mapBoostConfig(boostConfig: BoostConfigResponse[] | undefined): BoostConfig[]  {
  if (boostConfig === undefined) {
    throw new Error('BoostConfigResponse is undefined');
  }
  const boostConfigs:BoostConfig[] = Array<BoostConfig>();
  boostConfig.forEach(b=> boostConfigs.push(new BoostConfig(
    b.pool_description,
    b.prefix_name,
    new Coin(BigInt(b.base_tokens), "uc4e"),
    new Coin(BigInt(b.used_tokens), "uc4e"),
    new Coin(BigInt(b.reserved_tokens), "uc4e"),
    new Coin(BigInt(b.rewards_tokens), "uc4e"),
    b.epoch_period,
    new Date(b.epoch_start_date),
    b.apr,
    b.lock_period
  ))
  );
  return boostConfigs;
}
