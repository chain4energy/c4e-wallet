import { useSplashStore } from "@/store/splash.store";
import { createPinia, setActivePinia } from "pinia";
import apiFactory from "@/api/factory.api";
import axios from "axios";
import {
  createProposals,
  createProposalsResponseData,
  expectProposal,
  expectProposals
} from "../utils/proposal.blockchain.data.util";
jest.mock("axios");
export function addAxios() {
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  apiFactory.setAxiosInstance(mockedAxios);
  return mockedAxios;
}

describe('test proposals API', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  });
  afterEach(() => {
    expect(useSplashStore().splashCounter).toBe(0);
    addAxios().request.mockClear();
  });

  it('fetch request provided', async ()=> {
    const proposals = {
      data: createProposalsResponseData()
    };

    addAxios().request.mockResolvedValue(proposals);
    const result = await apiFactory.proposalsApi().fetchProposals()
    expect(result.isError()).toBe(false)
    expect(result.isSuccess()).toBe(true)
    expect(result.error).toBeUndefined()

    expectProposals(result.data);
  });
  it('gets proposals - no proposals', async () => {
    const proposals = {
      data: createProposalsResponseData(new Array(), new Array())
    };

    addAxios().request.mockResolvedValue(proposals);
    const result = await apiFactory.proposalsApi().fetchProposals()
    expect(result.isError()).toBe(false)
    expect(result.isSuccess()).toBe(true)
    expect(result.error).toBeUndefined()
    expect(result.data?.proposals.length).toBe(0);
    expect(result.data?.numberOfActive).toBe(0);
  });
});

