import { SigningStargateClient, isDeliverTxFailure } from "@cosmjs/stargate";
import { KeplrResponce } from "@/models/keplr";
import { useToast } from "vue-toastification";
// import { DelegetionMsg, KeplrObj } from "@/services/wallet/messages";
import { useSplashStore } from "@/store/splash.store";
import { ChainInfo } from "@keplr-wallet/types";
import {
  MsgBeginRedelegate,
  MsgDelegate,
  MsgUndelegate,
} from "cosmjs-types/cosmos/staking/v1beta1/tx";
import { MsgVote } from "cosmjs-types/cosmos/gov/v1beta1/tx";
import {
  MsgWithdrawDelegatorReward
} from "cosmjs-types/cosmos/distribution/v1beta1/tx"
import { useConfigurationStore } from "@/store/configuration.store";
import { EncodeObject } from "@cosmjs/proto-signing";
import { StdFee } from "@cosmjs/amino";
import { Validator } from "@/models/validator";


const toast = useToast()

declare interface wallet{
  account: string,
  client: any,
}

export enum ConnectionType {
  Address,
  Keplr,
}

export interface ConnectionInfo {
  account : string;
  modifiable: boolean;
  connectionType: ConnectionType;
}

export enum WalletResponseCode {
  OK,
  NOK,
}

export interface WalletResponse {
  code: WalletResponseCode,
  error: string
}

export interface WalletConnectionResponse extends WalletResponse {
  connectionInfo: ConnectionInfo
}

async function delegate(connection: ConnectionInfo, validator: string, amount: string): Promise<WalletResponse> {
  const denom = useConfigurationStore().config.stakingDenom

  const msg = {
    typeUrl: '/cosmos.staking.v1beta1.MsgDelegate',
    value: MsgDelegate.fromPartial({
      delegatorAddress: connection.account,
      validatorAddress: validator,
      amount: {
        denom: denom,
        amount: amount,
      }
    }),
  };

  const fee = {
    amount: [{
      denom: 'uc4e',
      amount: '0',
    }],
    gas: '2500000',
  };
  return await signAndBroadcast(connection, [msg], fee, '');
}

async function undelegate(connection: ConnectionInfo, validator: string, amount: string): Promise<WalletResponse> {
  const denom = useConfigurationStore().config.stakingDenom

  const msg = {
    typeUrl: '/cosmos.staking.v1beta1.MsgUndelegate',
    value: MsgUndelegate.fromPartial({
      delegatorAddress: connection.account,
      validatorAddress: validator,
      amount: {
        denom: denom,
        amount: amount,
      }
    }),
  };

  const fee = {
    amount: [{
      denom: 'uc4e',
      amount: '0',
    }],
    gas: '2500000',
  };
  return await signAndBroadcast(connection, [msg], fee, '');
}

async function redelegate(connection: ConnectionInfo, validatorSrc: string, validatorDst: string, amount: string): Promise<WalletResponse> {
  const denom = useConfigurationStore().config.stakingDenom

  const msg = {
    typeUrl: '/cosmos.staking.v1beta1.MsgBeginRedelegate',
    value: MsgBeginRedelegate.fromPartial({
      delegatorAddress: connection.account,
      validatorSrcAddress: validatorSrc,
      validatorDstAddress: validatorDst,
      amount: {
        denom: denom,
        amount: amount,
      }
    }),
  };

  const fee = {
    amount: [{
      denom: 'uc4e',
      amount: '0',
    }],
    gas: '2500000',
  };
  return await signAndBroadcast(connection, [msg], fee, '');
}

async function vote(connection: ConnectionInfo, option: number, proposalId: number): Promise<WalletResponse> {
  const msg = {
    typeUrl: '/cosmos.staking.v1beta1.MsgDelegate',
    value: MsgVote.fromPartial({
      option: option,
      proposalId,
      voter: connection.account,
    }),
  }

  const fee = {
    amount: [{
      denom: 'uc4e',
      amount: '0',
    }],
    gas: '2500000',
  };
  return await signAndBroadcast(connection, [msg], fee, '');
}

async function claimRewards(connection: ConnectionInfo, validators: Array<Validator>): Promise<WalletResponse> {
  const messages = []
  for (const validator of validators) {
    const msg = {
      typeUrl: '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
      value: MsgWithdrawDelegatorReward.fromPartial({
        delegatorAddress: connection.account,
        validatorAddress: validator.operator_address,
      })
    }
    messages.push(msg)
  }
  const fee = {
    amount: [{
      denom: 'uc4e',
      amount: '0',
    }],
    gas: '2500000',
  };
  return await signAndBroadcast(connection, messages, fee, '');
}

async function signAndBroadcast(connection: ConnectionInfo, messages: readonly EncodeObject[], fee: StdFee | "auto" | number, memo?: string): Promise<WalletResponse> {
  useSplashStore().increment();
  try {
    if (!connection.modifiable) {
      return {
        code: WalletResponseCode.NOK,
        error: 'Cannot modify using: ' + connection.connectionType + ' signer'
      }
    }
    const client = await createClient(connection.connectionType)
    if (client == undefined) {
      return {
        code: WalletResponseCode.NOK,
        error: 'Cannot get client'
      }
    }
    const response = await client.signAndBroadcast(connection.account, messages, fee, memo);
    if (isDeliverTxFailure(response)) {
      return {
        code: WalletResponseCode.NOK,
        error: 'Tx Error'
      }
    }
    return {
      code: WalletResponseCode.OK,
      error: ''
    }
  } finally {
    useSplashStore().decrement();
  }
}


