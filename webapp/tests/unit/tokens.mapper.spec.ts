import { StakingPool as BcStakingPool} from "@/models/blockchain/tokens";
import { mapStakingPool } from "@/models/mapper/tokens.mapper";
import { StakingPool as StoreStakingPool } from "@/models/store/tokens";
import { createStakingPool } from "../utils/tokens.blockchain.data.util";


describe('map tokens', () => {

  it('maps staking pool', async () => {
    const bcPool: BcStakingPool = createStakingPool('12345', '98786');

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