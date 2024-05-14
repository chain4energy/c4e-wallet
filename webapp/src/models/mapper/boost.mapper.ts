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
    b.base_tokens,
    b.used_tokens,
    b.reserved_tokens,
    b.rewards_tokens,
    b.epoch_period,
    new Date(b.epoch_start_date),
    b.apr,
    b.lock_period
  ))
  );
  return boostConfigs;
}
