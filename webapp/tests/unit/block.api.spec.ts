import { setActivePinia, createPinia } from 'pinia'
import apiFactory from "@/api/factory.api";
import { mockAxios } from '../utils/mock.util';
import { useSplashStore } from '@/store/splash.store';
import { axiosErrorMessagePrefix, defaultAxiosErrorName, createErrorResponse, defaultErrorName } from '../utils/common.blockchain.data.util';
import { createBlockResponseData, expectBlock } from '../utils/block.blockchain.data.util';

jest.mock("axios");
const mockedAxios = mockAxios();
const api = apiFactory.blockApi()

describe('block api tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  });

  afterEach(() => {
    expect(useSplashStore().splashCounter).toBe(0);
    mockedAxios.request.mockClear();
  })

  it('gets latest block - exists', async () => {
    const height = '123412';
    const time = "2022-07-21T13:47:25.833663575Z";

    const latestBlock = {
      data: createBlockResponseData(height, time)
    };

    mockedAxios.request.mockResolvedValue(latestBlock);
    const result = await api.fetchLatestBlock();
    expect(result.isError()).toBe(false)
    expect(result.isSuccess()).toBe(true)
    expect(result.error).toBeUndefined()

    expectBlock(result.data, height, time);

  });

  it('gets latest block - error', async () => {
    const errorMessage = 'rpc error: code = InvalidArgument desc = invalid address: decoding bech32 failed: invalid checksum (expected xq32ez got tg7pm3): invalid request';

    const status = 400;
    const error = createErrorResponse(status, 3, errorMessage);

    mockedAxios.request.mockRejectedValueOnce(error);
    const result = await api.fetchLatestBlock();
    expect(result.isError()).toBe(true);
    expect(result.isSuccess()).toBe(false);
    expect(result.error?.name).toBe(defaultAxiosErrorName);
    expect(result.error?.message).toBe(axiosErrorMessagePrefix + status);
    expect(result.error?.data?.code).toBe(3);
    expect(result.error?.data?.message).toBe(errorMessage);

  });

  it('gets latest block - bad data', async () => { 
    const latestBlock = {
      data: {}
    };

    mockedAxios.request.mockResolvedValue(latestBlock);
    const result = await api.fetchLatestBlock();
    expect(result.isError()).toBe(true);
    expect(result.isSuccess()).toBe(false);
    expect(result.error?.name).toBe(defaultErrorName);
    expect(result.error?.message).toBe('mapBlock - no height or time defined');
    expect(result.error?.data).toBeUndefined();
  });

});