function createClient(connectionType: ConnectionType) {
  const signer = getOfflineSigner(connectionType)
  if (signer == undefined) {
    return undefined
  }
  const rpc = useConfigurationStore().config.bcRpcURL
  const client = SigningStargateClient.connectWithSigner(
    rpc,
    signer,
  );
  return client
}

function getOfflineSigner(connectionType: ConnectionType) {
  useSplashStore().increment();
  try {
    switch(connectionType) {
      case ConnectionType.Keplr: {
        if(window.keplr) {
          const chainId = useConfigurationStore().config.chainId
          const offlineSigner = window.keplr.getOfflineSigner(chainId);
          return offlineSigner
        }
        return undefined
      }
      default: {
        return undefined
      }
    }
  } finally {
    useSplashStore().decrement();
  }
}



// async function getOfflineSigner(config: keplrModel){
//   useSplashStore().increment();
//   if(window.keplr) {
//     const chainId = config.chainId
//     await window.keplr.enable(chainId);
//     const offlineSigner = window.keplr.getOfflineSigner(chainId);
//     const accounts = await offlineSigner.getAccounts();
//     const client = await SigningStargateClient.connectWithSigner(
//       'https://rpc.chain4energy.org/',
//       offlineSigner,
//     );
//     const wallet ={
//       account: accounts[0].address,
//       client,
//     }
//     useSplashStore().decrement();
//     return wallet

//   }else {
//     toast.error('something went wrong')
//     useSplashStore().decrement();
//   }
// }

async function connectAddress(address: string): Promise<WalletConnectionResponse> {
  const connection: ConnectionInfo = {
    account: address,
    connectionType: ConnectionType.Address,
    modifiable: false
  }
  const response: WalletConnectionResponse = {
    code: WalletResponseCode.OK,
    error: '',
    connectionInfo: connection
  }
  return response
}

async function connectKeplr(): Promise<WalletConnectionResponse> {
  useSplashStore().increment();
  try {
    if (window.keplr) {
      const chainInfo = createKeplrConfig();
      await window.keplr.experimentalSuggestChain(chainInfo);
      await window.keplr.enable(chainInfo.chainId);
      const offlineSigner = window.keplr.getOfflineSigner(chainInfo.chainId);
      const account = await offlineSigner.getAccounts();
      const connection: ConnectionInfo = {
        account: account[0].address,
        connectionType: ConnectionType.Keplr,
        modifiable: true
      }
      const response: WalletConnectionResponse = {
        code: WalletResponseCode.OK,
        error: '',
        connectionInfo: connection
      }
      return response
    } else {
      const response: WalletConnectionResponse = {
        code: WalletResponseCode.NOK,
        error: 'Install Keplr',
        connectionInfo: {
          account: '',
          connectionType: ConnectionType.Keplr,
          modifiable: true
        }
      }
      toast.error('Wallet Err: ' + response.error)
      return response  
    }
  } catch (error) {
    toast.error('Wallet Err: ' + error)
    const response: WalletConnectionResponse = {
      code: WalletResponseCode.NOK,
      error: 'Wallet Err: ' + error,
      connectionInfo: {
        account: '',
        connectionType: ConnectionType.Keplr,
        modifiable: true
      }
    }
    return response
  } finally {
    useSplashStore().decrement();
  }
}

// async function checkWallet(): Promise<KeplrResponce> {
//   useSplashStore().increment();
//   if (window.keplr) {
//     try {

//     } catch (error) {
//       toast.error('Wallet Err: ' + error)
//       const message : KeplrResponce = { address: '', err : error}
//       return message
//     }
//     await window.keplr.enable(keplrConfig.chainId);
//     const offlineSigner = window.keplr.getOfflineSigner(keplrConfig.chainId);
//     const account = await offlineSigner.getAccounts();
//     const response: KeplrResponce = {
//       err: '',
//       address: account[0].address
//     }
//     useSplashStore().decrement();
//     return response
//   } else {
//     const response : KeplrResponce = {
//       err: 'Install Kepplr',
//       address: ''
//     }
//     toast.error('Wallet Err: ' + response.err)
//     useSplashStore().decrement();
//     return response

//   }
// }

function createKeplrConfig(): ChainInfo {
  const config = useConfigurationStore().config
  const chainInfo = {
    chainId: config.chainId,
    chainName: config.chainId,
    rpc: config.bcRpcURL,
    rest: config.bcApiURL,
    bip44: {
      coinType: 118
    },
    bech32Config: {
    bech32PrefixAccAddr: config.addressPrefix,
      bech32PrefixAccPub: config.addressPrefix + "pub",
      bech32PrefixValAddr: config.addressPrefix + "valoper",
      bech32PrefixValPub: config.addressPrefix + "valoperpub",
      bech32PrefixConsAddr: config.addressPrefix + "valcons",
      bech32PrefixConsPub: config.addressPrefix + "valconspub"
    },
    stakeCurrency: {
      coinDenom: "C4E",
      coinMinimalDenom: config.stakingDenom,
      coinDecimals: 1e-6
    },
    feeCurrencies: [
      {
        coinDenom: "C4E",
        coinMinimalDenom: config.stakingDenom,
        coinDecimals: 1e-6
      }
    ],
    currencies: [
      {
        coinDenom: "C4E",
        coinMinimalDenom: config.stakingDenom,
        coinDecimals: 1e-6
      }
    ],
    coinType: 118,
    gasPriceStep: {
      low: 0.01,
        average: 0.025,
        high: 0.03,
    },
    walletUrlForStaking: config.stakingPageURL
  } as ChainInfo
  return chainInfo
}

export default { vote, claimRewards, connectAddress, connectKeplr,  delegate, undelegate, redelegate };
