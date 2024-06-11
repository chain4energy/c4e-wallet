import {LoyaltyDropPoolConfigResponse, LoyaltyDropUserBoostResponse, UserBoostStatusType} from "@/models/loyaltydrop/loyaltyDrop";

export function createLoyaltyDropPoolConfigResp(): LoyaltyDropPoolConfigResponse[]{
  return [
    {"id":1,"pool_description":"Power Boost (3mo.)","vesting_type_name":"Advisors","base_tokens":500000000000,"used_tokens":200000000000,"reserved_tokens":100000000000,"rewards_tokens":43750000000,"granted_rewards":50000000,"epoch_number":13,"epoch_period":604800000,"epoch_start_date":"2024-06-03T10:30:00Z"},
    {"id":2,"pool_description":"Energy Boost (6mo.)","vesting_type_name":"Advisors","base_tokens":500000000000,"used_tokens":322590559126,"reserved_tokens":0,"rewards_tokens":112500000000,"granted_rewards":0,"epoch_number":26,"epoch_period":604800000,"epoch_start_date":"2024-06-03T10:30:00Z"},
    {"id":3,"pool_description":"Power Surge (9mo.)","vesting_type_name":"Advisors","base_tokens":350000000000,"used_tokens":219172208034,"reserved_tokens":0,"rewards_tokens":196875000000,"granted_rewards":0,"epoch_number":39,"epoch_period":604800000,"epoch_start_date":"2024-06-03T10:30:00Z"},
    {"id":4,"pool_description":"Energy Surge (12mo.)","vesting_type_name":"Advisors","base_tokens":250000000000,"used_tokens":250000000000,"reserved_tokens":0,"rewards_tokens":225000000000,"granted_rewards":0,"epoch_number":52,"epoch_period":604800000,"epoch_start_date":"2024-06-03T10:30:00Z"}
  ];
}

export function createLoyaltyDropPoolConfigRespSingleObject(baseToken : number, usedToken: number, reservedTokens: number, rewardsToken: number, grantedRewards: number, epochNumber = 13, epochPeriod =604800000, epochStartDate='2024-06-03T10:30:00Z'): LoyaltyDropPoolConfigResponse[]{
  return [
    {"id":1,"pool_description":"Power Boost (3mo.)","vesting_type_name":"Advisors","base_tokens":baseToken,"used_tokens":usedToken,"reserved_tokens":reservedTokens,"rewards_tokens":rewardsToken,"granted_rewards":grantedRewards,"epoch_number":epochNumber,"epoch_period":epochPeriod,"epoch_start_date":epochStartDate}
  ];
}

export function createLoyaltyDropUserBoostResponse():LoyaltyDropUserBoostResponse[]{
  return[{"id":352,"boost_pool_id":1,"vesting_pool_name":"ld-31835","base_account_address":"c4e3403djx5a8uatg2qg7xppp3df84stxh2s0n3oko",
    "status":UserBoostStatusType.SUCCESS,"tx_hash":"2AC813265FA2F61C73BD9F2ADA27C1D9AB1B5B8BA293D30DA9867016FAE5E8CD","granted_rewards":10,
    "amount":1000000,"last_reward_date":"2024-06-06T10:41:46.627Z","lock_start":"2024-06-06T13:41:46.627Z","lock_end":"2024-09-05T13:41:46.627Z"},
    {"id":102,"boost_pool_id":4,"vesting_pool_name":"ld-4725","base_account_address":"c4e3403djx5a8uatg2qg7xppp3df84stxh2s0n3oko",
      "status":UserBoostStatusType.TRANSACTION_IN_PROGRESS,"tx_hash":"0DA2E5A15AA82CAB6DC7D216699B3B777C1B63C3EFE2265162507308F5B29A9C","granted_rewards":null,
      "amount":1800000000,"last_reward_date":null,"lock_start":null,"lock_end":null},
    {"id":33,"boost_pool_id":1,"vesting_pool_name":"ld-56490","base_account_address":"c4e3403djx5a8uatg2qg7xppp3df84stxh2s0n3oko",
      "status":UserBoostStatusType.ERROR,"tx_hash":"A3269A299C2EDF9ED913E41179EE4A3FE45B8E04BBFA045AEDD85E341F973065","granted_rewards":null,
      "amount":1000000,"last_reward_date":null,"lock_start":"2024-06-03T11:56:35.483Z","lock_end":"2024-09-02T11:56:35.483Z"}];
}
