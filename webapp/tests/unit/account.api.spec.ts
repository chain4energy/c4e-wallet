import { setActivePinia, createPinia } from 'pinia'
import { AxiosResponse } from 'axios';
import { AccountType } from "@/models/store/account";
import apiFactory from "@/api/factory.api";
import { accountNotFoundErrorMessage, axiosError404Message, axiosErrorMessagePrefix, createAxiosError, createErrorResponse, createErrorResponseData, defaultAxiosErrorName, defaultDenom, defaultErrorName } from '../utils/common.blockchain.data.util';
import { createAddressNotExistsErrorResponse, createBaseAccountResponseData, createContinuousVestingAccountResponseData, createSingleBalanceResponseData, expectBaseAccount, expectContinuousVestingAccount } from '../utils/account.blockchain.data.util';
import { createDelegatorDelegationsResponseData, createDelegatorUnbondingDelegationsResponseData, expectDelegatorDelegations, expectDelegatorUnbondingDelegations } from '../utils/staking.blockchain.data.util';
import { createRewardsResponseData, defaultRewardsValidators, expectRewards } from '../utils/distribution.blockchain.data.util';

import { useConfigurationStore } from '@/store/configuration.store';
import { ConnectionInfo, ConnectionType } from '@/api/wallet.connecton.api';
import { DeliverTxResponse } from "@cosmjs/stargate";
import { StdFee } from "@cosmjs/amino";
import { EncodeObject } from "@cosmjs/proto-signing";
import {
  MsgBeginRedelegate,
  MsgDelegate,
  MsgUndelegate,
} from "cosmjs-types/cosmos/staking/v1beta1/tx";
import { MsgVote } from "cosmjs-types/cosmos/gov/v1beta1/tx";
import {
  MsgWithdrawDelegatorReward
} from "cosmjs-types/cosmos/distribution/v1beta1/tx"
import { RequestResponse } from '@/models/request-response';
import { TxBroadcastError, TxData } from '@/api/tx.broadcast.base.api';
import Long from 'long';
import { mockAxios, mockKeplr } from '../utils/mock.util';
import { useSplashStore } from '@/store/splash.store';
import { defaultGas, defaultMemo, defaultTxErrorResponse, defaultTxSuccessResponse, msgBeginRedelegateTypeUrl, msgDelegateTypeUrl, msgUndelegateTypeUrl, msgVoteTypeUrl, msgWithdrawDelegatorRewardTypeUrl } from '../utils/tx.broadcast.blockchain.data.util';
import { BigDecimal } from '@/models/store/big.decimal';
import { VoteOption } from '@/models/store/proposal';

jest.mock('axios', () => {
  return {
    create: jest.fn(() => ({
      get: jest.fn(),
      interceptors: {
        request: { use: jest.fn(), eject: jest.fn() },
        response: { use: jest.fn(), eject: jest.fn() }
      }
    })),
    request: jest.fn(),
    AxiosError: jest.fn()
  }
})
const mockedAxios = mockAxios();
const api = apiFactory.accountApi()

const mockedSigningStargateClient = mockKeplr().mockedSigningStargateClient

const address = 'c4e17svcuc8dt7gr4hlu3rmeu5u0jpc7snar3kdr55'
const validatorAddress = 'c4evaloperdwq987fwdqn9u2q09-h2d9ue'
const secondValidatorAddress = 'c4evaloperdwq987fwdqn9u2q09-h2d9ue'

const denom = defaultDenom;
const memo = defaultMemo

const gas = defaultGas;

const txSuccessResponse = defaultTxSuccessResponse;

const txErrorResponse = defaultTxErrorResponse;


