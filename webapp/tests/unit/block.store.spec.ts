import { setActivePinia, createPinia } from 'pinia'
import { mockAxios } from '../utils/mock.util';
import { useSplashStore } from '@/store/splash.store';
import { createErrorResponse, defaultDenom } from '../utils/common.blockchain.data.util';
import { useConfigurationStore } from '@/store/configuration.store';
import { useBlockStore } from '@/store/block.store';
import { createBlockResponseData, expectBlock } from '../utils/block.blockchain.data.util';
import { useUserStore } from '@/store/user.store';
import { Account, AccountType, ContinuousVestingData } from '@/models/store/account';
import { Coin } from '@/models/store/common';
import { ConnectionInfo, ConnectionType } from '@/api/wallet.connecton.api';
import { createAveragetBlockTimeResponseData } from '../utils/average.block.time.hasura.data.util';

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

  it('fetches latest block - success', async () => {
    const blockStore = useBlockStore();
    const height = 123412;
    const time = new Date("2022-07-21T13:47:25.833663575Z");

    const latestBlock = {
      data: createBlockResponseData(height.toString(), time.toISOString())
    };

    mockedAxios.request.mockResolvedValueOnce(latestBlock);
    await blockStore.fetchLatestBlock();
    expectBlock(blockStore.getLatestBlock, height, time);
    expect(blockStore.getLatestBlockHeight).toBe(height);

  });

  it('fetches latest block - error', async () => {
    const blockStore = useBlockStore();
    const validatorsError = createErrorResponse(404, 5, 'some error');
    mockedAxios.request.mockRejectedValueOnce(validatorsError);
    await blockStore.fetchLatestBlock();

    expectBlock(blockStore.getLatestBlock, 0, new Date(0));
    expect(blockStore.getLatestBlockHeight).toBe(0);
  });

  it('fetches average block time - success', async () => {
    const blockStore = useBlockStore();
    const avgTime = 4.34332423243;
    const avgResp = {
      data: createAveragetBlockTimeResponseData(avgTime),
    };

    mockedAxios.request.mockResolvedValue(avgResp);
    await blockStore.fetchAverageBlockTime();
    expect(blockStore.getAverageBlockTime).toBe(avgTime);

  });

  it('fetches average block time - error', async () => {
    const blockStore = useBlockStore();
    const validatorsError = createErrorResponse(404, 5, 'some error');
    mockedAxios.request.mockRejectedValueOnce(validatorsError);
    await blockStore.fetchAverageBlockTime();

    expect(blockStore.getAverageBlockTime).toBe(Number.NaN);
  });

  it('calculates locked vesting - ContinuousVestingAccount', async () => {
    const address = 'c4e13zg4u07ymq83uq73t2cq3dj54jj37zzgqfwjpg';
    const userStore = useUserStore();
    userStore.logOut();

    const currentDate = new Date();
    const startTime = currentDate.getTime();
    const yearInMillis = 365*24*3600*1000;
    const endTime = startTime + yearInMillis;
    const amount = 1000000n
    const origVesting = new Coin(BigInt(amount), defaultDenom);
    const vestingData = new ContinuousVestingData(new Date(startTime), new Date(endTime), [origVesting]);

    userStore.connectionInfo = new ConnectionInfo(address, true, ConnectionType.Keplr);
    userStore.account = new Account(AccountType.ContinuousVestingAccount, address, vestingData);

    expect(userStore.getVestingLockAmount).toBe(0n);

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
    expect(userStore.getVestingLockAmount).toBe(amount - amount/4n);

    mockedAxios.request.mockResolvedValueOnce({ data: createBlockResponseData((height++).toString(), new Date(startTime+yearInMillis/2).toISOString()) });
    await blockStore.fetchLatestBlock();
    expect(userStore.getVestingLockAmount).toBe(amount/2n);

    mockedAxios.request.mockResolvedValueOnce({ data: createBlockResponseData((height++).toString(), new Date(startTime+yearInMillis-yearInMillis/4).toISOString()) });
    await blockStore.fetchLatestBlock();
    expect(userStore.getVestingLockAmount).toBe(amount/4n);

    mockedAxios.request.mockResolvedValueOnce({ data: createBlockResponseData((height++).toString(), new Date(endTime).toISOString()) });
    await blockStore.fetchLatestBlock();
    expect(userStore.getVestingLockAmount).toBe(0n);

    mockedAxios.request.mockResolvedValueOnce({ data: createBlockResponseData((height++).toString(), new Date(endTime+1000000).toISOString()) });
    await blockStore.fetchLatestBlock();
    expect(userStore.getVestingLockAmount).toBe(0n);

    console.log('sdfdsfsdfsfd: ' + amount/4n)
  });

});

