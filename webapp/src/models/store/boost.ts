import {Coin} from "@/models/store/common";
import {BigDecimal, divideBigInts} from "@/models/store/big.decimal";
import {useTokensStore} from "@/store/tokens.store";

export class Boost {
  pool_description: string;
  base_tokens:Coin;
  remaining_tokens:Coin;
  reserved_tokens:Coin;
  apy:number;
  lock_period:number;

  constructor(pool_description: string, base_tokens: Coin, remaining_tokens: Coin, reserved_tokens: Coin, apy: number, lock_period: number) {
    this.pool_description = pool_description;
    this.base_tokens = base_tokens;
    this.remaining_tokens = remaining_tokens;
    this.reserved_tokens = reserved_tokens;
    this.apy = apy;
    this.lock_period = lock_period;
  }

  // percentageUsage(){
  //   return ((this.remaining_tokens.amount + this.reserved_tokens.amount) /  this.base_tokens.amount)  * 100;
  // }

  public get percentage_pool_usage(): BigDecimal {
    return divideBigInts((this.remaining_tokens.amount + this.reserved_tokens.amount), this.base_tokens.amount);
  }

  // public get votingPowerViewPercentage(): number | bigint | BigDecimal {
  //   return this.votingPower;
  // }

}

export class UserBoost{
  pool_name: string;


  constructor(pool_name: string) {
    this.pool_name = pool_name;
  }
}