describe('account api tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  });

  afterEach(() => {
    expect(useSplashStore().splashCounter).toBe(0);
    mockedAxios.request.mockClear();
    mockedAxios.request.mockReset();
  })

  it('gets BaseAccount', async () => {
    const account = {
      data: createBaseAccountResponseData(address)
    };

    mockedAxios.request.mockResolvedValue(account);
    const result = await api.fetchAccount(address, false)
    expect(result.isError()).toBe(false)
    expect(result.isSuccess()).toBe(true)
    expect(result.error).toBeUndefined()

    expectBaseAccount(result.data, address);
    // expect(result.data?.address).toBe(address)
    // expect(result.data?.type).toBe(AccountType.BaseAccount)
    // expect(result.data?.continuousVestingData).toBeUndefined();

  });

  it('gets ContinuousVestingAccount', async () => {
    const account = {
      data: createContinuousVestingAccountResponseData(address)
    };

    mockedAxios.request.mockResolvedValue(account);
    const result = await api.fetchAccount(address, false);
    expect(result.isError()).toBe(false);
    expect(result.isSuccess()).toBe(true);
    expect(result.error).toBeUndefined();
    expectContinuousVestingAccount(result.data, address);
  //   expect(result.data?.address).toBe(address);
  //   expect(result.data?.type).toBe(AccountType.ContinuousVestingAccount);
  //   expect(result.data?.continuousVestingData).toBeInstanceOf(ContinuousVestingData);
  //   expect(result.data?.continuousVestingData?.endTime).toBe(defaultContinuousVestingAccountEndTime + vestingAccountTimeToSystem);
  //   expect(result.data?.continuousVestingData?.startTime).toBe(defaultContinuousVestingAccountStartTime + vestingAccountTimeToSystem);
  //   expect(result.data?.continuousVestingData?.originalVesting.length).toBe(defaultContinuousVestingAccountOriginalVesting.length);
  //   const origVesting = result.data?.continuousVestingData?.originalVesting[0]
  //   expect(origVesting?.amount).toBe(defaultContinuousVestingAccountOriginalVesting[0].amount);
  //   expect(origVesting?.denom).toBe(defaultContinuousVestingAccountOriginalVesting[0].denom);
  });

  it('gets unexpected data', async () => {
    const account = [
      { id: 1, name: "John" },
      { id: 2, name: "Andrew" },
    ];
    mockedAxios.request.mockResolvedValue(account);
    const result = await api.fetchAccount(address, false);
    expect(result.isError()).toBe(true);
    expect(result.isSuccess()).toBe(false);
    expect(result.error?.name).toBe(defaultErrorName);
    expect(result.error?.message).toBe('Account is undefined');

  });

  it('gets unecpected data 2', async () => {
    const account = {
      status: 401,
      data: {
        accasfount: "afsdfadsadfs"
      }
    };
    mockedAxios.request.mockResolvedValue(account);
    const result = await api.fetchAccount(address, false);
    expect(result.isError()).toBe(true);
    expect(result.isSuccess()).toBe(false);
    expect(result.error?.name).toBe('Error');
    expect(result.error?.message).toBe('Account is undefined');
  });

  it('gets not existent address', async () => {
    const error = createAddressNotExistsErrorResponse();

    mockedAxios.request.mockRejectedValue(error);
    const result = await api.fetchAccount(address, false);
    expect(result.isError()).toBe(false)
    expect(result.isSuccess()).toBe(true)
    expect(result.error).toBeUndefined()
    expect(result.data?.address).toBe(address)
    expect(result.data?.type).toBe(AccountType.Nonexistent)
    expect(result.data?.continuousVestingData).toBeUndefined();
  });

  it('gets address with 404 response and error code 0', async () => {
    // const response = {
    //   data: createErrorResponseData(0, accountNotFoundErrorMessage),
    //   status: 404,
    //   statusText: '',
    // };
    // const error = createAxiosError(axiosError404Message, response as AxiosResponse);
    const error = createErrorResponse(404, 0, accountNotFoundErrorMessage);

    mockedAxios.request.mockRejectedValue(error);
    const result = await api.fetchAccount(address, false);
    expect(result.isError()).toBe(true);
    expect(result.isSuccess()).toBe(false);
    expect(result.error?.name).toBe(defaultAxiosErrorName);
    expect(result.error?.message).toBe(axiosError404Message);
    expect(result.error?.data?.code).toBe(0);
    expect(result.error?.data?.message).toBe(accountNotFoundErrorMessage);
  });

  it('gets address with 404 response and error messege <> NotFound', async () => {
    const errorMessage = 'some error message';
    // const response = {
    //   data: createErrorResponseData(5, errorMessage),
    //   status: 404,
    //   statusText: '',
    //   // headers: "AxiosResponseHeaders",
    // };
    // const error = createAxiosError(axiosError404Message, response as AxiosResponse);

    const error = createErrorResponse(404, 5, errorMessage);

    mockedAxios.request.mockRejectedValue(error);
    const result = await api.fetchAccount(address, false);
    expect(result.isError()).toBe(true);
    expect(result.isSuccess()).toBe(false);
    expect(result.error?.name).toBe(defaultAxiosErrorName);
    expect(result.error?.message).toBe(axiosError404Message);
    expect(result.error?.data?.code).toBe(5);
    expect(result.error?.data?.message).toBe(errorMessage);
  });

  it('gets address with not 404 response and error messege <> NotFound', async () => {
    // const axiosErrorMessage = axiosErrorMessagePrefix + '401';
    // const response = {
    //   data: createErrorResponseData(5, accountNotFoundErrorMessage),
    //   status: 401,
    //   statusText: '',
    //   // headers: "AxiosResponseHeaders",
    // };
    // const error = createAxiosError(axiosErrorMessage, response as AxiosResponse);
    const status = 401;
    const error = createErrorResponse(status, 5, accountNotFoundErrorMessage);
    mockedAxios.request.mockRejectedValue(error);
    const result = await api.fetchAccount(address, false);
    expect(result.isError()).toBe(true);
    expect(result.isSuccess()).toBe(false);
    expect(result.error?.name).toBe(defaultAxiosErrorName);
    expect(result.error?.message).toBe(axiosErrorMessagePrefix + status);
    expect(result.error?.data?.code).toBe(5);
    expect(result.error?.data?.message).toBe(accountNotFoundErrorMessage);
  });

  it('gets balance', async () => {
    const amount = 49031887606805n;
    const balance = {
      data: createSingleBalanceResponseData(denom, amount.toString())
    };

    mockedAxios.request.mockResolvedValue(balance);
    const result = await api.fetchBalance(address, denom, false)
    expect(result.isError()).toBe(false)
    expect(result.isSuccess()).toBe(true)
    expect(result.error).toBeUndefined()
    expect(result.data?.amount).toBe(amount)
    expect(result.data?.denom).toBe(denom)
  });

  it('gets balance with error', async () => {
    const errorMessage = 'rpc error: code = InvalidArgument desc = invalid address: decoding bech32 failed: invalid checksum (expected xq32ez got tg7pm3): invalid request';
    // const axiosErrorMessage = axiosErrorMessagePrefix + '400';

    // const response = {
    //   data: createErrorResponseData(3, errorMessage),
    //   status: 400,
    //   statusText: '',
    // };
    // const error = createAxiosError(axiosErrorMessage, response as AxiosResponse);

    const status = 400;
    const error = createErrorResponse(status, 3, errorMessage);

    mockedAxios.request.mockRejectedValue(error);
    const result = await api.fetchBalance(address, denom, false)
    expect(result.isError()).toBe(true);
    expect(result.isSuccess()).toBe(false);
    expect(result.error?.name).toBe(defaultAxiosErrorName);
    expect(result.error?.message).toBe(axiosErrorMessagePrefix + status);
    expect(result.error?.data?.code).toBe(3);
    expect(result.error?.data?.message).toBe(errorMessage);

  });

  it('gets delegator delegations - delegations exist', async () => {
    const delegations = {
      data: createDelegatorDelegationsResponseData(address)
    };

    mockedAxios.request.mockResolvedValue(delegations);
    const result = await api.fetchDelegations(address, false);
    expect(result.isError()).toBe(false);
    expect(result.isSuccess()).toBe(true);
    expect(result.error).toBeUndefined();
    expectDelegatorDelegations(result.data);
    // expect(result.data?.delegations.size).toBe(defaultDelegatorDelegationsValidators.length);
    // expect(result.data?.totalDelegated).toBe(findDelegatorDelegationTotalAmount());
    // defaultDelegatorDelegationsValidators.forEach(validatorAddress => {
    //   const delegation = result.data?.delegations.get(validatorAddress);
    //   expect(delegation?.amount).toBe(findDelegatorDelegationAmountByValidator(validatorAddress));
    //   expect(delegation?.validatorAddress).toBe(validatorAddress);
    // });
  });

  it('gets delegator delegations - no delegations', async () => {
    const delegations = {
      data: createDelegatorDelegationsResponseData(address, new Array(), new Array())
    };

    mockedAxios.request.mockResolvedValue(delegations);
    const result = await api.fetchDelegations(address, false)
    expect(result.isError()).toBe(false)
    expect(result.isSuccess()).toBe(true)
    expect(result.error).toBeUndefined()
    expect(result.data?.delegations.size).toBe(0);
    expect(result.data?.totalDelegated).toBe(0n);
  });

  it('gets delegator delegations paginated', async () => {
    const validators1 = [
      'c4evaloper1psaq0n2lzh84lzgh39kghuy0n256xltlg6yh4a',
      'c4evaloper1zwl9pd5mmn23mze2686494w9c2fyymxaqrhhl5',
      'c4evaloper1r2ennr6ywv567lks3q5gujt4def726fep2hpa8',
    ];
    const balances1 = [
      '100011000000',
      '98012949002',
      '100013000000',
    ];

    const validators2 = [
      'c4evaloper19473sdmlkkvcdh6z3tqedtqsdqj4jjv782dku2',
      'c4evaloper1tavkv9fpqwmw2v9drsm7s3yk7xlll9q8n7e6yl',
      'c4evaloper1e0ddzmhw2ze2glszkgjk6tfvcfzv68cmrg7euh',
    ];
    const balances2 = [
      '100014000000',
      '100015000000',
      '100016000000',
    ];

    const validatorsAll = validators1.concat(validators2)
    const balancesAll = balances1.concat(balances2)

    const delegations1 = {
      data: createDelegatorDelegationsResponseData(address, validators1, balances1, defaultDenom, 0, 'my_key')
    };
    const delegations2 = {
      data: createDelegatorDelegationsResponseData(address, validators2, balances2)
    };

    mockedAxios.request.mockResolvedValueOnce(delegations1);
    mockedAxios.request.mockResolvedValueOnce(delegations2);

    const result = await api.fetchDelegations(address, false);
    expect(result.isError()).toBe(false);
    expect(result.isSuccess()).toBe(true);
    expect(result.error).toBeUndefined();

    expectDelegatorDelegations(result.data, validatorsAll, balancesAll);
    // expect(result.data?.delegations.size).toBe(validatorsAll.length);
    // expect(result.data?.totalDelegated).toBe(findDelegatorDelegationTotalAmount(balancesAll));
    // validatorsAll.forEach(validatorAddress => {
    //   const delegation = result.data?.delegations.get(validatorAddress);
    //   expect(delegation?.amount).toBe(findDelegatorDelegationAmountByValidator(validatorAddress, validatorsAll, balancesAll));
    //   expect(delegation?.validatorAddress).toBe(validatorAddress);
    // });
  });

  it('gets delegator delegations with error', async () => {
    const errorMessage = 'rpc error: code = InvalidArgument desc = invalid address: decoding bech32 failed: invalid checksum (expected xq32ez got tg7pm3): invalid request';
    const axiosErrorMessage = axiosErrorMessagePrefix + '400';

    const response = {
      data: createErrorResponseData(3, errorMessage),
      status: 400,
      statusText: '',
    };
    const error = createAxiosError(axiosErrorMessage, response as AxiosResponse);

    mockedAxios.request.mockRejectedValue(error);
    const result = await api.fetchDelegations(address, false)
    expect(result.isError()).toBe(true);
    expect(result.isSuccess()).toBe(false);
    expect(result.error?.name).toBe(defaultAxiosErrorName);
    expect(result.error?.message).toBe(axiosErrorMessage);
    expect(result.error?.data?.code).toBe(3);
    expect(result.error?.data?.message).toBe(errorMessage);

  });

  it('gets delegator delegations paginated with error', async () => {
    const validators1 = [
      'c4evaloper1psaq0n2lzh84lzgh39kghuy0n256xltlg6yh4a',
      'c4evaloper1zwl9pd5mmn23mze2686494w9c2fyymxaqrhhl5',
      'c4evaloper1r2ennr6ywv567lks3q5gujt4def726fep2hpa8',
    ];
    const balances1 = [
      '100011000000',
      '98012949002',
      '100013000000',
    ];

    const errorMessage = 'rpc error: code = InvalidArgument desc = invalid address: decoding bech32 failed: invalid checksum (expected xq32ez got tg7pm3): invalid request';
    const axiosErrorMessage = axiosErrorMessagePrefix + '400';

    const response = {
      data: createErrorResponseData(3, errorMessage),
      status: 400,
      statusText: '',
    };
    const error = createAxiosError(axiosErrorMessage, response as AxiosResponse);

    const delegations1 = {
      data: createDelegatorDelegationsResponseData(address, validators1, balances1, defaultDenom, 0, 'my_key')
    };

    mockedAxios.request.mockResolvedValueOnce(delegations1);
    mockedAxios.request.mockRejectedValue(error);

    const result = await api.fetchDelegations(address, false)
    expect(result.isError()).toBe(true);
    expect(result.isSuccess()).toBe(false);
    expect(result.error?.name).toBe(defaultAxiosErrorName);
    expect(result.error?.message).toBe(axiosErrorMessage);
    expect(result.error?.data?.code).toBe(3);
    expect(result.error?.data?.message).toBe(errorMessage);
  });

  it('gets delegator unbonding delegations - delegations exist', async () => {
    const undelegations = {
      data: createDelegatorUnbondingDelegationsResponseData(address)
    };

    mockedAxios.request.mockResolvedValue(undelegations);
    const result = await api.fetchUnbondingDelegations(address, false)
    expect(result.isError()).toBe(false)
    expect(result.isSuccess()).toBe(true)
    expect(result.error).toBeUndefined()

    expectDelegatorUnbondingDelegations(result.data);
    // expect(result.data?.undelegations.size).toBe(defaultDelegatorUnbondingDelegationsValidators.length);
    // expect(result.data?.totalUndelegating).toBe(findDelegatorUnbondingDelegationTotalAmount());
    // defaultDelegatorUnbondingDelegationsValidators.forEach(validatorAddress => {
    //   const undelegation = result.data?.undelegations.get(validatorAddress);
    //   const validatorExpecedEntries = findDelegatorUnbondingDelegationAmountByValidator(validatorAddress);
    //   expect(undelegation?.entries.length).toBe(validatorExpecedEntries.length);
    //   for (let i = 0; i < validatorExpecedEntries.length; i++) {
    //     expect(undelegation?.entries[i].amount).toBe(validatorExpecedEntries[i]);

    //   }
    //   expect(undelegation?.validatorAddress).toBe(validatorAddress);
    // });
  });

  it('gets delegator unbonding delegations - no delegations', async () => {
    const undelegations = {
      data: createDelegatorUnbondingDelegationsResponseData(address, new Array(), new Array())
    };

    mockedAxios.request.mockResolvedValue(undelegations);
    const result = await api.fetchUnbondingDelegations(address, false)
    expect(result.isError()).toBe(false)
    expect(result.isSuccess()).toBe(true)
    expect(result.error).toBeUndefined()
    expect(result.data?.undelegations.size).toBe(0);
    expect(result.data?.totalUndelegating).toBe(0n);
  });

  it('gets delegator unbonding delegations paginated', async () => {
    const validators1 = [
      'c4evaloper1psaq0n2lzh84lzgh39kghuy0n256xltlg6yh4a',
      'c4evaloper1zwl9pd5mmn23mze2686494w9c2fyymxaqrhhl5',
      'c4evaloper1r2ennr6ywv567lks3q5gujt4def726fep2hpa8',
    ];
    const entries1 = [
      ['100011000000', '12312434'],
      ['98012949002', '356345'],
      ['100013000000', '345534'],
    ];

    const validators2 = [
      'c4evaloper19473sdmlkkvcdh6z3tqedtqsdqj4jjv782dku2',
      'c4evaloper1tavkv9fpqwmw2v9drsm7s3yk7xlll9q8n7e6yl',
      'c4evaloper1e0ddzmhw2ze2glszkgjk6tfvcfzv68cmrg7euh',
    ];
    const entries2 = [
      ['100014000000', '657765'],
      ['100015000000', '21234'],
      ['100016000000', '75632'],
    ];

    const validatorsAll = validators1.concat(validators2)
    const entiresAll = entries1.concat(entries2)

    const undelegations1 = {
      data: createDelegatorUnbondingDelegationsResponseData(address, validators1, entries1, 0, 'my_key')
    };
    const undelegations2 = {
      data: createDelegatorUnbondingDelegationsResponseData(address, validators2, entries2)
    };

    mockedAxios.request.mockResolvedValueOnce(undelegations1);
    mockedAxios.request.mockResolvedValueOnce(undelegations2);

    const result = await api.fetchUnbondingDelegations(address, false);
    expect(result.isError()).toBe(false);
    expect(result.isSuccess()).toBe(true);
    expect(result.error).toBeUndefined();
    expectDelegatorUnbondingDelegations(result.data, validatorsAll, entiresAll);


    // expect(result.data?.undelegations.size).toBe(validatorsAll.length);
    // expect(result.data?.totalUndelegating).toBe(findDelegatorUnbondingDelegationTotalAmount(entiresAll));
    // validatorsAll.forEach(validatorAddress => {
    //   const undelegation = result.data?.undelegations.get(validatorAddress);
    //   const validatorExpecedEntries = findDelegatorUnbondingDelegationAmountByValidator(validatorAddress, validatorsAll, entiresAll);
    //   expect(undelegation?.entries.length).toBe(validatorExpecedEntries.length);
    //   for (let i = 0; i < validatorExpecedEntries.length; i++) {
    //     expect(undelegation?.entries[i].amount).toBe(validatorExpecedEntries[i]);

    //   }
    //   expect(undelegation?.validatorAddress).toBe(validatorAddress);
    // });
  });

  it('gets delegator unbonding delegations with error', async () => {
    const errorMessage = 'rpc error: code = InvalidArgument desc = invalid address: decoding bech32 failed: invalid checksum (expected xq32ez got tg7pm3): invalid request';
    const axiosErrorMessage = axiosErrorMessagePrefix + '400';

    const response = {
      data: createErrorResponseData(3, errorMessage),
      status: 400,
      statusText: '',
    };
    const error = createAxiosError(axiosErrorMessage, response as AxiosResponse);

    mockedAxios.request.mockRejectedValue(error);
    const result = await api.fetchUnbondingDelegations(address, false);
    expect(result.isError()).toBe(true);
    expect(result.isSuccess()).toBe(false);
    expect(result.error?.name).toBe(defaultAxiosErrorName);
    expect(result.error?.message).toBe(axiosErrorMessage);
    expect(result.error?.data?.code).toBe(3);
    expect(result.error?.data?.message).toBe(errorMessage);

  });

  it('gets delegator unbonding delegations paginated with error', async () => {
    const validators1 = [
      'c4evaloper1psaq0n2lzh84lzgh39kghuy0n256xltlg6yh4a',
      'c4evaloper1zwl9pd5mmn23mze2686494w9c2fyymxaqrhhl5',
      'c4evaloper1r2ennr6ywv567lks3q5gujt4def726fep2hpa8',
    ];
    const entries1 = [
      ['100011000000', '12312434'],
      ['98012949002', '356345'],
      ['100013000000', '345534'],
    ];

    const errorMessage = 'rpc error: code = InvalidArgument desc = invalid address: decoding bech32 failed: invalid checksum (expected xq32ez got tg7pm3): invalid request';
    const axiosErrorMessage = axiosErrorMessagePrefix + '400';

    const response = {
      data: createErrorResponseData(3, errorMessage),
      status: 400,
      statusText: '',
    };
    const error = createAxiosError(axiosErrorMessage, response as AxiosResponse);

    const delegations1 = {
      data: createDelegatorUnbondingDelegationsResponseData(address, validators1, entries1, 0, 'my_key')
    };

    mockedAxios.request.mockResolvedValueOnce(delegations1);
    mockedAxios.request.mockRejectedValue(error);

    const result = await api.fetchUnbondingDelegations(address, false);
    expect(result.isError()).toBe(true);
    expect(result.isSuccess()).toBe(false);
    expect(result.error?.name).toBe(defaultAxiosErrorName);
    expect(result.error?.message).toBe(axiosErrorMessage);
    expect(result.error?.data?.code).toBe(3);
    expect(result.error?.data?.message).toBe(errorMessage);
  });

  it('gets delegator rewards - rewards exist', async () => {
    useConfigurationStore().config.stakingDenom = defaultDenom;
    const rewards = {
      data: createRewardsResponseData()
    };

    mockedAxios.request.mockResolvedValueOnce(rewards);
    const result = await api.fetchRewards(address, true);
    expect(result.isError()).toBe(false);
    expect(result.isSuccess()).toBe(true);
    expect(result.error).toBeUndefined();
    expectRewards(result.data);
  });

  it('gets delegator rewards - no rewards', async () => {
    useConfigurationStore().config.stakingDenom = defaultDenom;
    const rewards = {
      data: createRewardsResponseData(Array(), Array(), Array())
    };

    mockedAxios.request.mockResolvedValueOnce(rewards);
    const result = await api.fetchRewards(address, true);
    expect(result.isError()).toBe(false);
    expect(result.isSuccess()).toBe(true);
    expect(result.error).toBeUndefined();
    expect(result.data?.rewards.size).toBe(0);
    expect(result.data?.totalRewards).toStrictEqual(new BigDecimal(0));
  });

  it('gets delegator rewards with error', async () => {
    const errorMessage = 'rpc error: code = InvalidArgument desc = invalid address: decoding bech32 failed: invalid checksum (expected xq32ez got tg7pm3): invalid request';
    const axiosErrorMessage = axiosErrorMessagePrefix + '400';

    const response = {
      data: createErrorResponseData(3, errorMessage),
      status: 400,
      statusText: '',
    };
    const error = createAxiosError(axiosErrorMessage, response as AxiosResponse);

    mockedAxios.request.mockRejectedValue(error);
    const result = await api.fetchRewards(address, false);
    expect(result.isError()).toBe(true);
    expect(result.isSuccess()).toBe(false);
    expect(result.error?.name).toBe(defaultAxiosErrorName);
    expect(result.error?.message).toBe(axiosErrorMessage);
    expect(result.error?.data?.code).toBe(3);
    expect(result.error?.data?.message).toBe(errorMessage);

  });

  it('delegates using keplr', async () => {
    const amount = 12345;
    const action = () => {return api.delegate(new ConnectionInfo(address, true, ConnectionType.Keplr), validatorAddress, amount);}
    const signingMessage = await keplrTxSuccess(action);
    expectMsgDelegate(signingMessage, amount);
  });

  it('delegates using keplr with error', async () => {
    const amount = 12345;
    const action = () => {return api.delegate(new ConnectionInfo(address, true, ConnectionType.Keplr), validatorAddress, amount);}
    const signingMessage = await keplrTxError(action)
    expectMsgDelegate(signingMessage, amount);
  });

  it('undelegates using keplr', async () => {
    const amount = 12345;
    const action = () => {return api.undelegate(new ConnectionInfo(address, true, ConnectionType.Keplr), validatorAddress, amount);}
    const signingMessage = await keplrTxSuccess(action)
    expectMsgUndelegate(signingMessage, amount);
  });

  it('undelegates using keplr with error', async () => {
    const amount = 12345;
    const action = () => {return api.undelegate(new ConnectionInfo(address, true, ConnectionType.Keplr), validatorAddress, amount);}
    const signingMessage = await keplrTxError(action)
    expectMsgUndelegate(signingMessage, amount);
  });

  it('redelegates using keplr', async () => {
    const amount = 12345;
    const action = () => {return api.redelegate(new ConnectionInfo(address, true, ConnectionType.Keplr), validatorAddress, secondValidatorAddress, amount);}
    const signingMessage = await keplrTxSuccess(action)
    expectMsgBeginRedelegate(signingMessage, amount);
  });

  it('redelegates using keplr with error', async () => {
    const amount = 12345;
    const action = () => {return api.redelegate(new ConnectionInfo(address, true, ConnectionType.Keplr), validatorAddress, secondValidatorAddress, amount);}
    const signingMessage = await keplrTxError(action)
    expectMsgBeginRedelegate(signingMessage, amount);
  });

  it('votes using keplr', async () => {
    const proposalId = 342;
    const option = VoteOption.Abstain;
    const action = () => {return api.vote(new ConnectionInfo(address, true, ConnectionType.Keplr), option, proposalId);}
    const signingMessage = await keplrTxSuccess(action)
    expectMsgVote(signingMessage, option, proposalId);
  });

  it('votes using keplr with error', async () => {
    const proposalId = 213;
    const option = VoteOption.Yes;
    const action = () => {return api.vote(new ConnectionInfo(address, true, ConnectionType.Keplr), option, proposalId);}
    const signingMessage = await keplrTxError(action)
    expectMsgVote(signingMessage, option, proposalId);
  });

  it('claims rewards using keplr', async () => {
    const action = () => {return api.claimRewards(new ConnectionInfo(address, true, ConnectionType.Keplr), defaultRewardsValidators.values());}
    const signingMessage = await keplrTxSuccess(action)
    expectMsgWithdrawDelegatorReward(signingMessage, defaultRewardsValidators);
  });

  it('claims rewards using keplr with error', async () => {
    const action = () => {return api.claimRewards(new ConnectionInfo(address, true, ConnectionType.Keplr), defaultRewardsValidators.values());}
    const signingMessage = await keplrTxError(action)
    expectMsgWithdrawDelegatorReward(signingMessage, defaultRewardsValidators);
  });

  it('delegates using address', async () => {
    await delegateNoSigner(ConnectionType.Address);
  });

  it('delegates when disconnected', async () => {
    await delegateNoSigner(ConnectionType.Disconnected);
  });

  it('undelegates using address', async () => {
    await undelegateNoSigner(ConnectionType.Address);
  });

  it('undelegates when disconnected', async () => {
    await undelegateNoSigner(ConnectionType.Disconnected);
  });

  it('redelegates using address', async () => {
    await redelegateNoSigner(ConnectionType.Address);
  });

  it('redelegates when disconnected', async () => {
    await redelegateNoSigner(ConnectionType.Disconnected);
  });

  it('claims rewards using address', async () => {
    await claimRewardsNoSigner(ConnectionType.Address);
  });

  it('claims rewards when disconnected', async () => {
    await claimRewardsNoSigner(ConnectionType.Disconnected);
  });

  it('vote using address', async () => {
    await voteNoSigner(ConnectionType.Address);
  });

  it('vote when disconnected', async () => {
    await voteNoSigner(ConnectionType.Disconnected);
  });
});

