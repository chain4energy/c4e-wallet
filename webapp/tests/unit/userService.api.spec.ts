import { setActivePinia, createPinia } from 'pinia';
import apiFactory from "@/api/factory.api";
import { useSplashStore } from '@/store/splash.store';
import { WalletType } from '@/utils/wallet-type';
import {
  createAuthWalletInitResponse,
  createAuthWalletResponse
} from "../utils/user.service.data.utill";
import {mockAxiosJWT} from "../utils/mock.util";

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

describe('user service api tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  afterEach(() => {
    expect(useSplashStore().splashCounter).toBe(0);
    mockedAxios.request.mockClear();
  });

  it('register keplr', async () => {

    const initResponse = {
      data: createAuthWalletInitResponse()
    };

    mockedAxios.request.mockResolvedValue(initResponse);

    const result = await api.authWalletInit({ accountAddress: '123123', walletType: WalletType.KEPLR  }, false);

    expect(result.isError()).toBe(false);
    expect(result.isSuccess()).toBe(true);
    expect(result.error).toBeUndefined();

    const signResponse = {
      data: 'signedData'
    };

    const authWalletResponse = {
      data: createAuthWalletResponse()
    };

    mockedAxios.request.mockResolvedValue(authWalletResponse);
    const result2 = await api.authWalletKeplr({processID: initResponse.data.processID, signedData: signResponse.data}, false);

    expect(result2.isError()).toBe(false);
    expect(result2.isSuccess()).toBe(true);
    expect(result2.error).toBeUndefined();
  });

  it('register metamask', async () => {

    const initResponse = {
      data: createAuthWalletInitResponse()
    };

    mockedAxios.request.mockResolvedValue(initResponse);

    const result = await api.authWalletInit({ accountAddress: '123123', walletType: WalletType.METAMASK  }, false);

    expect(result.isError()).toBe(false);
    expect(result.isSuccess()).toBe(true);
    expect(result.error).toBeUndefined();

    const signResponse = {
      data: 'signedData'
    };

    const authWalletResponse = {
      data: createAuthWalletResponse()
    };

    mockedAxios.request.mockResolvedValue(authWalletResponse);
    const result2 = await api.authWalletMetamask({processID: initResponse.data.processID, signedData: signResponse.data}, false);

    expect(result2.isError()).toBe(false);
    expect(result2.isSuccess()).toBe(true);
    expect(result2.error).toBeUndefined();
  });

  it('activate account', async () => {

    const authWalletResponse = {
      data: createAuthWalletResponse()
    };

    mockedAxios.request.mockResolvedValue(authWalletResponse);

    const result = await api.activateEmailAccount('testtesttest', false);

    expect(result.isError()).toBe(false);
    expect(result.isSuccess()).toBe(true);
    expect(result.error).toBeUndefined();
  });

});



