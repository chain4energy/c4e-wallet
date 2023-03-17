import {Coin as CoinBC} from "@/models/blockchain/common";
import {Coin} from "@/models/store/common";

export function getDenomFromArray(coins: CoinBC[], denom: string): Coin {
  const coin = coins.find(c => c.denom = denom);
  if (coin) {
    return new Coin(BigInt(coin.amount), coin.denom);
  } else {
    return new Coin(BigInt(0), denom);
  }
}


