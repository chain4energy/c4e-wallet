import {LoyaltyDropPoolConfig} from "@/models/store/loyaltyDrop";
import {BigDecimal, divideBigInts} from "@/models/store/big.decimal";
import {useConfigurationStore} from "@/store/configuration.store";
import {Coin} from "@/models/store/common";

const MILISECONDS_IN_YEAR = 365 * 24 * 60 * 60 * 1000;

export function calculateApr(data: LoyaltyDropPoolConfig) {
  return divideBigInts(data.rewardsTokens.amount, data.baseTokens.amount).multiply(100 * (MILISECONDS_IN_YEAR / data.epochPeriod / data.epochNumber));
}

export function calculateReward(data: LoyaltyDropPoolConfig, lockedAmount: number) {
  const factor = useConfigurationStore().config.getViewDenomConversionFactor();
  const amountTemp = divideBigInts( data.rewardsTokens.amount, data.baseTokens.amount).multiply(lockedAmount);
  return new BigDecimal(amountTemp).multiply(factor);
}

export function calculatePayouts(data: LoyaltyDropPoolConfig, lockedAmount: Coin) {
  return calculateReward(data, Number(lockedAmount.amount)).divide(data.epochNumber);
}
