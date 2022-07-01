import {defineStore} from "pinia";
import {assertIsDeliverTxSuccess, SigningStargateClient} from "@cosmjs/stargate";
import {transaction} from "@/models/transaction";
import { useUserStore } from "@/store/user.store";
import { voting } from "@/models/voting";
import { useValidatorsStore } from "@/store/validators.store";
import { validator } from "@cosmjs/stargate/build/testutils.spec";
import { PagingModel } from "@/services/model/paging.model";
import {
  MsgBeginRedelegate,
} from "cosmjs-types/cosmos/staking/v1beta1/tx";
import {
  MsgWithdrawDelegatorReward
} from "cosmjs-types/cosmos/distribution/v1beta1/tx"
import { MsgVote } from "cosmjs-types/cosmos/gov/v1beta1/tx";




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
          gas: '2500000',
        };
        try {
          let result;
          switch (transaction.type){
            case 'delegate':
              result = await client.delegateTokens(accounts[0].address, recipient, amountFinal, fee, '');
              await assertIsDeliverTxSuccess(result);
              console.log(result);
              break;
            case 'undelegate':
              result = await client.undelegateTokens(accounts[0].address, recipient, amountFinal, fee, '');
              await assertIsDeliverTxSuccess(result);
              console.log(result);
              break;
            default: result = 'choose your operation';
              break;
          }
          await useUserStore().fetchAccount(accounts[0].address);
          return result;
        } catch (err) {
          return err;
        }
      } else {
        console.log('No Keplr installed');
      }
    },
    redelagate: async function(transaction: transaction, amountFinal: object) {
      if (window.keplr) {
        const chainId = "c4e-testnet-0.1.0";
        await window.keplr.enable(chainId);
        const offlineSigner = window.keplr.getOfflineSigner(chainId);
        const accounts = await offlineSigner.getAccounts();
        const client = await SigningStargateClient.connectWithSigner(
          "https://rpc.chain4energy.org/",
          offlineSigner
        );
        const am: object = {
          amount: {
            denom: "uc4e",
            amount: 12
          }
        };
        const fee = {
          amount: [{
            denom: 'uc4e',
            amount: '0',
          }],
          gas: '100000',
        };
        const reDelegateMsg = {
          typeUrl: "/cosmos.staking.v1beta1.MsgBeginRedelegate",
          value: MsgBeginRedelegate.fromPartial({
            delegatorAddress: "c4e17dffs6qldsh30un0jm68ggr40rzkm7tmvh0e78",
            validatorSrcAddress: "c4evaloper1jghcfqgq7kkwfpk4luazlzx83df96e2azcflth",
            validatorDstAddress: "c4evaloper19473sdmlkkvcdh6z3tqedtqsdqj4jjv782dku2",
            amount: {
              denom: "uc4e",
              amount: '1'
            }
          })
        };
        const result = await client.signAndBroadcast(accounts[0].address, [reDelegateMsg], fee, '');
        console.log(result);
      } else {
        console.log("1");
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
        const fee = {
          amount: [{
            denom: 'uc4e',
            amount: '',
          }],
          gas: '400000',
        };
        try {
          const validators = await useValidatorsStore().getValidators;
          const approvedValidators = [];
          for (const element of validators.validators){
            console.log(element)
            const result = await client.getDelegation(recipient, element.operator_address);
            if(result !== null){
              const unit= {
                val : element,
                coin: result
              };
              approvedValidators.push(unit);
            } else {
              console.log('NO');
            }
          }
          const a = [];
          for (const element of approvedValidators){
            const client2 = await SigningStargateClient.connectWithSigner(
              'https://rpc.chain4energy.org/',
              offlineSigner,
            );

            console.log(recipient, element.val.operator_address, client2);
            const reDelegateMsg = {
              typeUrl: '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
              value: MsgWithdrawDelegatorReward.fromPartial({
                delegatorAddress: recipient,
                validatorAddress: element.val.operator_address,
              }),
            };
            a.push(reDelegateMsg);
          }
          const result = await client.signAndBroadcast(accounts[0].address, a, fee, '');
          console.log(result);
        } catch (err){
          console.log(err);
        }
      } else {
        console.log('err');
      }
    },
    async vote(option: number, proposalId: number) {
      if (window.keplr) {
        const chainId = "c4e-testnet-0.1.0";
        await window.keplr.enable(chainId);
        const offlineSigner = window.keplr.getOfflineSigner(chainId);
        const accounts = await offlineSigner.getAccounts();
        const client = await SigningStargateClient.connectWithSigner(
          "https://rpc.chain4energy.org/",
          offlineSigner
        );
        const fee = {
          amount: [{
            denom: 'uc4e',
            amount: '0',
          }],
          gas: '100000',
        };
        console.log(typeof option);
        const reDelegateMsg = {
          typeUrl: '/cosmos.gov.v1beta1.MsgVote',
          value: MsgVote.fromPartial({
            option: option,
            proposalId,
            voter: accounts[0].address,
          }),
        }
        const result = await client.signAndBroadcast(accounts[0].address, [reDelegateMsg], fee, '');
        console.log(result);
      }

    }
  },
  getters: {
    getKeplr(state) {
      return state.keplrAccount;
    },
  }
});
