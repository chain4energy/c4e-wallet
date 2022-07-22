export class StakingPool {
  bondedTokens: bigint;
  notBondedTokens: bigint;

  constructor (bondedTokens: bigint, notBondedTokens: bigint) {
    this.bondedTokens = bondedTokens;
    this.notBondedTokens = notBondedTokens;
  }

}