async function delegateNoSigner(connectionType: ConnectionType) {
  const amount = 12345;
  const action = () => {return api.delegate(new ConnectionInfo(address, true, connectionType), validatorAddress, amount);}
  await txNoSigner(connectionType, action);
}

async function undelegateNoSigner(connectionType: ConnectionType) {
  const amount = 12345;
  const action = () => {return api.undelegate(new ConnectionInfo(address, true, connectionType), validatorAddress, amount);}
  await txNoSigner(connectionType, action);
}

async function redelegateNoSigner(connectionType: ConnectionType) {
  const amount = 12345;
  const action = () => {return api.redelegate(new ConnectionInfo(address, true, connectionType), validatorAddress, secondValidatorAddress, amount);}
  await txNoSigner(connectionType, action);
}

async function claimRewardsNoSigner(connectionType: ConnectionType) {
  const action = () => {return api.claimRewards(new ConnectionInfo(address, true, connectionType), defaultRewardsValidators.values());}
  await txNoSigner(connectionType, action);
}

async function voteNoSigner(connectionType: ConnectionType) {
  const action = () => {return api.vote(new ConnectionInfo(address, true, connectionType), 1, 1);}
  await txNoSigner(connectionType, action);
}

async function txNoSigner(connectionType: ConnectionType, action: () => Promise<RequestResponse<TxData, TxBroadcastError>>) {
  useConfigurationStore().config.stakingDenom = defaultDenom;
  useConfigurationStore().config.operationGas = gas;

  let signAndBroadcasExecutionsCounter = 0;
  const signAndBroadcastMock = async (signerAddress: string, messages: readonly EncodeObject[], fee: StdFee | "auto" | number, memo?: string): Promise<DeliverTxResponse> => {
    signAndBroadcasExecutionsCounter++;
    return txSuccessResponse;
  };
  mockedSigningStargateClient.signAndBroadcast.mockImplementation(signAndBroadcastMock);

  const response = await action();
  expect(signAndBroadcasExecutionsCounter).toBe(0);
  expect(response.isError()).toBe(true);
  expect(response.isSuccess()).toBe(false);
  expect(response.data).toBeUndefined();
  expect(response.error?.message).toBe('No signer for connnection type: ' + connectionType);
  expect(response.error?.txData).toBeUndefined();
}

