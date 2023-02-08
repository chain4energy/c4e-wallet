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
    PROPOSAL_TALLY_URL: '/cosmos/gov/v1beta1/proposals/{id}/tally',
    INFLATION_URL: '/c4e/minter/v1beta1/inflation',
    STAKING_PARAMS_URL: '/cosmos/staking/v1beta1/params',
    VESTINGS_SUM_URL: '/c4e/vesting/v1beta1/summary',
    DISTRIBUTOR_PARAMS_URL: '/c4e/distributor/v1beta1/params'

  },
  hasura: {
    AVERAGE_BLOCK_TIME_QUERY: 'query AverageBlockTime {' +
      'averageBlockTime: average_block_time_per_hour(limit: 1, order_by: {height: desc}) {' +
        'averageTime: average_time' +
      '}' +
    '}',
    PROPOSAL_USER_VOTE_QUERY: 'query UserVote {' +
      'proposal_vote(where: {proposal_id: {_eq: {proposalId}}, voter_address: {_eq: "{voter}"}}) {' +
        'option' +
      '}' +
    '}',
    VALIDATOR_DESCRIPTION: 'query MyQuery {' +
      'validator {' +
        'validator_infos {' +
          'operator_address' +
        '}' +
        'validator_descriptions { ' +
          'avatar_url' +
        '}' +
      '}' +
    '}',
    PROPOSALS_DETAILS_TALLY_QUERY: 'query ProposalDetailsTally {' +
      'proposalTallyResult: proposal_tally_result(where: {proposal_id: {_eq: {proposalId}}}) {' +
      '    yes' +
      '    no' +
      '    no_with_veto: no_with_veto' +
      '    abstain' +
      '  }' +
      '  stakingPool: proposal_staking_pool_snapshot(where: {proposal_id: {_eq: {proposalId}}}) {' +
      '    bonded_tokens: bonded_tokens' +
      '    not_bonded_tokens: not_bonded_tokens' +
      '  }' +
      '}'
  },
  keybase: {
    QUERY_URL: '/_/api/1.0/user/user_search.json?q={keybaseHash}&num_wanted=1'
  },
  airdrop: {
    AIRDROP_INFO: 'airdropInfo.json'
  }
};
