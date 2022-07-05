import { keplrModel } from "@/config/model/keplrModel";

export const keplrConfig: keplrModel = {
  chainId: "c4e-testnet-0.1.0",
  chainName: "c4e-testnet-0.1.0",
  rpc: "https://rpc.chain4energy.org",
  rest: "https://lcd.chain4energy.org",
  bip44: {
  coinType: 118
  },
  bech32Config: {
  bech32PrefixAccAddr: "c4e",
    bech32PrefixAccPub: "c4epub",
    bech32PrefixValAddr: "c4evaloper",
    bech32PrefixValPub: "c4evaloperpub",
    bech32PrefixConsAddr: "c4evalcons",
    bech32PrefixConsPub: "c4evalconspub"
  },
  stakeCurrency: {
    coinDenom: "C4E",
      coinMinimalDenom: "uc4e",
      coinDecimals: 1e-6
  },
  feeCurrencies: [
    {
      coinDenom: "C4E",
      coinMinimalDenom: "uc4e",
      coinDecimals: 1e-6
    }
  ],
  currencies: [
    {
      coinDenom: "C4E",
      coinMinimalDenom: "uc4e",
      coinDecimals: 1e-6
    }
  ],
  coinType: 118,
  gasPriceStep: {
    low: 0.01,
      average: 0.025,
      high: 0.03,
  },
  walletUrlForStaking: "https://app-testnet.chain4energy.org/"
}