async function keplrTest(action: () => Promise<RequestResponse<TxData, TxBroadcastError>>, txResponse: DeliverTxResponse) {
  useConfigurationStore().config.stakingDenom = defaultDenom;
  useConfigurationStore().config.operationGas = gas;

  const signingMessage = {
    signerAddress: undefined as string | undefined,
    messages: undefined as readonly EncodeObject[] | undefined,
    fee: undefined as StdFee | "auto" | number | undefined,
    memo: undefined as string | undefined
  };

  let signAndBroadcasExecutionsCounter = 0;
  const signAndBroadcastMock = async (signerAddress: string, messages: readonly EncodeObject[], fee: StdFee | "auto" | number, memo?: string): Promise<DeliverTxResponse> => {
    signingMessage.signerAddress = signerAddress;
    signingMessage.messages = messages;
    signingMessage.fee = fee;
    signingMessage.memo = memo;
    signAndBroadcasExecutionsCounter++;
    return txResponse;
  };
  mockedSigningStargateClient.signAndBroadcast.mockImplementation(signAndBroadcastMock);

  const response = await action();
  expect(signAndBroadcasExecutionsCounter).toBe(1);
  return {response, signingMessage};
}

async function keplrTxSuccess(action: () => Promise<RequestResponse<TxData, TxBroadcastError>>) {
  const { response, signingMessage }  = await keplrTest(action, txSuccessResponse);
  expect(response.isError()).toBe(false);
  expect(response.isSuccess()).toBe(true);
  expect(response.error).toBeUndefined();
  expect(response.data).not.toBeUndefined();
  expectTx(txSuccessResponse, response.data);
  return signingMessage;
}

