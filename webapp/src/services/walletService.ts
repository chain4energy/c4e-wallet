import { SigningStargateClient, isDeliverTxFailure } from "@cosmjs/stargate";
import { KeplrResponce } from "@/models/keplr";
import { useToast } from "vue-toastification";
import { DelegetionMsg, KeplrObj } from "@/services/wallet/messages";
import { keplrConfig } from "@/config/keplrConfigTest";
import { keplrModel } from "@/config/model/keplrModel";
import { useSplashStore } from "@/store/splash.store";
// import {
//   MsgBeginRedelegate,
//   MsgCreateValidator,
//   MsgDelegate,
//   MsgEditValidator,
//   MsgUndelegate,
// } from "cosmjs-types/cosmos/staking/v1beta1/tx";
import { MsgVote } from "cosmjs-types/cosmos/gov/v1beta1/tx";

const toast = useToast()

declare interface wallet{
  account: string,
  client: any,
}

async function vote(config: keplrModel, option: number, proposalId: number): Promise<KeplrResponce> {
  const signer = await getOfflineSigner(config)
  if (signer == undefined) {
    const response : KeplrResponce = {
      err: 'Install Kepplr',
      address: ''
    }
    return response
  }
  const msg = {
    typeUrl: '/cosmos.staking.v1beta1.MsgDelegate',
    value: MsgVote.fromPartial({
      option: option,
      proposalId,
      voter: signer.account,
    }),
  }

  const fee = {
    amount: [{
      denom: 'uc4e',
      amount: '0',
    }],
    gas: '2500000',
  };
  const response = await signer.client.signAndBroadcast(signer?.account, [msg], fee, '');
  if (isDeliverTxFailure(response)) {
    const response : KeplrResponce = {
      err: 'Some Err',
      address: ''
    }
    return response
  }
  const result: KeplrResponce = {
    err: '',
    address: signer.account
  }
  return result
}

async function getOfflineSigner(config: keplrModel){
  useSplashStore().increment();
  if(window.keplr) {
    const chainId = config.chainId
    await window.keplr.enable(chainId);
    const offlineSigner = window.keplr.getOfflineSigner(chainId);
    const accounts = await offlineSigner.getAccounts();
    const client = await SigningStargateClient.connectWithSigner(
      'https://rpc.chain4energy.org/',
      offlineSigner,
    );
    const wallet ={
      account: accounts[0].address,
      client,
    }
    useSplashStore().decrement();
    return wallet

  }else {
    toast.error('something went wrong')
    useSplashStore().decrement();
  }
}

async function checkWallet(): Promise<KeplrResponce> {
  useSplashStore().increment();
  if (window.keplr) {
    try {
      const chain = new KeplrObj(keplrConfig);
      await window.keplr.experimentalSuggestChain(chain.keplrObj);
    } catch (error) {
      toast.error('Wallet Err: ' + error)
      const message : KeplrResponce = { address: '', err : error}
      return message
    }
    await window.keplr.enable(keplrConfig.chainId);
    const offlineSigner = window.keplr.getOfflineSigner(keplrConfig.chainId);
    const account = await offlineSigner.getAccounts();
    const response: KeplrResponce = {
      err: '',
      address: account[0].address
    }
    useSplashStore().decrement();
    return response
  } else {
    const response : KeplrResponce = {
      err: 'Install Kepplr',
      address: ''
    }
    toast.error('Wallet Err: ' + response.err)
    useSplashStore().decrement();
    return response

  }
}

export default { vote, getOfflineSigner, checkWallet};
