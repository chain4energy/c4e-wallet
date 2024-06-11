
import { setActivePinia, createPinia } from 'pinia';
import {mapLoyaltyDropConfig, mapLoyaltyDropUserBoostArray} from "@/models/mapper/loyaltydrop.mapper";
import {createLoyaltyDropPoolConfigResp, createLoyaltyDropUserBoostResponse} from "../utils/loyalty.data.util";
import {Coin} from "@/models/store/common";
import {LoyaltyDropPoolConfigResponse, UserBoostStatusType} from "@/models/loyaltydrop/loyaltyDrop";

describe('tests mapping of loyalty data', () => {

  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('maps LoyaltyDropConfig - data OK', async () => {

    const loyaltyDropPoolConfigs = mapLoyaltyDropConfig(createLoyaltyDropPoolConfigResp());

    expect(loyaltyDropPoolConfigs).toBeInstanceOf(Array);
    expect(loyaltyDropPoolConfigs.length).toBe(4);
    const loyaltyDropPoolConfig = loyaltyDropPoolConfigs[0];

    expect(loyaltyDropPoolConfig.id).toBe(1);
    expect(loyaltyDropPoolConfig.poolDescription).toBe('Power Boost (3mo.)');
    expect(loyaltyDropPoolConfig.vestingType).toBe('Advisors');
    expect(loyaltyDropPoolConfig.baseTokens).toStrictEqual(new Coin(500000000000n, 'uc4e'));
    expect(loyaltyDropPoolConfig.usedTokens).toStrictEqual(new Coin(200000000000n, 'uc4e'));
    expect(loyaltyDropPoolConfig.reservedTokens).toStrictEqual(new Coin(100000000000n, 'uc4e'));
    expect(loyaltyDropPoolConfig.rewardsTokens).toStrictEqual(new Coin(43750000000n, 'uc4e'));
    expect(loyaltyDropPoolConfig.grantedRewards).toStrictEqual(new Coin(50000000n, 'uc4e'));
    expect(loyaltyDropPoolConfig.epochNumber).toBe(13);
    expect(loyaltyDropPoolConfig.epochPeriod).toBe(604800000);
    expect(loyaltyDropPoolConfig.epochStartDate).toStrictEqual(new Date("2024-06-03T10:30:00Z"));
  });

  it('maps LoyaltyDropConfig - data undefined', async () => {
    expect(() => {mapLoyaltyDropConfig(undefined);}).toThrowError(new Error('LoyaltyDropPoolConfigResp is undefined'));
  });

  it('maps LoyaltyDropConfig - data null', async () => {
    const loyaltyDropPoolConfigs = mapLoyaltyDropConfig(null as unknown as LoyaltyDropPoolConfigResponse[]);
    expect(loyaltyDropPoolConfigs).toBeInstanceOf(Array);
    expect(loyaltyDropPoolConfigs.length).toBe(0);
  });

  it('maps LoyaltyDropConfig - data OK - SUCCESS', async () => {

    const loyaltyDropUserBoosts = mapLoyaltyDropUserBoostArray(createLoyaltyDropUserBoostResponse());

    expect(loyaltyDropUserBoosts).toBeInstanceOf(Array);
    expect(loyaltyDropUserBoosts.length).toBe(3);
    const loyaltyDropUserBoost = loyaltyDropUserBoosts[0];
    expect(loyaltyDropUserBoost.boostPoolId).toBe(1);
    expect(loyaltyDropUserBoost.vestingPoolName).toBe('ld-31835');
    expect(loyaltyDropUserBoost.baseAccountAddress).toBe('c4e3403djx5a8uatg2qg7xppp3df84stxh2s0n3oko');
    expect(loyaltyDropUserBoost.status).toBe(UserBoostStatusType.SUCCESS);
    expect(loyaltyDropUserBoost.txHash).toBe('2AC813265FA2F61C73BD9F2ADA27C1D9AB1B5B8BA293D30DA9867016FAE5E8CD');
    expect(loyaltyDropUserBoost.grantedRewards).toStrictEqual(new Coin(10n, 'uc4e'));
    expect(loyaltyDropUserBoost.amount).toStrictEqual(new Coin(1000000n, 'uc4e'));
    expect(loyaltyDropUserBoost.lastRewardDate).toStrictEqual(new Date("2024-06-06T10:41:46.627Z"));
    expect(loyaltyDropUserBoost.lockStart).toStrictEqual(new Date("2024-06-06T13:41:46.627Z"));
    expect(loyaltyDropUserBoost.lockEnd).toStrictEqual(new Date("2024-09-05T13:41:46.627Z"));
  });


  it('maps LoyaltyDropConfig - data OK - TRANSACTION_IN_PROGRESS', async () => {

    const loyaltyDropUserBoosts = mapLoyaltyDropUserBoostArray(createLoyaltyDropUserBoostResponse());

    expect(loyaltyDropUserBoosts).toBeInstanceOf(Array);
    expect(loyaltyDropUserBoosts.length).toBe(3);
    const loyaltyDropUserBoost = loyaltyDropUserBoosts[1];
    expect(loyaltyDropUserBoost.boostPoolId).toBe(4);
    expect(loyaltyDropUserBoost.vestingPoolName).toBe('ld-4725');
    expect(loyaltyDropUserBoost.baseAccountAddress).toBe('c4e3403djx5a8uatg2qg7xppp3df84stxh2s0n3oko');
    expect(loyaltyDropUserBoost.status).toBe(UserBoostStatusType.TRANSACTION_IN_PROGRESS);
    expect(loyaltyDropUserBoost.txHash).toBe('0DA2E5A15AA82CAB6DC7D216699B3B777C1B63C3EFE2265162507308F5B29A9C');
    expect(loyaltyDropUserBoost.grantedRewards).toBeNull();
    expect(loyaltyDropUserBoost.amount).toStrictEqual(new Coin(1800000000n, 'uc4e'));
    expect(loyaltyDropUserBoost.lastRewardDate).toBeNull();
    expect(loyaltyDropUserBoost.lockStart).toBeNull();
    expect(loyaltyDropUserBoost.lockEnd).toBeNull();
  });

});
