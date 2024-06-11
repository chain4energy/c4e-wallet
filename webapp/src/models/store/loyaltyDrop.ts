import {Coin} from "@/models/store/common";
import {useConfigurationStore} from "@/store/configuration.store";
import {UserBoostStatusType} from "@/models/loyaltydrop/loyaltyDrop";

export class LoyaltyDropPoolConfig {

  /*
 `ID`                INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `POOL_DESCRIPTION`  VARCHAR(55)     NOT NULL,
  `VESTING_TYPE_NAME` VARCHAR(55)     NOT NULL,
  `BASE_TOKENS`       BIGINT          NOT NULL,
  `REWARDS_TOKENS`    BIGINT          NOT NULL,
  `USED_TOKENS`       BIGINT          NULL,
  `RESERVED_TOKENS`   BIGINT          NOT NULL,
  `EPOCH_NUMBER`      BIGINT          NOT NULL,
  `EPOCH_PERIOD`      BIGINT          NOT NULL,
  `EPOCH_START_DATE`  DATETIME(3)     NOT NULL,
 */
  id:number;
  poolDescription: string;
  vestingType: string;
  baseTokens:	Coin;
  rewardsTokens: Coin;
  usedTokens:	Coin;
  reservedTokens: Coin;
  grantedRewards: Coin;
  epochNumber: number;
  epochPeriod: number;
  epochStartDate: Date;


  constructor(id:number, poolDescription: string, vestingType: string, baseTokens: number, rewardsTokens: number, usedTokens: number, reservedTokens: number, grantedRewards: number, epochNumber: number,
              epochPeriod: number, epochStartDate: Date) {
    this.id = id;
    this.poolDescription = poolDescription;
    this.vestingType = vestingType;
    this.baseTokens =  new Coin(BigInt(baseTokens), getDefaultDenom());
    this.rewardsTokens = new Coin(BigInt(rewardsTokens), getDefaultDenom());
    this.usedTokens = new Coin(BigInt(usedTokens), getDefaultDenom());
    this.reservedTokens = new Coin(BigInt(reservedTokens), getDefaultDenom());
    this.grantedRewards= new Coin(BigInt(grantedRewards), getDefaultDenom());
    this.epochNumber = epochNumber;
    this.epochPeriod = epochPeriod;
    this.epochStartDate = epochStartDate;
  }

  public get lockupPeriod() {
    return this.epochPeriod * this.epochNumber;
  }

}

export class LoyaltyDropUserBoost {

  /*    `ID`                   INT PRIMARY KEY                                      NOT NULL AUTO_INCREMENT,
    `BOOST_POOL_ID`        INT                                                  NOT NULL,
    `VESTING_POOL_NAME`    VARCHAR(55)                                          NOT NULL,
    `BASE_ACCOUNT_ADDRESS` VARCHAR(55)                                          NOT NULL,
    `STATUS`               ENUM ('TRANSACTION_IN_PROGRESS', 'SUCCESS', 'ERROR') NOT NULL,
    `TX_HASH`              VARCHAR(255)                                         NULL,
    `GRANTED_REWARDS`      BIGINT                                               NULL,
    `AMOUNT`               BIGINT                                               NULL,
    `LAST_REWARD_DATE`     DATETIME(3)                                          NULL,
    `LOCK_START`           DATETIME(3)                                          NULL,
    `LOCK_END`             DATETIME(3)                                          NULL,
    */
  boostPoolId: number;
  vestingPoolName: string;
  baseAccountAddress: string;
  status: UserBoostStatusType;
  txHash: string;
  grantedRewards: Coin | null;
  amount:Coin;
  lastRewardDate:Date | null;
  lockStart:Date | null;
  lockEnd:Date | null;


  constructor(boostPoolId: number, vestingPoolName: string, baseAccountAddress: string, status: UserBoostStatusType, txHash: string, grantedRewards: number, amount: number, lastRewardDate:Date | null, lockStart: Date | null, lockEnd: Date | null) {
    this.boostPoolId = boostPoolId;
    this.vestingPoolName = vestingPoolName;
    this.baseAccountAddress = baseAccountAddress;
    this.status = status;
    this.txHash = txHash;
    this.grantedRewards = grantedRewards? new Coin(BigInt(grantedRewards), getDefaultDenom()) : null;
    this.amount = new Coin(BigInt(amount), getDefaultDenom());
    this.lastRewardDate = lastRewardDate;
    this.lockStart = lockStart;
    this.lockEnd = lockEnd;
  }
}


function getDefaultDenom():string{
  return useConfigurationStore().config.loyaltyDropService.loyaltyDropDefaultDenom;
}
