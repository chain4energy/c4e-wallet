export class StakingPool {
  bondedTokens: string;
  notBondedTokens: string;

  constructor (bondedTokens: string, notBondedTokens: string) {
    this.bondedTokens = bondedTokens;
    this.notBondedTokens = notBondedTokens;
  }

}
