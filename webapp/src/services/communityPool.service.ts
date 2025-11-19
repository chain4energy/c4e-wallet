import { useCommunityPoolStore, type FundData } from '@/store/communityPool.store';

export const getCommunityPoolAmounts = (): string[] => {
  return useCommunityPoolStore().getAmounts;
};

export const getCommunityPoolFundData = (): FundData[] => {
  return useCommunityPoolStore().getFundData;
};

export type { CommunityPoolData, CommunityPoolMessage } from '@/api/communityPool.api';
export type { FundData } from '@/store/communityPool.store';
