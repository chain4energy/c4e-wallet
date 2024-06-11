import { StakingPool as BcStakingPool} from "@/models/blockchain/tokens";
import {mapStakingPool, mapTokenPriceHistory} from "@/models/mapper/tokens.mapper";
import {StakingPool as StoreStakingPool} from "@/models/store/tokens";
import { createStakingPool } from "../utils/tokens.blockchain.data.util";
import {TokenPriceHistoryResponse} from "@/models/hasura/tokenPrice";
import {Currency} from "@/models/currency";


describe('map tokens', () => {

  it('maps staking pool', async () => {
    const bcPool: BcStakingPool = createStakingPool('12345', '98786');

    const pool = mapStakingPool(bcPool);
    expect(pool).toBeInstanceOf(StoreStakingPool);
    expect(pool.bondedTokens).toBe(BigInt(bcPool.bonded_tokens));
    expect(pool.notBondedTokens).toBe(BigInt(bcPool.not_bonded_tokens));

  });

  it('maps pool unexpected data', async () => {
    const bcPool: BcStakingPool = {
          address: 'address',
    } as unknown as BcStakingPool;

    expect(() => {mapStakingPool(bcPool);}).toThrowError(new Error('no bonded_tokens or not_bonded_tokens defined'));
  });

  it('maps undefined coin and denom', async () => {
    expect(() => {mapStakingPool(undefined);}).toThrowError(new Error('Staking Pool is undefined'));

  });

  it('maps token price - ok', async () => {
    const data: TokenPriceHistoryResponse = {
      data: {
        tokenPrice:
          [{
            price: 0.076694,
            timestamp: "2024-06-07T10:03:02.934"
          },
            {
              price: 0.076695,
              timestamp: "2024-06-07T10:03:02.935"
            }]
      }
    };


    const tokenPrice = mapTokenPriceHistory(data);
    expect(tokenPrice).toBeInstanceOf(Array);
    expect(tokenPrice.length).toBe(2);
    expect(tokenPrice[0].price).toBe(0.076694);
    expect(tokenPrice[0].timestamp).toStrictEqual(new Date("2024-06-07T10:03:02.934"));
    expect(tokenPrice[0].currency).toBe(Currency.USD);
    expect(tokenPrice[1].price).toBe(0.076695);
    expect(tokenPrice[1].timestamp).toStrictEqual(new Date("2024-06-07T10:03:02.935"));
    expect(tokenPrice[1].currency).toBe(Currency.USD);
  });

  it('maps token price - empty data', async () => {
    const data: TokenPriceHistoryResponse = {
      data: {
        tokenPrice:
          []
      }
    };

    const tokenPrice = mapTokenPriceHistory(data);
    expect(tokenPrice).toBeInstanceOf(Array);
    expect(tokenPrice.length).toBe(0);
  });

  it('maps token price - error data - tokenPrice undefined', async () => {
    const data = {
      data: {
      }
    } as unknown as TokenPriceHistoryResponse;

    expect(() => {mapTokenPriceHistory(data);}).toThrowError(new Error('mapValidatorDescription - TokenPriceHistoryResponse.data.tokenPrice is undefined'));
  });

  it('maps token price - error data - data undefined', async () => {
    const data = {

    } as unknown as TokenPriceHistoryResponse;

    expect(() => {mapTokenPriceHistory(data);}).toThrowError(new Error('mapValidatorDescription - TokenPriceHistoryResponse.data is undefined'));
  });


});
