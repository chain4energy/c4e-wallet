import {defineStore} from "pinia";
import {assertIsDeliverTxSuccess, SigningStargateClient} from "@cosmjs/stargate";
import {transaction} from "@/models/transaction";
import { useUserStore } from "@/store/user.store";
import { voting } from "@/models/voting";

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
              coinDecimals: parseInt('0.000001'),
            },
            feeCurrencies: [
              {
                coinDenom: 'C4E',
                coinMinimalDenom: 'uc4e',
                coinDecimals: parseInt('0.000001'),
              },
            ],
            currencies: [
              {
                coinDenom: 'C4E',
                coinMinimalDenom: 'uc4e',
                coinDecimals: parseInt('0.000001'),
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
        this.$state.keplrAccount = account[0];
        useUserStore().fetchAccount(account[0].address);
        // this.connectKeplr(account) // linking on brodcast ??
      } else {
        console.log('Please install keplr extension');
      }
    },
    async connectKeplr(account: any){
      if(window.keplr){
        const chainId = 'c4e-testnet-0.1.0';
        await window.keplr.enable(chainId);
        const offlineSigner = window.keplr.getOfflineSigner(chainId);
        const client = await SigningStargateClient.connectWithSigner(
          'https://rpc.chain4energy.org/',
          offlineSigner,
        );
        const result = await client.broadcastTx(account[0].pubkey, 1000000, 0);
      } else {
        console.log('1');
      }
    },
    logOutKeplr(){
      this.$state.keplrAccount = {};
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
            default: result = 'choose your operation';
              break;
          }
          return result;
        } catch (err) {
          return err;
        }
      } else {
        console.log('No Keplr installed');
      }
    },
    async claimReward(){
      if(window.keplr) {
        const chainId = 'c4e-testnet-0.1.0';
        await window.keplr.enable(chainId);
        const offlineSigner = window.keplr.getOfflineSigner(chainId);
        const accounts = await offlineSigner.getAccounts();
        const recipient = accounts[0].address;
        const client = await SigningStargateClient.connectWithSigner(
          'https://rpc.chain4energy.org/',
          offlineSigner,
        );
        // const fee = {
        //   amount: [{
        //     denom: 'uc4e',
        //     amount: '0',
        //   }],
        //   gas: '2000',
        // };
        try {
          const result = await client.getChainId();
          console.log(result);
        } catch (err){
          console.log(err);
        }
      } else {
        console.log('err');
      }

    },
    async vote(voting: voting, proposalId: number) {
      console.log( proposalId);
    }
  },
  getters: {
    getKeplr(state) {
      return state.keplrAccount;
    },
  }
});
