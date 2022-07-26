import { Coin, DecCoin } from "@/models/store/common";
import { defaultDenom } from "../utils/common.blockchain.data.util";
import { createSingleCoin } from '../utils/account.blockchain.data.util';
import { findByDenomAndMapDecCoin, mapCoin, mapDecCoin } from "@/models/mapper/common.mapper";
import { Coin as BcCoin } from "@/models/blockchain/common";
import { BigDecimal } from "@/models/store/big.decimal";

const address = 'c4e13zg4u07ymq83uq73t2cq3dj54jj37zzgqfwjpg'
const denom = defaultDenom
const secondDenom = 'denom'

describe('map common', () => {

  it('maps coin', async () => {
    const amount = 43n;
    const bcCoin: BcCoin = createSingleCoin(denom, amount.toString())

    const coin = mapCoin(bcCoin, secondDenom);
    expect(coin).toBeInstanceOf(Coin);
    expect(coin.amount).toBe(amount);
    expect(coin.denom).toBe(denom);

  });

  it('maps dec coin', async () => {
    const amount = 43n;
    const bcCoin: BcCoin = createSingleCoin(denom, amount.toString())

    const coin = mapDecCoin(bcCoin, secondDenom);
    expect(coin).toBeInstanceOf(DecCoin);
    expect(coin.amount).toStrictEqual(new BigDecimal(amount));
    expect(coin.denom).toBe(denom);

  });

  it('maps undefined coin', async () => {
    const bcCoin = mapCoin(undefined, secondDenom);
    expect(bcCoin).toBeInstanceOf(Coin);
    expect(bcCoin.amount).toBe(0n);
    expect(bcCoin.denom).toBe(secondDenom);

  });

  it('maps undefined dec coin', async () => {
    const bcCoin = mapDecCoin(undefined, secondDenom);
    expect(bcCoin).toBeInstanceOf(DecCoin);
    expect(bcCoin.amount).toStrictEqual(new BigDecimal(0));
    expect(bcCoin.denom).toBe(secondDenom);

  });

  it('maps coin unexpected data', async () => {
    const bcCoin: BcCoin = {
          address: address,
    } as unknown as BcCoin;

    expect(() => {mapCoin(bcCoin, secondDenom)}).toThrowError(new Error('no amount or denom defined'));
  });

  it('maps dec coin unexpected data', async () => {
    const bcCoin: BcCoin = {
          address: address,
    } as unknown as BcCoin;

    expect(() => {mapDecCoin(bcCoin, secondDenom)}).toThrowError(new Error('no amount or denom defined'));
  });

  it('maps undefined coin and denom', async () => {
    expect(() => {mapCoin(undefined, undefined)}).toThrowError(new Error('no coin and denom defined'));

  });

  it('maps undefined dec coin and denom', async () => {
    expect(() => {mapDecCoin(undefined, undefined)}).toThrowError(new Error('no coin and denom defined'));

  });

  it('finds and maps undefined dec coins', async () => {
    const bcCoin = findByDenomAndMapDecCoin(undefined, secondDenom);
    expect(bcCoin).toBeInstanceOf(DecCoin);
    expect(bcCoin.amount).toStrictEqual(new BigDecimal(0));
    expect(bcCoin.denom).toBe(secondDenom);

  });

  it('finds and maps undefined dec coins and denom', async () => {
    expect(() => {findByDenomAndMapDecCoin(undefined, undefined)}).toThrowError(new Error('no coins and denom defined'));

  });

  it('finds and maps dec coins', async () => {
    const amount = '43';
    const expectedBcCoin: BcCoin = createSingleCoin(denom, amount);
    const coins = new Array<BcCoin>();
    coins.push(expectedBcCoin);
    for (let i = 0; i < 10; i++) {
      coins.push(createSingleCoin('denom' + 1, '' + 100 + i));
    }
    
    const coin = findByDenomAndMapDecCoin(coins, denom);
    expect(coin).toBeInstanceOf(DecCoin);
    expect(coin.amount).toStrictEqual(new BigDecimal(amount));
    expect(coin.denom).toBe(denom);

  });

});