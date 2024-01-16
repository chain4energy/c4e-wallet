import apiFactory from "@/api/factory.api";
import {mockAxios, mockAxiosJWT} from "../utils/mock.util";
import {createPinia, setActivePinia} from "pinia";
import {useSplashStore} from "@/store/splash.store";
import {createLinkDecodeResponse} from "../utils/evService.data.utils";
import {AppTypeLink, useEvStore} from "@/store/ev.store";
import {boolean} from "yup";
import {ErrorData} from "@/api/base.api";
import {EvServiceApplicationError} from "@/models/evServiceErrors";

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
    AxiosError: jest.fn()
  }
})
const mockedAxios = mockAxiosJWT();

const api = apiFactory.evServiceApi()
describe('ev api tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  afterEach(() => {
    expect(useSplashStore().splashCounter).toBe(0);
    mockedAxios.request.mockClear();
  });

  it('decode link - API', async () => {
    const linkDecodeResponse = {
      data: createLinkDecodeResponse()
    };
    mockedAxios.request.mockResolvedValue(linkDecodeResponse);
    const result = await api.evDecodeLink('address', true);
    expect(result.isError()).toBe(false);
    expect(result.isSuccess()).toBe(true);
    expect(result.error).toBeUndefined();
    // expect(result.data).toStrictEqual(createLinkDecodeResponse());
    expect(useSplashStore().splashOn).toBe(false);
  });

  it('decode link - STORAGE', async () => {
    const linkDecodeResponse = {
      data: createLinkDecodeResponse()
    };
    mockedAxios.request.mockResolvedValue(linkDecodeResponse);
    const evStore = useEvStore();
    let onSuccessCalled = false;
    let onFailCalled = false;
    let onFailError: (ErrorData<EvServiceApplicationError> | undefined) = undefined;
    await evStore.decodeLink(
      "asd",
      true,
      ()=>{
          onSuccessCalled = true
      },
      (error: ErrorData<EvServiceApplicationError> | undefined)=>{
        onFailError = error;
        onFailCalled = true;
      });
    expect(onSuccessCalled).toBe(true);
    expect(onFailCalled).toBe(false);
    expect(onFailError).toBeUndefined();
    expect(useSplashStore().splashOn).toBe(false);
    expect(evStore.getAppLinkType).toEqual(AppTypeLink.CHARGE_POINT_CONNECTOR_LINK);
    //TODO:check rest of storage data
  });
});
