import { keplrModel } from "@/config/model/keplrModel";
import { amount } from "@/models/keplr";
import {
  MsgBeginRedelegate,
  MsgCreateValidator,
  MsgDelegate,
  MsgEditValidator,
  MsgUndelegate,
} from "cosmjs-types/cosmos/staking/v1beta1/tx";
import { MsgVote } from "cosmjs-types/cosmos/gov/v1beta1/tx";
import {
  MsgWithdrawDelegatorReward
} from "cosmjs-types/cosmos/distribution/v1beta1/tx"

import { transaction } from "@/models/transaction";
import { keplrConfig } from "@/config/keplrConfigTest";

export class KeplrObj{
  keplrObj: keplrModel;

  constructor(config: keplrModel) {
    this.keplrObj = {
      chainId: config.chainId,
      chainName: config.chainName,
      rpc: config.rpc,
      rest: config.rest,
      bip44: config.bip44,
      bech32Config: config.bech32Config,
      stakeCurrency: config.stakeCurrency,
      feeCurrencies: [...config.feeCurrencies],
      currencies: [...config.currencies],
      coinType: config.coinType,
      gasPriceStep: config.gasPriceStep,
      walletUrlForStaking: config.walletUrlForStaking,
    }
  }
}

export class DelegetionMsg{
  delegation: any;
  fee: any;
  constructor(transaction: transaction, config: keplrModel) {
    switch (transaction.type){
      case 'delegate': this.delegation = {
        typeUrl: '/cosmos.staking.v1beta1.MsgDelegate',
        value: MsgDelegate.fromPartial({
          delegatorAddress: transaction.delegatorAddress,
          validatorAddress: transaction.validatorDstAddress,
          amount: {
            denom: keplrConfig.stakeCurrency.coinMinimalDenom,
            amount: transaction.amount,
          }
        }),
      };
      break
      case 'undelegate': this.delegation = {
        typeUrl: '/cosmos.staking.v1beta1.MsgUndelegate',
        value: MsgUndelegate.fromPartial({
          delegatorAddress: transaction.delegatorAddress,
          validatorAddress: transaction.address,
          amount: {
            denom: keplrConfig.stakeCurrency.coinMinimalDenom,
            amount: transaction.amount,
          }
        })
      };
      break
      case 'redelegate': this.delegation ={
        typeUrl: '/cosmos.staking.v1beta1.MsgBeginRedelegate',
        value: MsgBeginRedelegate.fromPartial({
          delegatorAddress: transaction.delegatorAddress,
          validatorSrcAddress: transaction.address,
          validatorDstAddress: transaction.validatorDstAddress,
          amount: {
            denom: keplrConfig.stakeCurrency.coinMinimalDenom,
            amount: transaction.amount,
          }
        })
      }
      break;
      default : this.delegation = {
        typeUrl: '/cosmos.staking.v1beta1.MsgDelegate',
        value: MsgBeginRedelegate.fromPartial({
          delegatorAddress: transaction.delegatorAddress,
          validatorSrcAddress: transaction.address,
          validatorDstAddress: transaction.validatorDstAddress,
          amount: {
            denom: "uc4e",
            amount: transaction.amount
          }
        })
      };
    }
    this.fee = {
      amount: [{
        denom: 'uc4e',
        amount: '0',
      }],
      gas: '2500000',
    };
  }
}

export class ClaimRewards{
  rewardMSG: any;
  constructor(delegator: string, validator:string, config: keplrModel) {
    this.rewardMSG={
      typeUrl: '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
      value: MsgWithdrawDelegatorReward.fromPartial({
        delegatorAddress: delegator,
        validatorAddress: validator,
      })
    }
  }
}

export class VoteMsg{
  votingMSG: any;
  fee: any;
  constructor(option: number, proposalId: number, delegator: string, config: keplrModel) {
      this.votingMSG = {
        typeUrl: '/cosmos.staking.v1beta1.MsgDelegate',
        value: MsgVote.fromPartial({
          option: option,
          proposalId,
          voter: delegator,
        }),
      };
    this.fee = {
      amount: [{
        denom: 'uc4e',
        amount: '0',
      }],
      gas: '2500000',
    };
  }
}
