export default {
  blockchain: {
    STAKING_POOL_URL: '/cosmos/staking/v1beta1/pool',
    TOTAL_SUPPLY_URL: '/cosmos/bank/v1beta1/supply/by_denom?denom={denom}',
    COMMUNITY_POOL_URL: '/cosmos/distribution/v1beta1/community_pool',
    PROPOSALS_URL: '/cosmos/gov/v1/proposals',
    PROPOSALS_BY_ID_URL: '/cosmos/gov/v1/proposals/{id}',
    TALLYING_URL: '/cosmos/gov/v1beta1/params/tallying',
    DEPOSIT_URL: '/cosmos/gov/v1beta1/params/deposit',
    LATEST_BLOCK_URL: '/cosmos/base/tendermint/v1beta1/blocks/latest',
    VALIDATORS_URL: '/cosmos/staking/v1beta1/validators',
    ACCOUNT_URL: '/cosmos/auth/v1beta1/accounts/{address}',
    BALANCE_URL: '/cosmos/bank/v1beta1/balances/{address}/by_denom?denom={denom}',
    STAKED_AMOUNT_URL: '/cosmos/staking/v1beta1/delegations/{address}',
    UNSTAKED_AMOUNT_URL: '/cosmos/staking/v1beta1/delegators/{address}/unbonding_delegations',
    REWARDS_URL: '/cosmos/distribution/v1beta1/delegators/{address}/rewards',
    PROPOSAL_TALLY_URL: '/cosmos/gov/v1/proposals/{id}/tally',
    INFLATION_URL: '/c4e/minter/v1beta1/inflation',
    STAKING_PARAMS_URL: '/cosmos/staking/v1beta1/params',
    VESTINGS_SUM_URL: '/c4e/vesting/v1beta1/summary',
    DISTRIBUTOR_PARAMS_URL: '/c4e/distributor/v1beta1/params',
    USER_AIRDROP_ENTRIES_URL: '/c4e/airdrop/v1beta1/user_airdrop_entries/{address}',
    CAMPAIGNS_URL: '/c4e/airdrop/v1beta1/campaigns',
    MISSIONS_URL: '/c4e/airdrop/v1beta1/mission',
    AIRDROP_DISTRIBUTIONS: '/c4e/airdrop/v1beta1/airdrop_distributions/{campaign_id}',
    AIRDROP_CLAIMS_LEFT: '/c4e/airdrop/v1beta1/airdrop_claims_left/{campaign_id}',
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
      '    yes_count: yes' +
      '    no_count: no' +
      '    no_with_veto_count: no_with_veto' +
      '    abstain_count: abstain' +
      '  }' +
      '  stakingPool: proposal_staking_pool_snapshot(where: {proposal_id: {_eq: {proposalId}}}) {' +
      '    bonded_tokens: bonded_tokens' +
      '    not_bonded_tokens: not_bonded_tokens' +
      '  }' +
      '}',
    PROPOSALS_DETAILS_TALLY_LIST_QUERY: 'query ProposalDetailsTallyList {' +
      'proposalTallyResult: proposal_tally_result(where: {proposal_id: {_in: [{proposalsIds}]}}) {' +
      '    yes_count: yes' +
      '    no_count: no' +
      '    no_with_veto_count: no_with_veto' +
      '    abstain_count: abstain' +
      '    proposal_id '+
      '  }' +
      '  stakingPool: proposal_staking_pool_snapshot(where: {proposal_id: {_in: [{proposalsIds}]}}) {' +
      '    bonded_tokens: bonded_tokens' +
      '    not_bonded_tokens: not_bonded_tokens' +
      '    proposal_id '+
      '  }' +
      '}'
  },
  keybase: {
    QUERY_URL: '/_/api/1.0/user/user_search.json?q={keybaseHash}&num_wanted=1'
  },
  airdrop: {
    AIRDROP_INFO: 'airdropInfo.json'
  },
  publicSaleService: {
    GET_ACCOUNT: '/api/publicsale-service/accountInfo',
    REFRESH_TOKEN: '/api/publicsale-service/refresh',
    EMAIL_CREATE_ACCOUNT: '/api/publicsale-service/register',
    AUTHENTICATE_EMAIL: '/api/publicsale-service/auth/password',
    AUTHENTICATE_KEPLR: '/api/publicsale-service/auth/keplr',
    AUTHENTICATE_METAMASK: '/api/publicsale-service/auth/metamask',
    AUTHENTICATE_DOUBLE_WALLET: '/api/publicsale-service/auth/doubleWallet',
    INIT_WALLET_AUTH: '/api/publicsale-service/initWalletAuth',
    ACTIVATE_ACCOUNT: '/api/publicsale-service/activate/{activationCode}',
    PAIR_EMAIL: '/api/publicsale-service/claim/emailKeplr/init',
    CONFIRM_SIGNED_EMAIL_DATA: '/api/publicsale-service/claim/emailKeplr/signedData',
    VERIFY_EMAIL: '/api/publicsale-service/claim/emailKeplr/dataVerify',
    PAIR_METAMASK:'/api/publicsale-service/claim/metamaskKeplr/init',
    PAIR_METAMASK_VERFICATION: '/api/publicsale-service/claim/metamaskKeplr/signatureVerify',
    RESERVE_TOKENS: '/api/publicsale-service/token/reservation',
    INIT_PAYMENT_SESSION: '/api/publicsale-service/payment/initSession',
    TOKEN_RESERVATION_LIST: '/api/publicsale-service/token/reservations',
    KYC_INIT_SESSION: '/api/publicsale-service/kyc/init',
    ACCEPT_TERMS:'/api/publicsale-service/acceptTerms',
  },
  synaps: {
    OVERVIEW: 'https://individual-api.synaps.io/v3/onboarding/overview'
  }
};
