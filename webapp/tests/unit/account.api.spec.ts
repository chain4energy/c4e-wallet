import { setActivePinia, createPinia } from 'pinia'
import axios, { AxiosError, AxiosResponse } from 'axios';
import { AccountType, ContinuousVestingData } from "@/models/store/account";
import apiFactory from "@/api/factory.api";
import { accountNotFoundErrorMessage, axiosError404Message, axiosErrorMessagePrefix, createAxiosError, createBaseAccountResponseData, createContinuousVestingAccountResponseData, createDelegatorDelegationsResponseData, createDelegatorUnbondingDelegationsResponseData, createErrorResponseData, createRewardsResponseData, createSingleBalanceResponseData, defaultAxiosErrorName, defaultContinuousVestingAccountEndTime, defaultContinuousVestingAccountOriginalVesting, defaultContinuousVestingAccountStartTime, defaultDelegatorDelegationsValidators, defaultDelegatorUnbondingDelegationsValidators, defaultDenom, defaultErrorName, defaultRewardsTotal, defaultRewardsValidators, findDelegatorDelegationAmountByValidator, findDelegatorDelegationTotalAmount, findDelegatorUnbondingDelegationAmountByValidator, findDelegatorUnbondingDelegationTotalAmount, findRewardsByValidator, findTotalRewards, vestingAccountTimeToSystem } from '../utils/blockchain.data.util';
import { useConfigurationStore } from '@/store/configuration.store';

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;
const api = apiFactory.accountApi()
apiFactory.setAxiosInstance(mockedAxios)

const address = 'c4e17svcuc8dt7gr4hlu3rmeu5u0jpc7snar3kdr55'
const denom = defaultDenom

