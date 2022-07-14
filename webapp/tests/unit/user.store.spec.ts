import { setActivePinia, createPinia } from 'pinia'
import axios, { AxiosError, AxiosInstance, AxiosResponse, AxiosResponseHeaders } from 'axios';
import { AccountApi } from "@/api/account.api";
import { AccountType, ContinuousVestingData } from "@/models/store/account";
import apiFactory from "@/api/factory.api";
import { useUserStore } from '@/store/user.store';
import { useConfigurationStore } from '@/store/configuration.store';
import { createBaseAccountResponse, createDelegationsResponse, createRewardsResponse, createSingleBalanceResponse, createUnbondingDelegationsResponse, defaultDenom } from '../utils/blockchain.data.util';

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;
apiFactory.setAxiosInstance(mockedAxios)
// const api = new AccountApi(() => mockedAxios)

// beforeAll(() => {
//   mockedAxios.create.mockReturnValue(mockedAxios);
// });

const denom = defaultDenom
const address = 'c4e13zg4u07ymq83uq73t2cq3dj54jj37zzgqfwjpg'

describe('get account', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    useConfigurationStore().config.stakingDenom = denom
  });

  it('connects to address', async () => {

    const balanceAmount = '49031887606805'
    const userStore = useUserStore();
    const account = { data: createBaseAccountResponse(address) };
    const balance = { data: createSingleBalanceResponse(denom, balanceAmount) };
    const rewards = { data: createRewardsResponse() };
    const delegations = { data: createDelegationsResponse() };
    const undelegations = { data: createUnbondingDelegationsResponse() };

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