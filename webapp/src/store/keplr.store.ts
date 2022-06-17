import {defineStore} from "pinia";
import {assertIsDeliverTxSuccess, SigningStargateClient} from "@cosmjs/stargate";
import {transaction} from "@/models/transaction";


export const useKeplrStore = defineStore({

  id: 'keplrStore',
  state: () => {
    return {
      keplrAccount: {},
      transaction: Object(transaction),
    };
  },
  actions: {
    async checkKeplr() {
      if (window.keplr) {
        const chainId = 'c4e-testnet-0.1.0';
        try {
          await window.keplr.experimentalSuggestChain({
            chainId,
            chainName: chainId,
            rpc: 'https://rpc.chain4energy.org',
            rest: 'https://lcd.chain4energy.org',
            bip44: {
              coinType: 118,
            },
            bech32Config: {
              bech32PrefixAccAddr: 'c4e',
              bech32PrefixAccPub: 'c4epub',
              bech32PrefixValAddr: 'c4evaloper',
              bech32PrefixValPub: 'c4evaloperpub',
              bech32PrefixConsAddr: 'c4evalcons',
              bech32PrefixConsPub: 'c4evalconspub',
            },
            stakeCurrency: {
              coinDenom: 'C4E',
              coinMinimalDenom: 'uc4e',
              coinDecimals: 6,
            },
            feeCurrencies: [
              {
                coinDenom: 'C4E',
                coinMinimalDenom: 'uc4e',
                coinDecimals: 6,
              },
            ],
            currencies: [
              {
                coinDenom: 'C4E',
                coinMinimalDenom: 'uc4e',
                coinDecimals: 6,
              },
            ],
            coinType: 118,
            gasPriceStep: {
              low: 0.01,
              average: 0.025,
              high: 0.03,
            },
            walletUrlForStaking: 'https://app-testnet.chain4energy.org/',
          });
        } catch (error) {
          console.log(error);
        }
        await window.keplr.enable(chainId);
        const offlineSigner = window.keplr.getOfflineSigner(chainId);
        const account = await offlineSigner.getAccounts();
        console.log(account[0])
        this.$state.keplrAccount = account[0]
      } else {
        console.log('Please install keplr extension');
      }
    },
    async delegeteTokens(transaction: transaction) {
      if(window.keplr){
        const chainId = 'c4e-testnet-0.1.0';
        await window.keplr.enable(chainId);
        const offlineSigner = window.keplr.getOfflineSigner(chainId);
        const accounts = await offlineSigner.getAccounts();
        const recipient = transaction.address;
        const client = await SigningStargateClient.connectWithSigner(
          'https://rpc.chain4energy.org/',
          offlineSigner,
        );
        const amountFinal = {
          denom: 'uc4e',
          amount: transaction.amount,
        };
        const fee = {
          amount: [{
            denom: 'uc4e',
            amount: '0',
          }],
          gas: '200000',
        };
        try {
          let result;
          switch (transaction.type){
            case 'delegate':
              result = await client.delegateTokens(accounts[0].address, recipient, amountFinal, fee, '');
              await assertIsDeliverTxSuccess(result);
              break;
            case 'undelegate':
              result = await client.undelegateTokens(accounts[0].address, recipient, amountFinal, fee, '');
              await assertIsDeliverTxSuccess(result);
              break;
            default: console.log('choose your operation');
              break;
          }
        } catch (err) {
          console.log(err)
        }
      } else {
        console.log('No Keplr installed');
      }


    },
  },
  getters: {
    getKeplr(state) {
      return state.keplrAccount
    },
  }
});
