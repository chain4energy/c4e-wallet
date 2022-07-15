import {ServiceTypeEnum} from "@/services/logger/service-type.enum";
import TxBroadcastBaseApi, { TxData, TxBroadcastError } from "@/api/tx.broadcast.base.api";
import { ErrorData, BlockchainApiErrorData } from "@/api/base.api";
import { LogLevel } from '@/services/logger/log-level';

import { RequestResponse } from "@/models/request-response";
import { Account as StoreAccount, Coin} from "@/models/store/account";
import { AccountResponse, BalanceResponse} from "@/models/blockchain/account";

import { useConfigurationStore } from "@/store/configuration.store";
import { ConnectionInfo } from "@/api/wallet.connecton.api";
import { mapAccount, createNonexistentAccount, mapBalance } from "@/models/mapper/account.mapper";

import {
  MsgBeginRedelegate,
  MsgDelegate,
  MsgUndelegate,
} from "cosmjs-types/cosmos/staking/v1beta1/tx";
import { MsgVote } from "cosmjs-types/cosmos/gov/v1beta1/tx";
import {
  MsgWithdrawDelegatorReward
} from "cosmjs-types/cosmos/distribution/v1beta1/tx"
import { DelegationsResponse, UnbondigDelegationsResponse } from "@/models/blockchain/staking";
import { Delegations, UnbondingDelegations } from "@/models/store/staking";
import { mapAndAddDelegations, mapAndAddUnbondingDelegations, mapDelegations, mapUnbondingDelegations } from "@/models/mapper/staking.mapper";
import { RewardsResponse } from "@/models/blockchain/distribution";
import { Rewards } from "@/models/store/distribution";
import { mapRewards } from "@/models/mapper/distribution.mapper";

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

  public async fetchAccount(address: string): Promise<RequestResponse<StoreAccount, ErrorData<BlockchainApiErrorData>>> {
    const result: RequestResponse<AccountResponse, ErrorData<BlockchainApiErrorData>> =  await this.axiosBlockchainApiCall({
      method: 'GET',
      url: this.ACCOUNT_URL + address
    }, true, null, 'fetchAccount - ');
    if (result.isSuccess()) {
      this.logToConsole(LogLevel.DEBUG, 'get Account success');

      try {
        const storeAccount = mapAccount(result.data?.account);
        return new RequestResponse<StoreAccount, ErrorData<BlockchainApiErrorData>>(undefined, storeAccount);
      } catch (err) {
        const error = err as Error;
        this.logToConsole(LogLevel.ERROR, 'mapAccount error: ', error.message);
        return new RequestResponse<StoreAccount, ErrorData<BlockchainApiErrorData>>(new ErrorData<BlockchainApiErrorData>(error.name, error.message));
      }
    } else {
      const code = result.error?.data?.code
      const message = result.error?.data?.message
      const status = result.error?.status
      if (status === 404 && code === 5 && message !== undefined && /rpc error: code = NotFound/i.test(message)) {
        return new RequestResponse<StoreAccount, ErrorData<BlockchainApiErrorData>>(undefined, createNonexistentAccount(address));
      }
      return new RequestResponse<StoreAccount, ErrorData<BlockchainApiErrorData>>(result.error);
    }
  }
  public async fetchBalance(address: string, denom: string): Promise<RequestResponse<Coin, ErrorData<BlockchainApiErrorData>>>{
    const result: RequestResponse<BalanceResponse, ErrorData<BlockchainApiErrorData>> =  await this.axiosBlockchainApiCall({
      method: 'GET',
      url: this.BALANCE_URL + address + '/by_denom?denom=' + denom
    }, true, null, 'fetchBalance - ')
    if (result.isError()) {
      return new RequestResponse<Coin, ErrorData<BlockchainApiErrorData>>(result.error);
    }
    const coin = mapBalance(result.data?.balance, denom);
    return new RequestResponse<Coin, ErrorData<BlockchainApiErrorData>>(undefined, coin);
  }
  public async fetchDelegations(address: string): Promise<RequestResponse<Delegations, ErrorData<BlockchainApiErrorData>>>{
    let delegations: Delegations | undefined = undefined;
    let nextKey: string | null | undefined = undefined
    do {
      const result: RequestResponse<DelegationsResponse, ErrorData<BlockchainApiErrorData>>
          = await this.fetchBcDelegations(address, delegations !== undefined, nextKey);
      if (result.isError()) {
        return new RequestResponse<Delegations, ErrorData<BlockchainApiErrorData>>(result.error);
      }
      nextKey = result.data?.pagination.next_key
      if (delegations === undefined) {
        delegations = mapDelegations(result.data?.delegation_responses);
      } else {
        delegations = mapAndAddDelegations(delegations, result.data?.delegation_responses);
      }
    } while (delegations === undefined || (nextKey !== null && nextKey !== undefined));
    return new RequestResponse<Delegations, ErrorData<BlockchainApiErrorData>>(undefined, delegations);
  }
  private async fetchBcDelegations(address: string, pagination: boolean, nextKey: string | null | undefined): Promise<RequestResponse<DelegationsResponse, ErrorData<BlockchainApiErrorData>>> {
    let url = this.STACKED_AMOUNT_URL + address
    if (pagination) {
      url += '?pagination.key=' + nextKey
    }
    const result: RequestResponse<DelegationsResponse, ErrorData<BlockchainApiErrorData>> = await this.axiosBlockchainApiCall({
      method: 'GET',
      url: url
    }, true, null, 'fetchDelegations - ');
    return result;
  }
  public async fetchUnbondingDelegations(address: string): Promise<RequestResponse<UnbondingDelegations, ErrorData<BlockchainApiErrorData>>>{
    let undelegations: UnbondingDelegations | undefined = undefined;
    let nextKey: string | null | undefined = undefined
    do {
      const result: RequestResponse<UnbondigDelegationsResponse, ErrorData<BlockchainApiErrorData>>
          = await this.fetchBcUnbondingDelegations(address, undelegations !== undefined, nextKey);
      if (result.isError()) {
        return new RequestResponse<UnbondingDelegations, ErrorData<BlockchainApiErrorData>>(result.error);
      }
      nextKey = result.data?.pagination.next_key
      if (undelegations === undefined) {
        undelegations = mapUnbondingDelegations(result.data?.unbonding_responses);
      } else {
        undelegations = mapAndAddUnbondingDelegations(undelegations, result.data?.unbonding_responses);
      }
    } while (undelegations === undefined || (nextKey !== null && nextKey !== undefined));
    return new RequestResponse<UnbondingDelegations, ErrorData<BlockchainApiErrorData>>(undefined, undelegations);
  }
  private async fetchBcUnbondingDelegations(address: string, pagination: boolean, nextKey: string | null | undefined): Promise<RequestResponse<UnbondigDelegationsResponse, ErrorData<BlockchainApiErrorData>>> {
    let url = this.UNSTACKED_AMOUNT_URL + address + '/unbonding_delegations'
    if (pagination) {
      url += '?pagination.key=' + nextKey
    }
    const result: RequestResponse<UnbondigDelegationsResponse, ErrorData<BlockchainApiErrorData>> = await this.axiosBlockchainApiCall({
      method: 'GET',
      url: url
    }, true, null, 'fetchUnbondingDelegations - ')
    return result;
  }
  public async fetchRewards(id: string): Promise<RequestResponse<Rewards, ErrorData<BlockchainApiErrorData>>>{
    const result: RequestResponse<RewardsResponse, ErrorData<BlockchainApiErrorData>> = await this.axiosBlockchainApiCall({
      method: 'GET',
      url: this.REWARDS_URL + id + '/rewards'
    }, true, null, 'fetchRewards - ')
    if (result.isError()) {
      return new RequestResponse<Rewards, ErrorData<BlockchainApiErrorData>>(result.error);
    }
    const rewards = mapRewards(result.data);
    return new RequestResponse<Rewards, ErrorData<BlockchainApiErrorData>>(undefined, rewards);
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

  public async claimRewards(connection: ConnectionInfo, validatorsAddresses: IterableIterator<string>): Promise<RequestResponse<TxData, TxBroadcastError>> {
    const config = useConfigurationStore().config

    const messages = []
    for (const validator of validatorsAddresses) {
      const msg = {
        typeUrl: '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
        value: MsgWithdrawDelegatorReward.fromPartial({
          delegatorAddress: connection.account,
          validatorAddress: validator,
        })
      }
      messages.push(msg)
    }

    if (messages.length === 0) {
      return new RequestResponse<TxData, TxBroadcastError>(new TxBroadcastError('No rewards to claim'));
    }

    const fee = this.createFee(config.operationGas.claimRewards, config.stakingDenom);
    return await this.signAndBroadcast(connection, messages, fee, '', true, null);
  }
}
