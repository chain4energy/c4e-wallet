import { setActivePinia, createPinia } from 'pinia'
import { ContinuousVestingData } from "@/models/store/account";
import { Coin } from "@/models/store/common";

import { defaultDenom } from "../utils/common.blockchain.data.util";
import { useConfigurationStore } from '@/store/configuration.store';


describe('tests vesting locked tokens calculations', () => {

  beforeEach(() => {
    setActivePinia(createPinia())
    useConfigurationStore().config.stakingDenom = defaultDenom;

  });

  it('count locked', async () => {
    const currentDate = new Date();
    const startTime = currentDate.getTime();
    const yearInMillis = 365*24*3600*1000;
    const endTime = startTime + yearInMillis;
    const amount = 1000000n
    const origVesting = new Coin(amount, defaultDenom);
    const vestingData = new ContinuousVestingData(new Date(startTime), new Date(endTime), [origVesting]);

    expect(vestingData.calculateVestingLocked(new Date(startTime-1000000))).toBe(amount);
    expect(vestingData.calculateVestingLocked(new Date(startTime))).toBe(amount);

    expect(vestingData.calculateVestingLocked(new Date(startTime+yearInMillis/4))).toBe(amount - amount/4n);
    expect(vestingData.calculateVestingLocked(new Date(startTime+yearInMillis/2))).toBe(amount/2n);
    expect(vestingData.calculateVestingLocked(new Date(startTime+yearInMillis-yearInMillis/4))).toBe(amount/4n);

    expect(vestingData.calculateVestingLocked(new Date(endTime))).toBe(0n);
    expect(vestingData.calculateVestingLocked(new Date(endTime+1000000))).toBe(0n);
  });



  

});