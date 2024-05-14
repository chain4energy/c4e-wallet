import {Coin} from "@/models/store/common";
import {BigDecimal, divideBigInts} from "@/models/store/big.decimal";
import {string} from "yup";
import {useConfigurationStore} from "@/store/configuration.store";

export class BoostConfig {

  poolDescription: string;
  prefixName: string;
  baseTokens:	Coin;
  usedTokens:	Coin;
  reservedTokens: Coin;
  rewardsTokens:	Coin;
  epochPeriod: number;
  epochStartDate: Date;
  apr: number;
  lockPeriod: number;

  constructor(poolDescription: string, prefixName: string, baseTokens: number, usedTokens: number, reservedTokens: number, rewardsTokens: number, epochPeriod: number, epochStartDate: Date, apr: number, lockPeriod: number) {
    this.poolDescription = poolDescription;
    this.prefixName = prefixName;
    this.baseTokens = new Coin(BigInt(baseTokens), getDefaultDenom());
    this.usedTokens = new Coin(BigInt(usedTokens), getDefaultDenom());
    this.reservedTokens = new Coin(BigInt(reservedTokens), getDefaultDenom());
    this.rewardsTokens = new Coin(BigInt(rewardsTokens), getDefaultDenom());
    this.epochPeriod = epochPeriod;
    this.epochStartDate = epochStartDate;
    this.apr = apr;
    this.lockPeriod = lockPeriod;
  }

}

export class UserBoost{
  vestingPoolName: string;
  status: UserBoostStatusType;
  grantedRewards: Coin;


  constructor(vestingPoolName: string, status: UserBoostStatusType, grantedRewards: Coin) {
    this.vestingPoolName = vestingPoolName;
    this.status = status;
    this.grantedRewards = grantedRewards;
  }

}

export enum UserBoostStatusType{
  TRANSACTION_IN_PROGRESS = 'TRANSACTION_IN_PROGRESS',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

//
// CREATE TABLE ev.`USER_BOOST`
// (
//   `ID`                   INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
//   `BOOST_POOL_ID`        INT             NOT NULL,
//   `VESTING_POOL_NAME`    VARCHAR(55)     NOT NULL,
//   `BASE_ACCOUNT_ADDRESS` VARCHAR(55)     NOT NULL,
//   `STATUS`               ENUM ('TRANSACTION_IN_PROGRESS', 'SUCCESS', 'ERROR'),
//   `TX_HASH`              VARCHAR(255),
//   `GRANTED_REWARDS`      BIGINT,
//   `LAST_REWARD_DATE`     DATE,
//   CONSTRAINT userBoostFkPoolConfig FOREIGN KEY (`BOOST_POOL_ID`) REFERENCES `POOL_CONFIGURATION` (`ID`)
// );

function getDefaultDenom():string{
  return useConfigurationStore().config.loyaltyDropService.loyaltyDropDefaultDenom;
}
