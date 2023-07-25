import {mockAxios} from "../utils/mock.util";
import apiFactory from "@/api/factory.api";
import {createPinia, setActivePinia} from "pinia";
import {useSplashStore} from "@/store/splash.store";
import {
  createCampaignResponse, createMissionsResponse, createMissionsResponseWeightErr,
  createUserEntriesResponse, expectCampaignEntry, expectCampaignMissions, expectCampaignMissionsWeightErr,
  expectUserEntry
} from "../utils/airdrop.data.util";

jest.mock('axios', () => {
  return {
    create: jest.fn(() => ({
      get: jest.fn(),
      interceptors: {
        request: { use: jest.fn(), eject: jest.fn() },
        response: { use: jest.fn(), eject: jest.fn() }
      }
    })),
    request: jest.fn(),
  }
})
const mockedAxios = mockAxios();
const api = apiFactory.airDropApi()
const address = 'c4e17ncvyer9eemq36adyf6fex84nz9cvp2pmqja46';

describe('airdrop api tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  });

  afterEach(() => {
    expect(useSplashStore().splashCounter).toBe(0);
    mockedAxios.request.mockClear();
  });

  it('fetch usersEntry data', async () => {
    const userEntity = {
      data: createUserEntriesResponse()
    };
    mockedAxios.request.mockResolvedValue(userEntity);
    const result = await api.fetchUserAirdropEntries(address, true);
    expect(result.isError()).toBe(false);
    expect(result.isSuccess()).toBe(true);
    expect(result.error).toBeUndefined();

    expectUserEntry(result.data);
  });

  it('fetch campaign', async () =>{
    const campaign = {
      data: createCampaignResponse(),
    };
    mockedAxios.request.mockResolvedValue(campaign);
    const result = await api.fetchCampaign(address, true);
    expect(result.isError()).toBe(false);
    expect(result.isSuccess()).toBe(true);
    expect(result.error).toBeUndefined();

    expectCampaignEntry(result.data);
  });
  it('fetch missions', async () =>{
    const missions = {
      data: createMissionsResponse(),
    };
    mockedAxios.request.mockResolvedValue(missions);
    const result = await api.fetchCampaignMissions('1', true);
    expect(result.isError()).toBe(false);
    expect(result.isSuccess()).toBe(true);
    expect(result.error).toBeUndefined();

    expectCampaignMissions(result.data);
  });
  it('fetch missions with err', async () =>{
    const missions = {
      data: createMissionsResponseWeightErr(),
    };
    mockedAxios.request.mockResolvedValue(missions);
    const result = await api.fetchCampaignMissions('1', true);
    expect(result.isError()).toBe(false);
    expect(result.isSuccess()).toBe(true);
    expect(result.error).toBeUndefined();

    expectCampaignMissionsWeightErr(result.data);
  });
});
