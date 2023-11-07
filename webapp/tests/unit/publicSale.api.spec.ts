import {createPinia, setActivePinia} from "pinia";
import {useSplashStore} from "@/store/splash.store";
import {mockAxios, mockAxiosJWT} from "../utils/mock.util";
import apiFactory from "@/api/factory.api";
import {
  createBlockchainInfo,
  createReservationList,
  createReservationToken,
  expectReservationList,
  expectReserveTokens
} from "../utils/publicSales.data.utils";
import {EmptyResponse} from "@/models/request-response";

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
  };
});
const mockedAxios = mockAxiosJWT();
const api = apiFactory.publicSaleServiceApi();

describe('public sale api tests', () => {

  beforeEach(() => {
    setActivePinia(createPinia());
  });

  afterEach(() => {
    expect(useSplashStore().splashCounter).toBe(0);
    mockedAxios.request.mockClear();
    mockedAxios.request.mockReset();
  });

  it('fetch reservation List', async () =>{
    const reservations = {
      data: createReservationList()
    };
    mockedAxios.request.mockResolvedValue(reservations);
    const result = await api.fetchReservationList(false);
    expect(result.isError()).toBe(false);
    expect(result.isSuccess()).toBe(true);
    expect(result.error).toBeUndefined();
    expectReservationList(result);
  });

  it('fetch reservation token', async () =>{
    const reservation = {
      data: createReservationToken()
    };
    mockedAxios.request.mockResolvedValue(reservation);
    const result = await api.reserveTokens(1, 10000, false);
    expect(result.isError()).toBe(false);
    expect(result.isSuccess()).toBe(true);
    expect(result.error).toBeUndefined();
    expectReserveTokens(result);
  });

  it('cancel reservation', async () =>{
    const returnVale = {
      data: {} as EmptyResponse
    };
    mockedAxios.request.mockResolvedValue(returnVale);
    const result = await api.cancelReservation(1, false);
    expect(result.isError()).toBe(false);
    expect(result.isSuccess()).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('fetchBlockchainInfo', async ()=>{
    const blockChainInfo = {
      data: createBlockchainInfo()
    };
    mockedAxios.request.mockResolvedValue(blockChainInfo);
    const result = await api.fetchBlockchainInfo(true);
    expect(result.isError()).toBe(false);
    expect(result.isSuccess()).toBe(true);
    expect(result.error).toBeUndefined();
  })
});