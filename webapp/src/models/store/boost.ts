import {Coin} from "@/models/store/common";
import {BigDecimal, divideBigInts} from "@/models/store/big.decimal";

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

  public get percentage_pool_usage(): BigDecimal {
    return divideBigInts((this.remaining_tokens.amount + this.reserved_tokens.amount), this.base_tokens.amount);
  }

}

export class UserBoost{
  vesting_pool_name: string;

  constructor(vesting_pool_name: string) {
    this.vesting_pool_name = vesting_pool_name;
  }
}
