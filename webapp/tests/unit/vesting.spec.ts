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
    const amount = 1000000
    const origVesting = new Coin(amount.toString(), defaultDenom);
    const vestingData = new ContinuousVestingData(startTime.toString(), endTime.toString(), [origVesting]);

    expect(vestingData.calculateVestingLocked(new Date(startTime-1000000).toISOString())).toBe(amount);
    expect(vestingData.calculateVestingLocked(new Date(startTime).toISOString())).toBe(amount);

    expect(vestingData.calculateVestingLocked(new Date(startTime+yearInMillis/4).toISOString())).toBe(amount - amount/4);
    expect(vestingData.calculateVestingLocked(new Date(startTime+yearInMillis/2).toISOString())).toBe(amount/2);
    expect(vestingData.calculateVestingLocked(new Date(startTime+yearInMillis-yearInMillis/4).toISOString())).toBe(amount/4);

    expect(vestingData.calculateVestingLocked(new Date(endTime).toISOString())).toBe(0);
    expect(vestingData.calculateVestingLocked(new Date(endTime+1000000).toISOString())).toBe(0);
  });



  

});