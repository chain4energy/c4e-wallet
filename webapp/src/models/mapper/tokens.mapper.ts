import {StakingPool as BcStakingPool} from "@/models/blockchain/tokens";
import {StakingPool as StoreStakingPool, TokenPrice} from "@/models/store/tokens";
import {TokenPriceHistoryResponse} from "@/models/hasura/tokenPrice";
import {Currency} from "@/models/currency";

export function mapStakingPool(pool: BcStakingPool | undefined): StoreStakingPool  {
  if (pool === undefined) {
      // throw new Error('Staking Pool is undefined');
    return new StoreStakingPool(BigInt(0), BigInt(0));
  }
  if (pool.bonded_tokens === undefined || pool.not_bonded_tokens === undefined) {
    throw new Error('no bonded_tokens or not_bonded_tokens defined');
  }
  return new StoreStakingPool(BigInt(pool.bonded_tokens), BigInt(pool.not_bonded_tokens));
}


export function mapTokenPriceHistory(hasuraData: TokenPriceHistoryResponse | undefined):TokenPrice[] {
  if (hasuraData === undefined) {
    throw new Error('mapTokenPriceHistory - TokenPriceHistoryResponse response is undefined');
  }
  if (hasuraData.data === undefined) {
    throw new Error('mapValidatorDescription - TokenPriceHistoryResponse.data is undefined');
  }
  if (hasuraData.data.tokenPrice === undefined) {
    throw new Error('mapValidatorDescription - TokenPriceHistoryResponse.data.tokenPrice is undefined');
  }
  const retVal = new Array<TokenPrice>();
  hasuraData.data.tokenPrice.forEach(el => {
    retVal.push(new TokenPrice(Number(el.price),new Date(el.timestamp), Currency.USD));
  });
  return retVal;
}
