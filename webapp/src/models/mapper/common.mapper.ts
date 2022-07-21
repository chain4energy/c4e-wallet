import { Coin as BcCoin } from "../blockchain/common";
import { Coin as StoreCoin} from "../store/account";

export function mapCoin(coin: BcCoin | undefined, denom: string | undefined): StoreCoin  {
  if (coin === undefined) {
    if (denom === undefined) {
      throw new Error(`no coin defined`);
    }
    return new StoreCoin('0', denom);
  }
  if (coin.amount === undefined || coin.denom === undefined) {
    throw new Error(`no amount or denom defined`);
  }
  return new StoreCoin(coin.amount, coin.denom);
}

export function findByDenomAndMapCoin(coins: BcCoin[] | undefined, denom: string | undefined): StoreCoin  {
  if (coins === undefined) {
    if (denom === undefined) {
      throw new Error(`no coins defined`);
    }
    return new StoreCoin('0', denom);
  }
  const result = coins.find(coin => coin.denom === denom);
  return mapCoin(result, denom);
}