async function keplrTxError(action: () => Promise<RequestResponse<TxData, TxBroadcastError>>) {
  const { response, signingMessage }  = await keplrTest(action, txErrorResponse);
  expect(response.isError()).toBe(true);
  expect(response.isSuccess()).toBe(false);
  expect(response.data).toBeUndefined();
  expect(response.error).not.toBeUndefined();
  expect(response.error?.message).not.toBeUndefined();
  expect(response.error?.message).toBe('Deliver tx failure');

  expect(response.error?.txData).not.toBeUndefined();
  expectTx(txErrorResponse, response.error?.txData)
  return signingMessage
}

function expectTx(expected: DeliverTxResponse, received?: TxData) {
  expect(received?.code).toBe(expected.code);
  expect(received?.gasUsed).toBe(expected.gasUsed);
  expect(received?.gasWanted).toBe(expected.gasWanted);
  expect(received?.height).toBe(expected.height);
  expect(received?.transactionHash).toBe(expected.transactionHash);
  expect(received?.rawLog).toBe(expected.rawLog);
}

function expectMsgDelegate(signingMessage: {
  signerAddress: string | undefined,
  messages: readonly EncodeObject[] | undefined,
  fee: StdFee | "auto" | number | undefined,
  memo: string | undefined
}, amount: number) {
  expectMessage<MsgDelegate>(signingMessage, gas.delegate, msgDelegateTypeUrl, [
    {
      amount: {
        amount: String(amount),
        denom: defaultDenom
      },
      delegatorAddress: address,
      validatorAddress: validatorAddress
    }
  ])
}

