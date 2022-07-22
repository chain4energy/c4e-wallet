import { Coin as BcCoin } from "../blockchain/common";
import { Coin as StoreCoin, DecCoin} from "../store/common";

export function mapCoin(coin: BcCoin | undefined, denom: string | undefined): StoreCoin  {
  return mapToAnyCoin<StoreCoin>(coin, denom, (amount: string, denom: string) => {return new StoreCoin(amount, denom);})
}

export function mapDecCoin(coin: BcCoin | undefined, denom: string | undefined): DecCoin  {
  return mapToAnyCoin<DecCoin>(coin, denom, (amount: string, denom: string) => {return new DecCoin(amount, denom);})
}

function mapToAnyCoin<C>(coin: BcCoin | undefined, denom: string | undefined, toCoin: (amount: string, denom: string) => C): C  {
  if (coin === undefined) {
    if (denom === undefined) {
      throw new Error(`no coin and denom defined`);
    }
    return toCoin('0', denom);
  }
  if (coin.amount === undefined || coin.denom === undefined) {
    throw new Error(`no amount or denom defined`);
  }
  return toCoin(coin.amount, coin.denom);
}

export function findByDenomAndMapDecCoin(coins: BcCoin[] | undefined, denom: string | undefined): DecCoin  {
  if (coins === undefined || coins.length === 0) {
    if (denom === undefined) {
      throw new Error(`no coins and denom defined`);
    }
    return new DecCoin('0', denom);
  }
  const result = coins.find(coin => coin.denom === denom);
  return mapDecCoin(result, denom);
}
