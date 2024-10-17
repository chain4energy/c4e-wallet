import {TokenPrice} from "@/models/store/tokens";
import {Currency} from "@/models/currency";
import {calculatePrice} from "@/utils/token-price";
import {createPinia, setActivePinia} from "pinia";
import {useConfigurationStore} from "@/store/configuration.store";
import {defaultDenom} from "../utils/common.blockchain.data.util";
import {BigDecimal} from "@/models/store/big.decimal";
import {Coin, DecCoin} from "@/models/store/common";


describe('map tokens', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    useConfigurationStore().config.stakingDenom = defaultDenom;
    useConfigurationStore().config.viewDenoms = [ {
      denom: "uc4e",
      viewDenom: "C4E",
      coinDecimals: 6,
      conversionFactor: 1
    },{
      denom: "u$",
      viewDenom: "$",
      coinDecimals: 6,
      conversionFactor: 1
    }];
  });

  it('calculate price - number', async () => {
    const calculatedPrice = calculatePrice(1, createTokenPrice(0.5));
    expect(calculatedPrice?.toString()).toBe('0.5');
  });

  it('calculate price - bigint', async () => {
    const calculatedPrice = calculatePrice(1n, createTokenPrice(0.5));
    expect(calculatedPrice?.toString()).toBe('0.5');
  });

  it('calculate price - BigDecimal', async () => {
    const calculatedPrice = calculatePrice(new BigDecimal(1n), createTokenPrice(0.5));
    expect(calculatedPrice?.toString()).toBe('0.5');
  });

  it('calculate price - Coin - c4e', async () => {
    const calculatedPrice = calculatePrice(new Coin(1n, "c4e"), createTokenPrice(0.5));
    expect(calculatedPrice).toBeInstanceOf(DecCoin);
    expect((calculatedPrice as DecCoin).amount.toString()).toBe('0.5');
    expect((calculatedPrice as DecCoin).denom).toBe('$');
  });

  it('calculate price - Coin - uc4e', async () => {
    const calculatedPrice = calculatePrice(new Coin(100n, "uc4e"), createTokenPrice(0.5));
    expect(calculatedPrice).toBeInstanceOf(DecCoin);
    expect((calculatedPrice as DecCoin).amount.toString()).toBe('50');
    expect((calculatedPrice as DecCoin).denom).toBe('$');
  });

  it('calculate price - DecCoin - c4e', async () => {
    const calculatedPrice = calculatePrice(new DecCoin(new BigDecimal(1000n), "c4e"), createTokenPrice(0.5));
    expect(calculatedPrice).toBeInstanceOf(DecCoin);
    expect((calculatedPrice as DecCoin).amount.toString()).toBe('500');
    expect((calculatedPrice as DecCoin).denom).toBe('$');
  });

  it('calculate price - DecCoin - uc4e', async () => {
    const calculatedPrice = calculatePrice(new DecCoin(new BigDecimal(1n), "uc4e"), createTokenPrice(0.5));
    expect(calculatedPrice).toBeInstanceOf(DecCoin);
    expect((calculatedPrice as DecCoin).amount.toString()).toBe('0.5');
    expect((calculatedPrice as DecCoin).denom).toBe('$');
  });

});

export function createTokenPrice(price: number){
  return new TokenPrice(price, new Date(), Currency.USD);
}
