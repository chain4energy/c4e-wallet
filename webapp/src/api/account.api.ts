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
import { VoteOption as CosmVoteOption } from "cosmjs-types/cosmos/gov/v1beta1/gov";

import {
  MsgWithdrawDelegatorReward
} from "cosmjs-types/cosmos/distribution/v1beta1/tx"
import { DelegationsResponse, UnbondigDelegationsResponse } from "@/models/blockchain/staking";
import { Delegations, UnbondingDelegations } from "@/models/store/staking";
import { mapAndAddDelegations, mapAndAddUnbondingDelegations, mapDelegations, mapUnbondingDelegations } from "@/models/mapper/staking.mapper";
import { RewardsResponse } from "@/models/blockchain/distribution";
import { Rewards } from "@/models/store/distribution";
import { mapRewards } from "@/models/mapper/distribution.mapper";

export enum VoteOption {
  Yes = CosmVoteOption.VOTE_OPTION_YES,
  Abstain = CosmVoteOption.VOTE_OPTION_ABSTAIN,
  No = CosmVoteOption.VOTE_OPTION_NO,
  NoWithVeto = CosmVoteOption.VOTE_OPTION_NO_WITH_VETO,
}

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
    const mapData = (bcData: BalanceResponse | undefined) => {return mapBalance(bcData?.balance, denom);}
    return  await this.axiosGetBlockchainApiCall(this.BALANCE_URL + address + '/by_denom?denom=' + denom,
      mapData, true, null, 'fetchBalance - ')
  }

  public async fetchDelegations(address: string): Promise<RequestResponse<Delegations, ErrorData<BlockchainApiErrorData>>>{
    const mapData = (bcData: DelegationsResponse | undefined) => {return mapDelegations(bcData?.delegation_responses)}
    const mapAndAddData = (data: Delegations, bcData: DelegationsResponse | undefined) => {return mapAndAddDelegations(data, bcData?.delegation_responses)}

    return  await this.axiosGetBlockchainApiCallPaginated(this.STACKED_AMOUNT_URL + address,
            mapData, mapAndAddData, true, null, 'fetchDelegations - ')
  }
  public async fetchUnbondingDelegations(address: string): Promise<RequestResponse<UnbondingDelegations, ErrorData<BlockchainApiErrorData>>>{
    const mapData = (bcData: UnbondigDelegationsResponse | undefined) => {return mapUnbondingDelegations(bcData?.unbonding_responses)}
    const mapAndAddData = (data: UnbondingDelegations, bcData: UnbondigDelegationsResponse | undefined) => {return mapAndAddUnbondingDelegations(data, bcData?.unbonding_responses)}

    return  await this.axiosGetBlockchainApiCallPaginated(this.UNSTACKED_AMOUNT_URL + address + '/unbonding_delegations',
            mapData, mapAndAddData, true, null, 'fetchUnbondingDelegations - ')
  }
  public async fetchRewards(address: string): Promise<RequestResponse<Rewards, ErrorData<BlockchainApiErrorData>>>{
    const mapData = (bcData: RewardsResponse | undefined) => {return mapRewards(bcData);}
    return  await this.axiosGetBlockchainApiCall(this.REWARDS_URL + address + '/rewards',
      mapData, true, null, 'fetchRewards - ')
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
  
  // TODO proposalId as Long
  public async vote(connection: ConnectionInfo, option: VoteOption, proposalId: number): Promise<RequestResponse<TxData, TxBroadcastError>> {
    this.logToConsole(LogLevel.DEBUG, 'vote', String(option), String(proposalId));

    const config = useConfigurationStore().config
  
    const msg = {
      typeUrl: '/cosmos.gov.v1beta1.MsgVote',
      value: MsgVote.fromPartial({
        option: option.valueOf(),
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
