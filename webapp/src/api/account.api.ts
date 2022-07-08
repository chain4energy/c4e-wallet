import {ServiceTypeEnum} from "@/services/logger/service-type.enum";
import TxBroadcastBaseApi, { TxData, TxBroadcastError } from "@/api/tx.broadcast.base.api";
import { ErrorData, BlockchainApiErrorData } from "@/api/base.api";

import { RequestResponse } from "@/models/request-response";
import { Account, balances } from "@/models/account";
import { useConfigurationStore } from "@/store/configuration.store";
import { ConnectionInfo } from "@/api/wallet.connecton.api";

import {
  MsgBeginRedelegate,
  MsgDelegate,
  MsgUndelegate,
} from "cosmjs-types/cosmos/staking/v1beta1/tx";
import { MsgVote } from "cosmjs-types/cosmos/gov/v1beta1/tx";
import {
  MsgWithdrawDelegatorReward
} from "cosmjs-types/cosmos/distribution/v1beta1/tx"
import { Validator } from "@/models/validator";

export class AccountApi extends TxBroadcastBaseApi {

  getServiceType(): ServiceTypeEnum {
    return ServiceTypeEnum.ACCOUNT_SERVICE;
  }

  //TODO: MS: move to global configuration service
  private ACCOUNT_URL = "https://lcd.chain4energy.org/cosmos/auth/v1beta1/accounts/";
  private BALANCE_URL = 'https://lcd.chain4energy.org/cosmos/bank/v1beta1/balances/';
  private STACKED_AMOUNT_URL = 'https://lcd.chain4energy.org/cosmos/staking/v1beta1/delegations/'
  private UNSTACKED_AMOUNT_URL = 'https://lcd.chain4energy.org/cosmos/staking/v1beta1/delegators/'
  private REWARDS_URL = 'https://lcd.chain4energy.org//cosmos/distribution/v1beta1/delegators/';

  public async fetchAccount(id: string): Promise<RequestResponse<Account, ErrorData<BlockchainApiErrorData>>> {
    return this.axiosBlockchainApiCall({
      method: 'GET',
      url: this.ACCOUNT_URL + id
    }, true, null);
  }
  public async fetchBalances(id: string): Promise<RequestResponse<balances, ErrorData<BlockchainApiErrorData>>>{
    return this.axiosBlockchainApiCall({
      method: 'GET',
      url: this.BALANCE_URL + id
    }, true, null)
  }
  public async fetchStackedTokens(id: string): Promise<RequestResponse<any, ErrorData<BlockchainApiErrorData>>>{
    return this.axiosBlockchainApiCall({
      method: 'GET',
      url: this.STACKED_AMOUNT_URL + id
    }, true, null)
  }
  public async fetchUnstackedTokens(id: string): Promise<RequestResponse<any, ErrorData<BlockchainApiErrorData>>>{
    return this.axiosBlockchainApiCall({
      method: 'GET',
      url: this.UNSTACKED_AMOUNT_URL + id + '/unbonding_delegations'
    }, true, null)
  }
  public async fetchRewards(id: string): Promise<RequestResponse<any, ErrorData<BlockchainApiErrorData>>>{
    return this.axiosBlockchainApiCall({
      method: 'GET',
      url: this.REWARDS_URL + id + '/rewards'
    }, true, null)
  }
  public async delegate(connection: ConnectionInfo, validator: string, amount: string): Promise<RequestResponse<TxData, TxBroadcastError>> {
    const config = useConfigurationStore().config
  
    const msg = {
      typeUrl: '/cosmos.staking.v1beta1.MsgDelegate',
      value: MsgDelegate.fromPartial({
        delegatorAddress: connection.account,
        validatorAddress: validator,
        amount: {
          denom: config.stakingDenom,
          amount: amount,
        }
      }),
    };
  
    const fee = this.createFee(config.operationGas.delegate, config.stakingDenom);
    return await this.signAndBroadcast(connection, [msg], fee, '', true, null);
  }
  
  public async undelegate(connection: ConnectionInfo, validator: string, amount: string): Promise<RequestResponse<TxData, TxBroadcastError>> {
    const config = useConfigurationStore().config
  
    const msg = {
      typeUrl: '/cosmos.staking.v1beta1.MsgUndelegate',
      value: MsgUndelegate.fromPartial({
        delegatorAddress: connection.account,
        validatorAddress: validator,
        amount: {
          denom: config.stakingDenom,
          amount: amount,
        }
      }),
    };
  
    const fee = this.createFee(config.operationGas.undelegate, config.stakingDenom);
    return await this.signAndBroadcast(connection, [msg], fee, '', true, null);
  }
  
  public async redelegate(connection: ConnectionInfo, validatorSrc: string, validatorDst: string, amount: string): Promise<RequestResponse<TxData, TxBroadcastError>> {
    const config = useConfigurationStore().config
  
    const msg = {
      typeUrl: '/cosmos.staking.v1beta1.MsgBeginRedelegate',
      value: MsgBeginRedelegate.fromPartial({
        delegatorAddress: connection.account,
        validatorSrcAddress: validatorSrc,
        validatorDstAddress: validatorDst,
        amount: {
          denom: config.stakingDenom,
          amount: amount,
        }
      }),
    };
    const fee = this.createFee(config.operationGas.redelegate, config.stakingDenom);
    return await this.signAndBroadcast(connection, [msg], fee, '', true, null);
  }
  
  public async vote(connection: ConnectionInfo, option: number, proposalId: number): Promise<RequestResponse<TxData, TxBroadcastError>> {
    const config = useConfigurationStore().config
  
    const msg = {
      typeUrl: '/cosmos.staking.v1beta1.MsgDelegate',
      value: MsgVote.fromPartial({
        option: option,
        proposalId,
        voter: connection.account,
      }),
    }
    const fee = this.createFee(config.operationGas.vote, config.stakingDenom);
    return await this.signAndBroadcast(connection, [msg], fee, '', true, null);
  }
  
  public async claimRewards(connection: ConnectionInfo, validators: Array<Validator>): Promise<RequestResponse<TxData, TxBroadcastError>> {
    const config = useConfigurationStore().config
  
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
  
    const fee = this.createFee(config.operationGas.claimRewards, config.stakingDenom);
    return await this.signAndBroadcast(connection, messages, fee, '', true, null);
  }
}
