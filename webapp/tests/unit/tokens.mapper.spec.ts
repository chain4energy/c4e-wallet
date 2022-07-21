import { StakingPool as BcStakingPool} from "@/models/blockchain/tokens";
import { mapStakingPool } from "@/models/mapper/tokens.mapper";
import { StakingPool as StoreStakingPool } from "@/models/store/tokens";


describe('map common', () => {

  it('maps staking pool', async () => {
    const bcPool: BcStakingPool = {bonded_tokens: '12345', not_bonded_tokens: '98786'};

    const pool = mapStakingPool(bcPool);
    expect(pool).toBeInstanceOf(StoreStakingPool);
    expect(pool.bondedTokens).toBe(bcPool.bonded_tokens);
    expect(pool.notBondedTokens).toBe(bcPool.not_bonded_tokens);

  });

  it('maps pool unexpected data', async () => {
    const bcPool: BcStakingPool = {
          address: 'address',
    } as unknown as BcStakingPool;

    expect(() => {mapStakingPool(bcPool)}).toThrowError(new Error('no bonded_tokens or not_bonded_tokens defined'));
  });

  it('maps undefined coin and denom', async () => {
    expect(() => {mapStakingPool(undefined)}).toThrowError(new Error('Staking Pool is undefined'));

  });

  

});