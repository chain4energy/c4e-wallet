import { DeliverTxResponse } from "@cosmjs/stargate";

export const defaultMemo = ''

export const defaultGas = {
  vote: 10000,
  delegate: 20000,
  undelegate: 3000,
  redelegate: 40000,
  claimRewards: 50000,
};

export const defaultTxSuccessResponse = {
  height: '123222',
  code: 0,
  transactionHash: '8653E21B825AAFCDC75261EAEFF71207044AF40DE390BEB31C8B0C9AA7BAA3EA',
  rawLog: 'Success log',
  data: undefined,
  gasUsed: 34,
  gasWanted: 22
} as unknown as DeliverTxResponse

export const defaultTxErrorResponse = {
  height: '67812',
  code: 3,
  transactionHash: 'D1A61D1288598A7A5718A4ABC6176D3E70E374A81D91623DE88BDF516A25FBE8',
  rawLog: 'Error log',
  data: undefined,
  gasUsed: 11,
  gasWanted: 44
} as unknown as DeliverTxResponse

export const msgDelegateTypeUrl = '/cosmos.staking.v1beta1.MsgDelegate';
export const msgUndelegateTypeUrl = '/cosmos.staking.v1beta1.MsgUndelegate';
export const msgBeginRedelegateTypeUrl = '/cosmos.staking.v1beta1.MsgBeginRedelegate'
export const msgVoteTypeUrl = '/cosmos.gov.v1beta1.MsgVote'
export const msgWithdrawDelegatorRewardTypeUrl = '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward'