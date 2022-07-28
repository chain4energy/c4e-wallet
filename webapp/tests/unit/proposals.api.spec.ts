import { useSplashStore } from "@/store/splash.store";
import { createPinia, setActivePinia } from "pinia";
import apiFactory from "@/api/factory.api";
import axios from "axios";
import {
  createProposals,
  createProposalsResponseData,
  createTallyParamsResponseData,
  expectProposal,
  expectProposals,
  expectTallyParams
} from "../utils/proposal.blockchain.data.util";
import { mockAxios } from "../utils/mock.util";
import { axiosErrorMessagePrefix, createErrorResponse, defaultAxiosErrorName, defaultErrorName } from "../utils/common.blockchain.data.util";

const mockedAxios = mockAxios();
// const mockedAxios = axios as jest.Mocked<typeof axios>;
const api = apiFactory.proposalsApi()
jest.mock("axios");

describe('test proposals API', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  });
  afterEach(() => {
    expect(useSplashStore().splashCounter).toBe(0);
    mockedAxios.request.mockClear();
  });

  it('fetch request provided', async ()=> {
    const proposals = {
      data: createProposalsResponseData()
    };

    mockedAxios.request.mockResolvedValue(proposals);
    const result = await api.fetchProposals('1', false)
    expect(result.response.isError()).toBe(false)
    expect(result.response.isSuccess()).toBe(true)
    expect(result.response.error).toBeUndefined()

    expectProposals(result.response.data);
  });
  it('gets proposals - no proposals', async () => {
    const proposals = {
      data: createProposalsResponseData(new Array(), new Array())
    };

    mockedAxios.request.mockResolvedValue(proposals);
    const result = await  api.fetchProposals('1', false);
    expect(result.response.isError()).toBe(false);
    expect(result.response.isSuccess()).toBe(true);
    expect(result.response.error).toBeUndefined()
    expect(result.response.data?.proposals.length).toBe(0);
    expect(result.response.data?.numberOfActive).toBe(0);
  });


  it('fetch tally params', async ()=> {
    const quorum = 0.23432;
    const threshold = 0.987;
    const vetoThreshold = 0.3678
    const tally = {
      data: createTallyParamsResponseData(quorum.toString(), threshold.toString(), vetoThreshold.toString())
    };

    mockedAxios.request.mockResolvedValue(tally);
    const result = await api.fetchTallyParams(false)
    expect(result.isError()).toBe(false)
    expect(result.isSuccess()).toBe(true)
    expect(result.error).toBeUndefined()
    expect(result.data).not.toBeUndefined()
    if (result.data) {
      expectTallyParams(result.data, quorum, threshold, vetoThreshold);
    }
  });

  it('fetch tally params - wrong data', async ()=> {
    const tally = {
      data: {}
    };

    mockedAxios.request.mockResolvedValue(tally);
    const result = await api.fetchTallyParams(false)
    expect(result.isError()).toBe(true)
    expect(result.isSuccess()).toBe(false)
    expect(result.data).toBeUndefined()
    expect(result.error).not.toBeUndefined()
    expect(result.error?.name).toBe(defaultErrorName);
    expect(result.error?.message).toBe('mapTallyParams - tally params is undefined');
    expect(result.error?.data).toBeUndefined();
    
  });

  it('fetch tally params - wrong data', async ()=> {
    const errorMessage = 'rpc error: code = InvalidArgument desc = invalid address: decoding bech32 failed: invalid checksum (expected xq32ez got tg7pm3): invalid request';

    const status = 400;
    const error = createErrorResponse(status, 3, errorMessage);

    mockedAxios.request.mockRejectedValueOnce(error);
    const result = await api.fetchTallyParams(false)
    expect(result.isError()).toBe(true);
    expect(result.isSuccess()).toBe(false);
    expect(result.error?.name).toBe(defaultAxiosErrorName);
    expect(result.error?.message).toBe(axiosErrorMessagePrefix + status);
    expect(result.error?.data?.code).toBe(3);
    expect(result.error?.data?.message).toBe(errorMessage);
    
  });
});
