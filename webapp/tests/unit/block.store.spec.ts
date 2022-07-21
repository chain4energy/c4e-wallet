import { setActivePinia, createPinia } from 'pinia'
import { mockAxios } from '../utils/mock.util';
import { useSplashStore } from '@/store/splash.store';
import { createErrorResponse, defaultDenom, expectCoin } from '../utils/common.blockchain.data.util';
import { useTokensStore } from '@/store/tokens.store';
import { createCommunityPoolResponseData, createStakingPoolResponseData, createSupplyResponseData, expectStakingPool } from '../utils/tokens.blockchain.data.util';
import { useConfigurationStore } from '@/store/configuration.store';
import { useBlockStore } from '@/store/block.store';
import { createBlockResponseData, expectBlock } from '../utils/block.blockchain.data.util';

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

 // TODO vesting check tests
});

