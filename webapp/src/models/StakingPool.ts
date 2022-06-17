export interface Pool{
  bonded_tokens: number;
  not_bonded_tokens: number;
}

export interface StakingPool {
  pool: Pool;
}

