import { useConfigurationStore } from '@/store/configuration.store';

interface CommunityPoolCoin {
  denom: string;
  amount: string;
}

interface CommunityPoolResponse {
  pool: CommunityPoolCoin[];
}

export interface CommunityPoolChartData {
  totalPool: number;
  fundedAmount: number;
  remainingPool: number;
  fundedAmounts: number[];
}

// fetch community pool from chains LCD
export const fetchCommunityPoolBalance = async (): Promise<number> => {
  try {
    const configStore = useConfigurationStore();
    const bcApiURL = configStore.config?.bcApiURL;

    if (!bcApiURL) {
      throw new Error('bcApiURL not configured');
    }

    const response = await fetch(`${bcApiURL}/cosmos/distribution/v1beta1/community_pool`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: CommunityPoolResponse = await response.json();
    console.log('Community Pool LCD Response:', data);

    // find the coin
    const c4eCoin = data.pool.find(coin => coin.denom === 'uc4e');

    if (!c4eCoin) {
      throw new Error('uc4e not found in community pool');
    }

    // convert to C4E
    const amountInC4E = parseFloat(c4eCoin.amount) / 1000000;
    return amountInC4E;

  } catch (error) {
    console.error('Error fetching community pool balance:', error);
    throw error;
  }
};

export const calculateChartData = async (fundData: Array<{ amount: string }>): Promise<CommunityPoolChartData> => {
  try {
    const totalPool = await fetchCommunityPoolBalance();

    // extract numeric values from the fund amounts
    // communityPool.service.ts already converted to C4E
    const fundedAmounts = fundData
      .map(fund => {
        const numericAmount = fund.amount.replace(' C4E', '');
        return parseFloat(numericAmount);
      })
      .filter(amount => !isNaN(amount));

    const fundedAmount = fundedAmounts.reduce((sum, amount) => sum + amount, 0);
    const remainingPool = totalPool - fundedAmount;

    return {
      totalPool,
      fundedAmount,
      remainingPool: Math.max(0, remainingPool), // ensure non-negative
      fundedAmounts
    };
  } catch (error) {
    console.error('Error calculating chart data:', error);
    throw error;
  }
};