function expectMsgUndelegate(signingMessage: {
  signerAddress: string | undefined,
  messages: readonly EncodeObject[] | undefined,
  fee: StdFee | "auto" | number | undefined,
  memo: string | undefined
}, amount: number) {
  expectMessage<MsgUndelegate>(signingMessage, gas.undelegate, msgUndelegateTypeUrl, [
    {
      amount: {
        amount: String(amount),
        denom: defaultDenom
      },
      delegatorAddress: address,
      validatorAddress: validatorAddress
    }
  ])
}

function expectMsgBeginRedelegate(signingMessage: {
  signerAddress: string | undefined,
  messages: readonly EncodeObject[] | undefined,
  fee: StdFee | "auto" | number | undefined,
  memo: string | undefined
}, amount: number) {
  expectMessage<MsgBeginRedelegate>(signingMessage, gas.redelegate, msgBeginRedelegateTypeUrl, [
    {
      amount: {
        amount: String(amount),
        denom: defaultDenom
      },
      delegatorAddress: address,
      validatorSrcAddress: validatorAddress,
      validatorDstAddress: secondValidatorAddress
    }
  ])
}

function expectMsgVote(signingMessage: {
  signerAddress: string | undefined,
  messages: readonly EncodeObject[] | undefined,
  fee: StdFee | "auto" | number | undefined,
  memo: string | undefined
}, option: VoteOption, proposalId: number) {
  expectMessage<MsgVote>(signingMessage, gas.vote, msgVoteTypeUrl, [
    {
      option: option.valueOf(),
      proposalId: Long.fromNumber(proposalId),
      voter: address
    }
  ])
}

