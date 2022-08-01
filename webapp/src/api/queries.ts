export default {
  blockchain: {
    STAKING_POOL_URL: '/cosmos/staking/v1beta1/pool',
    TOTAL_SUPPLY_URL: '/cosmos/bank/v1beta1/supply/{denom}',
    COMMUNITY_POOL_URL: '/cosmos/distribution/v1beta1/community_pool',
    PROPOSALS_URL: '/cosmos/gov/v1beta1/proposals',
    PROPOSALS_BY_ID_URL: '/cosmos/gov/v1beta1/proposals/{id}',
    TALLYING_URL: '/cosmos/gov/v1beta1/params/tallying',
    DEPOSIT_URL: '/cosmos/gov/v1beta1/params/deposit',
    LATEST_BLOCK_URL: '/cosmos/base/tendermint/v1beta1/blocks/latest',
    VALIDATORS_URL: '/cosmos/staking/v1beta1/validators',
    ACCOUNT_URL: '/cosmos/auth/v1beta1/accounts/{address}',
    BALANCE_URL: '/cosmos/bank/v1beta1/balances/{address}/by_denom?denom={denom}',
    STAKED_AMOUNT_URL: '/cosmos/staking/v1beta1/delegations/{address}',
    UNSTAKED_AMOUNT_URL: '/cosmos/staking/v1beta1/delegators/{address}/unbonding_delegations',
    REWARDS_URL: '/cosmos/distribution/v1beta1/delegators/{address}/rewards',
  },
  hasura: {
    AVERAGE_BLOCK_TIME_QUERY: 'query AverageBlockTime {' +
      "averageBlockTime: average_block_time_per_hour(limit: 1, order_by: {height: desc}) {" + 
        'averageTime: average_time' + 
      '}' +
    "}",

  }
};
