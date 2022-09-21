import {calculateLockedVesting} from "@/utils/vesting-utils";
jest.mock("axios");

const currentDate = new Date();
const startTime = currentDate.getTime();
const yearInMillis = 365*24*3600*1000;
const endTime = startTime + yearInMillis;
const amount = 1000000n;


describe('tests mapping of locked vesting', () => {

  it('calculates locked vesting funciton', async () => {
    const lockedVestingDidntStart = calculateLockedVesting(startTime, endTime, startTime - 10000, amount);
    expect(lockedVestingDidntStart).toBe(amount);

    const lockedVestingHalf = calculateLockedVesting(startTime, endTime, endTime - yearInMillis / 2, amount);
    expect(lockedVestingHalf).toBe(amount / BigInt(2));

    const lockedVestingPassed = calculateLockedVesting(startTime, endTime, endTime + 10000, amount);
    expect(lockedVestingPassed).toBe(0n);
  });

});
