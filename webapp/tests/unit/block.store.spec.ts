import { setActivePinia, createPinia } from 'pinia'
import { mockAxios } from '../utils/mock.util';
import { useSplashStore } from '@/store/splash.store';
import { createErrorResponse, defaultDenom } from '../utils/common.blockchain.data.util';
import { useConfigurationStore } from '@/store/configuration.store';
import { useBlockStore } from '@/store/block.store';
import { createBlockResponseData, expectBlock } from '../utils/block.blockchain.data.util';
import { useUserStore } from '@/store/user.store';
import { Account, AccountType, Coin, ContinuousVestingData } from '@/models/store/account';
import { ConnectionInfo, ConnectionType } from '@/api/wallet.connecton.api';

jest.mock("axios");
const mockedAxios = mockAxios();

describe('block store tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    useConfigurationStore().config.stakingDenom = defaultDenom;

  });

  afterEach(() => {
    expect(useSplashStore().splashCounter).toBe(0);
    mockedAxios.request.mockClear();
    mockedAxios.request.mockReset();
  });

  it('fetches staking pool - success', async () => {
    const blockStore = useBlockStore();
    const height = '123412';
    const time = "2022-07-21T13:47:25.833663575Z";

    const latestBlock = {
      data: createBlockResponseData(height, time)
    };

    mockedAxios.request.mockResolvedValueOnce(latestBlock);
    await blockStore.fetchLatestBlock();
    expectBlock(blockStore.getLatestBlock, height, time);
    expect(blockStore.getLatestBlockHeight).toBe(height);

  });

  it('fetches staking pool - error', async () => {
    const blockStore = useBlockStore();
    const validatorsError = createErrorResponse(404, 5, 'some error');
    mockedAxios.request.mockRejectedValueOnce(validatorsError);
    await blockStore.fetchLatestBlock();

    expectBlock(blockStore.getLatestBlock, '0', '0');
    expect(blockStore.getLatestBlockHeight).toBe('0');
  });

  it('calculates locked vesting - ContinuousVestingAccount', async () => {
    const address = 'c4e13zg4u07ymq83uq73t2cq3dj54jj37zzgqfwjpg';
    const userStore = useUserStore();
    userStore.logOut();

    const currentDate = new Date();
    const startTime = currentDate.getTime();
    const yearInMillis = 365*24*3600*1000;
    const endTime = startTime + yearInMillis;
    const amount = 1000000
    const origVesting = new Coin(amount.toString(), defaultDenom);
    const vestingData = new ContinuousVestingData(startTime.toString(), endTime.toString(), [origVesting]);

    userStore.connectionInfo = new ConnectionInfo(address, true, ConnectionType.Keplr);
    userStore.account = new Account(AccountType.ContinuousVestingAccount, address, vestingData);

    expect(userStore.getVestingLockAmount).toBe(0);

    const blockStore = useBlockStore();
    let height = 1232445;

    mockedAxios.request.mockResolvedValueOnce({ data: createBlockResponseData((height++).toString(), new Date(startTime-1000000).toISOString()) });
    await blockStore.fetchLatestBlock();
    expect(userStore.getVestingLockAmount).toBe(amount);

    mockedAxios.request.mockResolvedValueOnce({ data: createBlockResponseData((height++).toString(), new Date(startTime).toISOString()) });
    await blockStore.fetchLatestBlock();
    expect(userStore.getVestingLockAmount).toBe(amount);

    mockedAxios.request.mockResolvedValueOnce({ data: createBlockResponseData((height++).toString(), new Date(startTime+yearInMillis/4).toISOString()) });
    await blockStore.fetchLatestBlock();
    expect(userStore.getVestingLockAmount).toBe(amount - amount/4);

    mockedAxios.request.mockResolvedValueOnce({ data: createBlockResponseData((height++).toString(), new Date(startTime+yearInMillis/2).toISOString()) });
    await blockStore.fetchLatestBlock();
    expect(userStore.getVestingLockAmount).toBe(amount/2);

    mockedAxios.request.mockResolvedValueOnce({ data: createBlockResponseData((height++).toString(), new Date(startTime+yearInMillis-yearInMillis/4).toISOString()) });
    await blockStore.fetchLatestBlock();
    expect(userStore.getVestingLockAmount).toBe(amount/4);

    mockedAxios.request.mockResolvedValueOnce({ data: createBlockResponseData((height++).toString(), new Date(endTime).toISOString()) });
    await blockStore.fetchLatestBlock();
    expect(userStore.getVestingLockAmount).toBe(0);

    mockedAxios.request.mockResolvedValueOnce({ data: createBlockResponseData((height++).toString(), new Date(endTime+1000000).toISOString()) });
    await blockStore.fetchLatestBlock();
    expect(userStore.getVestingLockAmount).toBe(0);

  });

});

