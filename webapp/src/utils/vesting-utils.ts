export function calculateLockedVesting
  (
    startTime: number,
    endTime: number,
    blockTime: number,
    originVestingAmount: bigint
  ) {
  if (blockTime >= endTime) {
    return 0n;
  }
  if (blockTime <= startTime) {
    return originVestingAmount;
  }
  const x = blockTime - startTime;
  const y = endTime - startTime;

  const unlocked = (BigInt(x) * originVestingAmount) / BigInt(y);
  return originVestingAmount - unlocked;
}