describe('account api tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  });

  afterEach(() => {
    mockedAxios.request.mockClear();
  })

  it('gets BaseAccount', async () => {
    const account = {
      data: createBaseAccountResponseData(address)
    };

    mockedAxios.request.mockResolvedValue(account);
    const result = await api.fetchAccount(address)
    expect(result.isError()).toBe(false)
    expect(result.isSuccess()).toBe(true)
    expect(result.error).toBeUndefined()
    expect(result.data?.address).toBe(address)
    expect(result.data?.type).toBe(AccountType.BaseAccount)
    expect(result.data?.continuousVestingData).toBeUndefined();

  });

  it('gets ContinuousVestingAccount', async () => {
    const account = {
      data: createContinuousVestingAccountResponseData(address)
    };

    mockedAxios.request.mockResolvedValue(account);
    const result = await api.fetchAccount(address);
    expect(result.isError()).toBe(false);
    expect(result.isSuccess()).toBe(true);
    expect(result.error).toBeUndefined();
    expect(result.data?.address).toBe(address);
    expect(result.data?.type).toBe(AccountType.ContinuousVestingAccount);
    expect(result.data?.continuousVestingData).toBeInstanceOf(ContinuousVestingData);
    expect(result.data?.continuousVestingData?.endTime).toBe(defaultContinuousVestingAccountEndTime + vestingAccountTimeToSystem);
    expect(result.data?.continuousVestingData?.startTime).toBe(defaultContinuousVestingAccountStartTime + vestingAccountTimeToSystem);
    expect(result.data?.continuousVestingData?.originalVesting.length).toBe(defaultContinuousVestingAccountOriginalVesting.length);
    const origVesting = result.data?.continuousVestingData?.originalVesting[0]
    expect(origVesting?.amount).toBe(defaultContinuousVestingAccountOriginalVesting[0].amount);
    expect(origVesting?.denom).toBe(defaultContinuousVestingAccountOriginalVesting[0].denom);
  });

  it('gets unecpected data', async () => {
    const account = [
      { id: 1, name: "John" },
      { id: 2, name: "Andrew" },
    ];
    mockedAxios.request.mockResolvedValue(account);
    const result = await api.fetchAccount(address);
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
    const result = await api.fetchAccount(address);
    expect(result.isError()).toBe(true);
    expect(result.isSuccess()).toBe(false);
    expect(result.error?.name).toBe('Error');
    expect(result.error?.message).toBe('Account is undefined');
  });

  it('gets not existent address', async () => {
    const response = {
      data: createErrorResponseData(5, accountNotFoundErrorMessage),
      status: 404,
      statusText: '',
    };
    const error = createAxiosError(axiosError404Message, response as AxiosResponse);

    mockedAxios.request.mockRejectedValue(error);
    const result = await api.fetchAccount(address);
    expect(result.isError()).toBe(false)
    expect(result.isSuccess()).toBe(true)
    expect(result.error).toBeUndefined()
    expect(result.data?.address).toBe(address)
    expect(result.data?.type).toBe(AccountType.Nonexistent)
    expect(result.data?.continuousVestingData).toBeUndefined();
  });

  it('gets address with 404 response and error code 0', async () => {
    const response = {
      data: createErrorResponseData(0, accountNotFoundErrorMessage),
      status: 404,
      statusText: '',
      // headers: "AxiosResponseHeaders",
    };
    const error = createAxiosError(axiosError404Message, response as AxiosResponse);

    mockedAxios.request.mockRejectedValue(error);
    const result = await api.fetchAccount(address);
    expect(result.isError()).toBe(true);
    expect(result.isSuccess()).toBe(false);
    expect(result.error?.name).toBe(defaultAxiosErrorName);
    expect(result.error?.message).toBe(axiosError404Message);
    expect(result.error?.data?.code).toBe(0);
    expect(result.error?.data?.message).toBe(accountNotFoundErrorMessage);
  });

  it('gets address with 404 response and error messege <> NotFound', async () => {
    const errorMessage = 'some error message';
    const response = {
      data: createErrorResponseData(5, errorMessage),
      status: 404,
      statusText: '',
      // headers: "AxiosResponseHeaders",
    };
    const error = createAxiosError(axiosError404Message, response as AxiosResponse);

    mockedAxios.request.mockRejectedValue(error);
    const result = await api.fetchAccount(address);
    expect(result.isError()).toBe(true);
    expect(result.isSuccess()).toBe(false);
    expect(result.error?.name).toBe(defaultAxiosErrorName);
    expect(result.error?.message).toBe(axiosError404Message);
    expect(result.error?.data?.code).toBe(5);
    expect(result.error?.data?.message).toBe(errorMessage);
  });

  it('gets address with not 404 response and error messege <> NotFound', async () => {
    const axiosErrorMessage = axiosErrorMessagePrefix + '401';
    const response = {
      data: createErrorResponseData(5, accountNotFoundErrorMessage),
      status: 401,
      statusText: '',
      // headers: "AxiosResponseHeaders",
    };
    const error = createAxiosError(axiosErrorMessage, response as AxiosResponse);

    mockedAxios.request.mockRejectedValue(error);
    const result = await api.fetchAccount(address);
    expect(result.isError()).toBe(true);
    expect(result.isSuccess()).toBe(false);
    expect(result.error?.name).toBe(defaultAxiosErrorName);
    expect(result.error?.message).toBe(axiosErrorMessage);
    expect(result.error?.data?.code).toBe(5);
    expect(result.error?.data?.message).toBe(accountNotFoundErrorMessage);
  });

  it('gets balance', async () => {
    const balance = {
      data: createSingleBalanceResponseData(denom, '49031887606805')
    };

    mockedAxios.request.mockResolvedValue(balance);
    const result = await api.fetchBalance(address, denom)
    expect(result.isError()).toBe(false)
    expect(result.isSuccess()).toBe(true)
    expect(result.error).toBeUndefined()
    expect(result.data?.amount).toBe('49031887606805')
    expect(result.data?.denom).toBe(denom)
  });

  it('gets balance with error', async () => {
    const errorMessage = 'rpc error: code = InvalidArgument desc = invalid address: decoding bech32 failed: invalid checksum (expected xq32ez got tg7pm3): invalid request';
    const axiosErrorMessage = axiosErrorMessagePrefix + '400';

    const response = {
      data: createErrorResponseData(3, errorMessage),
      status: 400,
      statusText: '',
      // headers: "AxiosResponseHeaders",
    };
    const error = createAxiosError(axiosErrorMessage, response as AxiosResponse);

    mockedAxios.request.mockRejectedValue(error);
    const result = await api.fetchBalance(address, denom)
    expect(result.isError()).toBe(true);
    expect(result.isSuccess()).toBe(false);
    expect(result.error?.name).toBe(defaultAxiosErrorName);
    expect(result.error?.message).toBe(axiosErrorMessage);
    expect(result.error?.data?.code).toBe(3);
    expect(result.error?.data?.message).toBe(errorMessage);
  
  });

  it('gets delegator delegations - delegations exist', async () => {
    const delegations = {
      data: createDelegatorDelegationsResponseData(address)
    };

    mockedAxios.request.mockResolvedValue(delegations);
    const result = await api.fetchDelegations(address)
    expect(result.isError()).toBe(false)
    expect(result.isSuccess()).toBe(true)
    expect(result.error).toBeUndefined()
    expect(result.data?.delegations.size).toBe(defaultDelegatorDelegationsValidators.length);
    expect(result.data?.totalDelegated).toBe(findDelegatorDelegationTotalAmount());
    defaultDelegatorDelegationsValidators.forEach(validatorAddress => {
      const delegation = result.data?.delegations.get(validatorAddress);
      expect(delegation?.amount).toBe(findDelegatorDelegationAmountByValidator(validatorAddress));
      expect(delegation?.validatorAddress).toBe(validatorAddress);
    });
  });

  it('gets delegator delegations - no delegations', async () => {
    const delegations = {
      data: createDelegatorDelegationsResponseData(address, new Array(), new Array())
    };

    mockedAxios.request.mockResolvedValue(delegations);
    const result = await api.fetchDelegations(address)
    expect(result.isError()).toBe(false)
    expect(result.isSuccess()).toBe(true)
    expect(result.error).toBeUndefined()
    expect(result.data?.delegations.size).toBe(0);
    expect(result.data?.totalDelegated).toBe(0);
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

    const result = await api.fetchDelegations(address)
    expect(result.isError()).toBe(false)
    expect(result.isSuccess()).toBe(true)
    expect(result.error).toBeUndefined()
    expect(result.data?.delegations.size).toBe(validatorsAll.length);
    expect(result.data?.totalDelegated).toBe(findDelegatorDelegationTotalAmount(balancesAll));
    validatorsAll.forEach(validatorAddress => {
      const delegation = result.data?.delegations.get(validatorAddress);
      expect(delegation?.amount).toBe(findDelegatorDelegationAmountByValidator(validatorAddress, validatorsAll, balancesAll));
      expect(delegation?.validatorAddress).toBe(validatorAddress);
    });
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
    const result = await api.fetchDelegations(address)
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

    const result = await api.fetchDelegations(address)
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
    const result = await api.fetchUnbondingDelegations(address)
    expect(result.isError()).toBe(false)
    expect(result.isSuccess()).toBe(true)
    expect(result.error).toBeUndefined()
    expect(result.data?.undelegations.size).toBe(defaultDelegatorUnbondingDelegationsValidators.length);
    expect(result.data?.totalUndelegating).toBe(findDelegatorUnbondingDelegationTotalAmount());
    defaultDelegatorUnbondingDelegationsValidators.forEach(validatorAddress => {
      const undelegation = result.data?.undelegations.get(validatorAddress);
      const validatorExpecedEntries = findDelegatorUnbondingDelegationAmountByValidator(validatorAddress);
      expect(undelegation?.entries.length).toBe(validatorExpecedEntries.length);
      for (let i = 0; i < validatorExpecedEntries.length; i++) {
        expect(undelegation?.entries[i].amount).toBe(validatorExpecedEntries[i]);

      }
      expect(undelegation?.validatorAddress).toBe(validatorAddress);
    });
  });

  it('gets delegator unbonding delegations - no delegations', async () => {
    const undelegations = {
      data: createDelegatorUnbondingDelegationsResponseData(address, new Array(), new Array())
    };

    mockedAxios.request.mockResolvedValue(undelegations);
    const result = await api.fetchUnbondingDelegations(address)
    expect(result.isError()).toBe(false)
    expect(result.isSuccess()).toBe(true)
    expect(result.error).toBeUndefined()
    expect(result.data?.undelegations.size).toBe(0);
    expect(result.data?.totalUndelegating).toBe(0);
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

    const result = await api.fetchUnbondingDelegations(address)
    expect(result.isError()).toBe(false)
    expect(result.isSuccess()).toBe(true)
    expect(result.error).toBeUndefined()
    expect(result.data?.undelegations.size).toBe(validatorsAll.length);
    expect(result.data?.totalUndelegating).toBe(findDelegatorUnbondingDelegationTotalAmount(entiresAll));
    validatorsAll.forEach(validatorAddress => {
      const undelegation = result.data?.undelegations.get(validatorAddress);
      const validatorExpecedEntries = findDelegatorUnbondingDelegationAmountByValidator(validatorAddress, validatorsAll, entiresAll);
      expect(undelegation?.entries.length).toBe(validatorExpecedEntries.length);
      for (let i = 0; i < validatorExpecedEntries.length; i++) {
        expect(undelegation?.entries[i].amount).toBe(validatorExpecedEntries[i]);

      }
      expect(undelegation?.validatorAddress).toBe(validatorAddress);
    });
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
    const result = await api.fetchUnbondingDelegations(address)
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

    const result = await api.fetchUnbondingDelegations(address)
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

    mockedAxios.request.mockResolvedValue(rewards);
    const result = await api.fetchRewards(address)
    expect(result.isError()).toBe(false)
    expect(result.isSuccess()).toBe(true)
    expect(result.error).toBeUndefined()
    expect(result.data?.rewards.size).toBe(defaultRewardsValidators.length);
    expect(result.data?.totalRewards).toBe(Number(findTotalRewards(defaultDenom).amount));
    defaultRewardsValidators.forEach(validatorAddress => {
      const reward = result.data?.rewards.get(validatorAddress);
      const expectedReward = findRewardsByValidator(validatorAddress);
      expect(reward?.rewards.length).toBe(expectedReward.length);
      for (let i = 0; i < expectedReward.length; i++) {
        expect(reward?.rewards[i].amount).toBe(expectedReward[i].amount);
        expect(reward?.rewards[i].denom).toBe(expectedReward[i].denom);
      }
      expect(reward?.validatorAddress).toBe(validatorAddress);
    });
  });

  it('gets delegator rewards - no rewards', async () => {
    const rewards = {
      data: createRewardsResponseData(new Array(), new Array())
    };

    mockedAxios.request.mockResolvedValue(rewards);
    const result = await api.fetchRewards(address)
    expect(result.isError()).toBe(false)
    expect(result.isSuccess()).toBe(true)
    expect(result.error).toBeUndefined()
    expect(result.data?.rewards.size).toBe(0);
    expect(result.data?.totalRewards).toBe(0);
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
    const result = await api.fetchRewards(address)
    expect(result.isError()).toBe(true);
    expect(result.isSuccess()).toBe(false);
    expect(result.error?.name).toBe(defaultAxiosErrorName);
    expect(result.error?.message).toBe(axiosErrorMessage);
    expect(result.error?.data?.code).toBe(3);
    expect(result.error?.data?.message).toBe(errorMessage);
  
  });
});

