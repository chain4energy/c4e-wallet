import { setActivePinia, createPinia } from 'pinia'
import apiFactory from "@/api/factory.api";
import {mockAxios, mockAxiosJWT} from '../utils/mock.util';
import { useSplashStore } from '@/store/splash.store';
import { axiosErrorMessagePrefix, defaultAxiosErrorName, createErrorResponse as createBlockchainErrorResponse, defaultErrorName } from '../utils/common.blockchain.data.util';
import { createBlockResponseData, expectBlock } from '../utils/block.blockchain.data.util';
import { AverageBlockTimeResponse } from '@/models/hasura/average.block.time';
import { createAveragetBlockTimeResponseData } from '../utils/average.block.time.hasura.data.util';
import { createErrorResponse as createHasuraErrorResponse, createHasuraError, defaultHasuraErrorMessage, defaultHasuraErrorName } from '../utils/common.hasura.data.util';
import { useUserServiceStore } from '@/store/userService.store';
import { WalletType } from '@/utils/wallet-type';
import {createAuthWalletInitResponse, createAuthWalletResponse} from "../utils/user.service.data.utill";
import {useUserStore} from "@/store/user.store";


jest.mock("axios");
const mockedAxios = mockAxiosJWT();
const api = apiFactory.userServiceApi();

describe('user service api tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  });

  afterEach(() => {
    expect(useSplashStore().splashCounter).toBe(0);
    mockedAxios.request.mockClear();
  })

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



});



