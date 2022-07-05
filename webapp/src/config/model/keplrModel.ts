export interface keplrModel{
  chainId: string,
  chainName: string,
  rpc: string,
  rest: string,
  bip44: {
    coinType: number,
  },
  bech32Config: {
    bech32PrefixAccAddr: string,
    bech32PrefixAccPub: string,
    bech32PrefixValAddr: string,
    bech32PrefixValPub: string,
    bech32PrefixConsAddr: string,
    bech32PrefixConsPub: string,
  },
  stakeCurrency: {
    coinDenom: string,
    coinMinimalDenom: string,
    coinDecimals: number
  },
  feeCurrencies: [
    {
      coinDenom: string,
      coinMinimalDenom: string,
      coinDecimals: number
    },
  ],
  currencies: [
    {
      coinDenom: string,
      coinMinimalDenom: string,
      coinDecimals: number
    },
  ],
  coinType: number
  gasPriceStep: {
    low: number
    average: number
    high: number
  },
  walletUrlForStaking: string,
}
