import {mockAxios} from "../utils/mock.util";
import apiFactory from "@/api/factory.api";
import {createPinia, setActivePinia} from "pinia";
import {useSplashStore} from "@/store/splash.store";
import {createStakingPoolResponseData, expectStakingPool} from "../utils/tokens.blockchain.data.util";
import {createLoyaltyDropPoolConfigResp, createLoyaltyDropPoolConfigRespSingleObject} from "../utils/loyalty.data.util";
import {LoyaltyDropPoolConfigResponse, UserBoostStatusType} from "@/models/loyaltydrop/loyaltyDrop";
import {Coin} from "@/models/store/common";
import {defaultErrorName} from "../utils/common.blockchain.data.util";

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
  };
});
const mockedAxios = mockAxios();
const api = apiFactory.boostApi();

describe('tokens api tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  afterEach(() => {
    expect(useSplashStore().splashCounter).toBe(0);
    mockedAxios.request.mockClear();
  });

  it('gets LoyaltyDropPoolsConfig - ok - exists', async () => {
    const baseToken = 500000000000;
    const usedToken = 200000000000;
    const reservedTokens = 100000000000;
    const rewardsToken = 43750000000;
    const grantedRewards = 50000000;
    const epochNumber = 13;
    const epochPeriod =604800000;
    const epochStartData = "2024-06-03T10:30:00Z";

    const loyaltyDropPoolConfigs = {
      data: createLoyaltyDropPoolConfigRespSingleObject(baseToken, usedToken, reservedTokens, rewardsToken, grantedRewards, epochNumber, epochPeriod, epochStartData)
    };

    mockedAxios.request.mockResolvedValue(loyaltyDropPoolConfigs);
    const result = await api.fetchLoyaltyDropPoolsConfig(false);
    expect(result.isError()).toBe(false);
    expect(result.isSuccess()).toBe(true);
    expect(result.error).toBeUndefined();

    expect(result.data).toBeDefined();
    expect(result.data).toBeInstanceOf(Array);
    expect(result.data?.length).toBe(1);
    if(result.data){
      const loyaltyDropPoolConfig = result.data[0];
      expect(loyaltyDropPoolConfig.id).toBe(1);
      expect(loyaltyDropPoolConfig.poolDescription).toBe('Power Boost (3mo.)');
      expect(loyaltyDropPoolConfig.vestingType).toBe('Advisors');
      expect(loyaltyDropPoolConfig.baseTokens).toStrictEqual(new Coin(BigInt(baseToken), 'uc4e'));
      expect(loyaltyDropPoolConfig.usedTokens).toStrictEqual(new Coin(BigInt(usedToken), 'uc4e'));
      expect(loyaltyDropPoolConfig.reservedTokens).toStrictEqual(new Coin(BigInt(reservedTokens), 'uc4e'));
      expect(loyaltyDropPoolConfig.rewardsTokens).toStrictEqual(new Coin(BigInt(rewardsToken), 'uc4e'));
      expect(loyaltyDropPoolConfig.grantedRewards).toStrictEqual(new Coin(BigInt(grantedRewards), 'uc4e'));
      expect(loyaltyDropPoolConfig.epochNumber).toBe(epochNumber);
      expect(loyaltyDropPoolConfig.epochPeriod).toBe(epochPeriod);
      expect(loyaltyDropPoolConfig.epochStartDate).toStrictEqual(new Date(epochStartData));
    }
  });

  it('gets LoyaltyDropPoolsConfig - bad data', async () => {
    const loyaltyDropPoolConfigs = {
      data: undefined
    };

    mockedAxios.request.mockResolvedValue(loyaltyDropPoolConfigs);
    const result = await api.fetchLoyaltyDropPoolsConfig(false);
    expect(result.isError()).toBe(true);
    expect(result.isSuccess()).toBe(false);
    expect(result.error?.message).toBe('LoyaltyDropPoolConfigResp is undefined');
    expect(result.error?.data).toBeUndefined();

  });

  it('gets LoyaltyDropPoolsConfig - bad data - wrong object', async () => {
    const loyaltyDropPoolConfigs = {
      data: {}
    };

    mockedAxios.request.mockResolvedValue(loyaltyDropPoolConfigs);
    const result = await api.fetchLoyaltyDropPoolsConfig(false);
    expect(result.isError()).toBe(true);
    expect(result.isSuccess()).toBe(false);
    expect(result.error?.message).toBe('LoyaltyDropPoolConfigResp is undefined');
    expect(result.error?.data).toBeUndefined();

  });
});
