import { setActivePinia, createPinia } from 'pinia'
import axios from 'axios';
import apiFactory from "@/api/factory.api";
import { useUserStore } from '@/store/user.store';
import { useConfigurationStore } from '@/store/configuration.store';
import { defaultDenom } from "../utils/common.blockchain.data.util";
import { createBaseAccountResponseData, createSingleBalanceResponseData} from '../utils/account.blockchain.data.util';
import { createDelegatorDelegationsResponseData, createDelegatorUnbondingDelegationsResponseData } from '../utils/staking.blockchain.data.util';
import { createRewardsResponseData } from '../utils/distribution.blockchain.data.util';

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;
apiFactory.setAxiosInstance(mockedAxios)

const denom = defaultDenom
const address = 'c4e13zg4u07ymq83uq73t2cq3dj54jj37zzgqfwjpg'

describe('get account', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    useConfigurationStore().config.stakingDenom = denom
  });

  // it('gets BaseAccount', async () => {
  //   const account = { data: createBaseAccountResponseData(address) };

  //   mockedAxios.request.mockResolvedValue(account);
  //   const result = await api.fetchAccount(address)
  //   expect(result.isError()).toBe(false)
  //   expect(result.isSuccess()).toBe(true)
  //   expect(result.error).toBeUndefined()
  //   expect(result.data?.address).toBe(address)
  //   expect(result.data?.type).toBe(AccountType.BaseAccount)
  //   expect(result.data?.continuousVestingData).toBeUndefined();

  // });

  it('connects as address', async () => {

    const balanceAmount = '49031887606805'
    const userStore = useUserStore();
    const account = { data: createBaseAccountResponseData(address) };
    const balance = { data: createSingleBalanceResponseData(denom, balanceAmount) };
    const rewards = { data: createRewardsResponseData() };
    const delegations = { data: createDelegatorDelegationsResponseData(address) };
    const undelegations = { data: createDelegatorUnbondingDelegationsResponseData(address) };

    mockedAxios.request.mockResolvedValueOnce(account);
    mockedAxios.request.mockResolvedValueOnce(balance);
    mockedAxios.request.mockResolvedValueOnce(rewards);
    mockedAxios.request.mockResolvedValueOnce(delegations);
    mockedAxios.request.mockResolvedValueOnce(undelegations);

    await userStore.connectAsAddress(address)


    // const result = await api.fetchAccount('c4e13zg4u07ymq83uq73t2cq3dj54jj37zzgqfwjpg')
    // expect(result.isError()).toBe(false)
    // expect(result.isSuccess()).toBe(true)
    // expect(result.error).toBeUndefined()
    // expect(result.data?.address).toBe('c4e13zg4u07ymq83uq73t2cq3dj54jj37zzgqfwjpg')
    // expect(result.data?.type).toBe(AccountType.BaseAccount)
    // expect(result.data?.continuousVestingData).toBeUndefined();

  });



});