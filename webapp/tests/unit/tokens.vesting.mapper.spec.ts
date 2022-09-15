import {mapLockedVesting} from "@/models/mapper/locked.vesting.mapper";
import {
  createDefaultVestingAccounts,
  createVestingAccount
} from "../utils/tokens.vesting.mapper.data.util";
import { setActivePinia, createPinia } from 'pinia';
import {calculateLockedVesting} from "@/utils/vesting-utils";
import {useBlockStore} from "@/store/block.store";
import {createBlockResponseData} from "../utils/block.blockchain.data.util";
import {mockAxios} from "../utils/mock.util";
import {defaultDenom} from "../utils/common.blockchain.data.util";
jest.mock("axios");
const mockedAxios = mockAxios();


const currentDate = new Date();
const startTime = currentDate.getTime();
const yearInMillis = 365*24*3600*1000;
const endTime = startTime + yearInMillis;
const amount = 1000000n;


describe('tests mapping of locked vesting', () => {
  setActivePinia(createPinia());
  const blockStore = useBlockStore()

  it('calculates locked vesting funciton', async () => {
    const lockedVestingDidntStart = calculateLockedVesting(startTime, endTime, startTime - 10000, amount);
    expect(lockedVestingDidntStart).toBe(amount);

    const lockedVestingHalf = calculateLockedVesting(startTime, endTime, endTime - yearInMillis / 2, amount);
    expect(lockedVestingHalf).toBe(amount / BigInt(2));

    const lockedVestingPassed = calculateLockedVesting(startTime, endTime, endTime + 10000, amount);
    expect(lockedVestingPassed).toBe(0n);
  });

  it('maps hasura response and calculates locked vesting', async () => {
    const amount = "1000000";
    const vestingAccountNumber = 10;
    let height = 123412;

    const vestingAccount = createVestingAccount(new Date(startTime).toISOString(), new Date(endTime).toISOString(), defaultDenom, amount);
    const vestingAccounts = createDefaultVestingAccounts(vestingAccount, vestingAccountNumber);

    expect(mapLockedVesting(undefined)).toBe(0n);

    mockedAxios.request.mockResolvedValueOnce({data: createBlockResponseData((height++).toString(), new Date(endTime + 1000).toISOString())});
    await blockStore.fetchLatestBlock();
    expect(mapLockedVesting({vesting_account: vestingAccounts})).toBe(0n);

    mockedAxios.request.mockResolvedValueOnce({data: createBlockResponseData((height++).toString(), new Date(startTime - 1000).toISOString())});
    await blockStore.fetchLatestBlock();
    expect(mapLockedVesting({vesting_account: vestingAccounts})).toBe(BigInt(amount) * BigInt(vestingAccountNumber));

    mockedAxios.request.mockResolvedValueOnce({data: createBlockResponseData((height++).toString(), new Date(endTime - (yearInMillis / 2)).toISOString())});
    await blockStore.fetchLatestBlock();
    expect(mapLockedVesting({vesting_account: vestingAccounts})).toBe(BigInt(amount) * BigInt(vestingAccountNumber) / BigInt(2));
  });
});
