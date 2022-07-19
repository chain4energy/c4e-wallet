import { setActivePinia, createPinia } from 'pinia'
import axios from 'axios';
import apiFactory from "@/api/factory.api";
import { useUserStore } from '@/store/user.store';
import { useConfigurationStore } from '@/store/configuration.store';
import { defaultDenom } from "../utils/common.blockchain.data.util";
import { createBaseAccountResponseData, createSingleBalanceResponseData, expectBaseAccount} from '../utils/account.blockchain.data.util';
import { createDelegatorDelegationsResponseData, createDelegatorUnbondingDelegationsResponseData, expectDelegatorDelegations, expectDelegatorUnbondingDelegations } from '../utils/staking.blockchain.data.util';
import { createRewardsResponseData, expectRewards } from '../utils/distribution.blockchain.data.util';
import { ConnectionInfo, ConnectionType } from '@/api/wallet.connecton.api';
import { expectAddressConnectionInfo } from '../utils/wallet.blockchain.data.util';

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

  // it('gets balance', async () => {

  //   // const fetchBalance = (stt as any).__get__('fetchBalance');
  //   const balanceAmount = '49031887606805'
  //   const userStore = useUserStore();
  //   const connectionInfo = new ConnectionInfo('fsafaf', true, ConnectionType.Keplr);
  //   const balance = { data: createSingleBalanceResponseData(denom, balanceAmount) };
  //   mockedAxios.request.mockResolvedValueOnce(balance);
  //   await fetchBalance(connectionInfo, userStore);
  //   expect(userStore.getBalance).toBe(Number(balanceAmount))

  // });

  it('connects as address', async () => {

    const balanceAmount = '49031887606805'
    const userStore = useUserStore();
    userStore.logOut();
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

    expectAddressConnectionInfo(userStore.connectionInfo, address)
    expect(userStore.getConnectionType).toBe(ConnectionType.Address)
    expectBaseAccount(userStore.getAccount, address);
    expect(userStore.getBalance).toBe(Number(balanceAmount))
    expectRewards(userStore.getRewardList);
    expectDelegatorDelegations(userStore.getDelegations)
    expectDelegatorUnbondingDelegations(userStore.getUndelegations);
    expect(userStore.isLoggedIn).toBe(true)
    expect(userStore.getVestingLockAmount).toBe(0)

  });



});