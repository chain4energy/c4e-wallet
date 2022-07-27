import { setActivePinia, createPinia } from 'pinia'
import apiFactory from "@/api/factory.api";
import { mockAxios } from '../utils/mock.util';
import { useSplashStore } from '@/store/splash.store';
import { axiosErrorMessagePrefix, defaultAxiosErrorName, createErrorResponse as createBlockchainErrorResponse, defaultErrorName } from '../utils/common.blockchain.data.util';
import { createBlockResponseData, expectBlock } from '../utils/block.blockchain.data.util';
import { AverageBlockTimeResponse } from '@/models/hasura/average.block.time';
import { createAveragetBlockTimeResponseData } from '../utils/average.block.time.hasura.data.util';
import { createErrorResponse as createHasuraErrorResponse, createHasuraError, defaultHasuraErrorMessage, defaultHasuraErrorName } from '../utils/common.hasura.data.util';

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
    const height = 123412;
    const time = new Date("2022-07-21T13:47:25.833663575Z");

    const latestBlock = {
      data: createBlockResponseData(height.toString(), time.toISOString())
    };

    mockedAxios.request.mockResolvedValue(latestBlock);
    const result = await api.fetchLatestBlock(false);
    expect(result.isError()).toBe(false)
    expect(result.isSuccess()).toBe(true)
    expect(result.error).toBeUndefined()

    expectBlock(result.data, height, time);

  });

  it('gets latest block - error', async () => {
    const errorMessage = 'rpc error: code = InvalidArgument desc = invalid address: decoding bech32 failed: invalid checksum (expected xq32ez got tg7pm3): invalid request';

    const status = 400;
    const error = createBlockchainErrorResponse(status, 3, errorMessage);

    mockedAxios.request.mockRejectedValueOnce(error);
    const result = await api.fetchLatestBlock(false);
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
    const result = await api.fetchLatestBlock(false);
    expect(result.isError()).toBe(true);
    expect(result.isSuccess()).toBe(false);
    expect(result.error?.name).toBe(defaultErrorName);
    expect(result.error?.message).toBe('mapBlock - no height or time defined');
    expect(result.error?.data).toBeUndefined();
  });






  it('gets average block time - exists', async () => {
    const avgTime = 4.34332423243;
    const avgResp = {
      data: createAveragetBlockTimeResponseData(avgTime),
    };

    mockedAxios.request.mockResolvedValue(avgResp);
    const result = await api.fetchAverageBlockTime(false);
    expect(result.isError()).toBe(false)
    expect(result.isSuccess()).toBe(true)
    expect(result.error).toBeUndefined()

    expect(result.data).toBe(avgTime);


  });

  it('gets average block time - server error', async () => {

    const status = 400;
    const error = createHasuraErrorResponse(status);

    mockedAxios.request.mockRejectedValueOnce(error);
    const result = await api.fetchAverageBlockTime(false);
    expect(result.isError()).toBe(true);
    expect(result.isSuccess()).toBe(false);
    expect(result.error?.name).toBe(defaultAxiosErrorName);
    expect(result.error?.message).toBe(axiosErrorMessagePrefix + status);
    expect(result.error?.data).toBeUndefined();

  });

  it('gets average block time - hasura error', async () => {
    const errorMessage = 'my error message';
    const avgResp = {
      data: createHasuraError(errorMessage),
    };

    mockedAxios.request.mockResolvedValue(avgResp);
    const result = await api.fetchAverageBlockTime(false);
    expect(result.isError()).toBe(true);
    expect(result.isSuccess()).toBe(false);
    expect(result.data).toBeUndefined();
    expect(result.error).not.toBeUndefined();
    expect(result.error?.message).toBe(defaultHasuraErrorMessage);
    expect(result.error?.name).toBe(defaultHasuraErrorName);
    expect(result.error?.status).toBe(200);
    expect(result.error?.data?.errors).not.toBeUndefined();
    expect(result.error?.data?.errors.length).toBe(1);
    expect(result.error?.data?.errors[0].message).toBe(errorMessage);
    


  });

  it('gets average block time - bad data', async () => { 
    const latestBlock = {
      data: {}
    };

    mockedAxios.request.mockResolvedValue(latestBlock);
    const result = await api.fetchAverageBlockTime(false);
    expect(result.isError()).toBe(true);
    expect(result.isSuccess()).toBe(false);
    expect(result.error?.name).toBe(defaultErrorName);
    expect(result.error?.message).toBe('mapAverageBlockTime - no average block time defined or to many elements');
    expect(result.error?.data).toBeUndefined();
  });
});