function expectMsgWithdrawDelegatorReward(signingMessage: {
  signerAddress: string | undefined,
  messages: readonly EncodeObject[] | undefined,
  fee: StdFee | "auto" | number | undefined,
  memo: string | undefined
}, validators: string[]) {
  const messages = new Array<MsgWithdrawDelegatorReward>()
  validators.forEach(v => messages.push({
    delegatorAddress: address,
    validatorAddress: v
  }))
  expectMessage<MsgWithdrawDelegatorReward>(signingMessage, gas.claimRewards, msgWithdrawDelegatorRewardTypeUrl, messages)
}

function expectMessage<M>(signingMessage: {
  signerAddress: string | undefined,
  messages: readonly EncodeObject[] | undefined,
  fee: StdFee | "auto" | number | undefined,
  memo: string | undefined
}, expectedGas: number, expectedMsgTypeUrl: string, expectedMessages: M[]) {
  expect(signingMessage.fee).toStrictEqual({ amount: [{ amount: "0", "denom": defaultDenom }], gas: expectedGas.toString() });
  expect(signingMessage.signerAddress).toBe(address);
  expect(signingMessage.memo).toBe(memo);
  expect(signingMessage.messages).not.toBe(undefined);
  expect(signingMessage.messages?.length).toBe(expectedMessages.length);
  if (signingMessage.messages === undefined) {
    throw new Error('signingMessage.messages === undefined')
  }
  for (let i = 0; i < expectedMessages.length ; i++) {
    const message = signingMessage.messages[i] as unknown as {
      typeUrl: string;
      value: M;
    };
    expect(message.typeUrl).toBe(expectedMsgTypeUrl);
    expect(message.value).toStrictEqual(expectedMessages[i]);

  }
}


