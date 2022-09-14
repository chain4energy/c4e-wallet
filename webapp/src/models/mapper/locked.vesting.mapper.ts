import {useBlockStore} from "@/store/block.store";
import {VestingAccounts} from "@/models/hasura/vesting.accounts";
import {calculateLockedVesting} from "@/utils/vesting-utils";

export function mapLockedVesting(vestingData: VestingAccounts | undefined): bigint  {
  if (!vestingData) return 0n;
  const blockTime = useBlockStore().getLatestBlock.time.getTime();
  let lockedVesting = BigInt(0);
  for (let i = 0; i < vestingData.vesting_account.length; i++) {
    const endTime =  new Date(vestingData.vesting_account[i].end_time).getTime();
    const startTime = new Date(vestingData.vesting_account[i].start_time).getTime();
    const originVestingAmount = BigInt(vestingData.vesting_account[i].original_vesting[0].amount);
    try {
      lockedVesting += calculateLockedVesting(startTime, endTime, blockTime, originVestingAmount);
    } catch (e) {
      console.log(e);
    }
  }
  return lockedVesting;
}
