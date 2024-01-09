import {
  Gas as JsonGas,
  ViewDenom as JsonViewDenom,
  Configuration as JsonConfiguration,
  KeplrGasPriceSteps as JsonKeplrGasPriceSteps,
   JsonQueriesEv
} from "../json/Configuration";
import queriesDefaults from "@/api/queries";
export class Gas implements JsonGas {
  vote: number;
  delegate: number;
  undelegate: number;
  redelegate: number;
  claimRewards: number;
  transfer: number;

  constructor (
    gas: JsonGas | undefined
  ) {
    if (gas) {
      this.vote = gas.vote;
      this.delegate = gas.delegate;
      this.undelegate = gas.undelegate;
      this.redelegate = gas.redelegate;
      this.claimRewards = gas.claimRewards;
      this.transfer = gas.transfer;

    } else {
      this.vote = 0;
      this.delegate = 0;
      this.undelegate = 0;
      this.redelegate = 0;
      this.claimRewards = 0;
      this.transfer = 0;

    }
  }

}

export class ViewDenom implements JsonViewDenom {
  denom: string;
  viewDenom: string;
  coinDecimals: number;
  conversionFactor: number;

  constructor (
    viewDenom: JsonViewDenom
  ) {
    this.denom = viewDenom.denom;
    this.viewDenom = viewDenom.viewDenom;
    this.coinDecimals = viewDenom.coinDecimals;
    this.conversionFactor = Math.pow(10, this.coinDecimals);
  }
}

export class KeplrGasPriceSteps implements JsonKeplrGasPriceSteps{
  low: number;
  average: number;
  high: number;

  constructor (
    gasPriceSteps: JsonKeplrGasPriceSteps | undefined
  ) {
    if (gasPriceSteps) {
      this.low = gasPriceSteps.low;
      this.average = gasPriceSteps.average;
      this.high = gasPriceSteps.high;
    } else {
      this.low = 0;
      this.average = 0;
      this.high = 0;
    }
  }
}
export class QueriesEv implements JsonQueriesEv{
  LOGIN_WITH_RESOURCE: string;
  LOGIN_WITH_EMAIL_PASSWORD: string;
  EMAIL_CREATE_ACCOUNT: string;
  ACTIVATE_ACCOUNT: string;
  REFRESH_TOKEN: string;
  DECODE_RESOURCE_URL: string;
  CENTRAL_SYSTEM_SERVICE: string;
  constructor (
    queries : JsonQueriesEv | undefined
  ) {
    this.LOGIN_WITH_RESOURCE = queries?.LOGIN_WITH_RESOURCE ? queries?.LOGIN_WITH_RESOURCE : queriesDefaults.ev.LOGIN_EMAIL_AND_LOGIN_DATA;
    this.LOGIN_WITH_EMAIL_PASSWORD = queries?.LOGIN_WITH_EMAIL_PASSWORD ? queries?.LOGIN_WITH_EMAIL_PASSWORD : queriesDefaults.ev.LOGIN_WITH_EMAIL_PASSWORD;
    this.EMAIL_CREATE_ACCOUNT = queries?.EMAIL_CREATE_ACCOUNT ? queries?.EMAIL_CREATE_ACCOUNT : queriesDefaults.ev.EMAIL_CREATE_ACCOUNT;
    this.ACTIVATE_ACCOUNT = queries?.ACTIVATE_ACCOUNT ? queries?.ACTIVATE_ACCOUNT : queriesDefaults.ev.ACTIVATE_ACCOUNT;
    this.REFRESH_TOKEN = queries?.REFRESH_TOKEN ? queries?.REFRESH_TOKEN : queriesDefaults.ev.REFRESH_TOKEN;
    this.DECODE_RESOURCE_URL = queries?.DECODE_RESOURCE_URL ? queries?.DECODE_RESOURCE_URL : queriesDefaults.ev.DECODE_RESOURCE_URL;
    this.CENTRAL_SYSTEM_SERVICE = queries?.CENTRAL_SYSTEM_SERVICE ? queries?.CENTRAL_SYSTEM_SERVICE : queriesDefaults.ev.CENTRAL_SYSTEM_SERVICE;
  }
}

export class Configuration implements JsonConfiguration {
  bcApiURL: string;
  bcRpcURL: string;
  hasuraURL: string;
  keybaseURL: string;
  stakingPageURL: string;
  publicSaleServiceURL: string;
  evServiceURL: string;
  addressPrefix: string;
  stakingDenom: string;
  tokenReservationDenom: string;
  strategicPoolAddress: string[];
  airdropPoolAddress: string;
  chainId: string;
  networkName: string;
  keplrNetworkName: string;
  operationGas: Gas;
  viewDenoms: ViewDenom[];
  isEmpty: boolean;
  testMode: boolean;
  keplrGasPriceSteps: KeplrGasPriceSteps;
  reservedCoinsAmount: number;
  minPeriodBetweenDataRefresh: number;
  blockDataRefreshTimeout: number;
  dashboardDataRefreshTimeout: number;
  validatorsDataRefreshTimeout: number;
  accountDataRefreshTimeout: number;
  proposalsPageLimit: number;
  queriesEv: QueriesEv;
  explorerUrl: string;
  explorerAccount: string;
  explorerTx: string;
  isMainNetwork: boolean;
  testFileName?: string;
  airdropBaseURL: string;
  proposalVotingRefreshTimeout: number;
  airdropDefaultDenom: string;
  faucetURL: string;
  faucetAvailable: boolean;
  targetInflationAprMultiplier: number;
  currentPublicSaleRoundId: number;
  transferDenom: string;
  publicSaleVisible: boolean;
  public static readonly emptyConfiguration = new Configuration();

  constructor(
      configuration?: JsonConfiguration | undefined
  ) {
    if (configuration) {
      this.bcApiURL = configuration.bcApiURL;
      this.bcRpcURL = configuration.bcRpcURL;
      this.hasuraURL = configuration.hasuraURL;
      this.keybaseURL = configuration.keybaseURL;
      this.stakingPageURL = configuration.stakingPageURL;
      this.publicSaleServiceURL = configuration.publicSaleServiceURL;
      this.evServiceURL = configuration.evServiceURL;
      this.addressPrefix = configuration.addressPrefix;
      this.stakingDenom = configuration.stakingDenom;
      this.strategicPoolAddress = configuration.strategicPoolAddress;
      this.airdropPoolAddress = configuration.airdropPoolAddress;
      this.chainId = configuration.chainId;
      this.networkName = configuration.networkName;
      this.keplrNetworkName = configuration.keplrNetworkName;
      this.operationGas = new Gas(configuration.operationGas);
      const viewDenoms = Array<ViewDenom>();
      if (configuration.viewDenoms) {
        configuration.viewDenoms.forEach(d => {
          viewDenoms.push(new ViewDenom(d));
        });
      }
      this.viewDenoms = viewDenoms;
      this.keplrGasPriceSteps = new KeplrGasPriceSteps(configuration.keplrGasPriceSteps);
      this.reservedCoinsAmount = configuration.reservedCoinsAmount;
      this.minPeriodBetweenDataRefresh = configuration.minPeriodBetweenDataRefresh;
      this.blockDataRefreshTimeout = configuration.blockDataRefreshTimeout;
      this.dashboardDataRefreshTimeout = configuration.dashboardDataRefreshTimeout;
      this.validatorsDataRefreshTimeout = configuration.validatorsDataRefreshTimeout;
      this.accountDataRefreshTimeout = configuration.accountDataRefreshTimeout;
      this.proposalsPageLimit = configuration.proposalsPageLimit;
      this.queriesEv = new QueriesEv(configuration.queriesEv);
      this.explorerUrl = configuration.explorerUrl;
      this.explorerAccount = configuration.explorerAccount;
      this.explorerTx = configuration.explorerTx;
      this.isMainNetwork = configuration.isMainNetwork;
      this.isEmpty = false;
      this.testMode = configuration.testMode ? configuration.testMode : false;
      this.testFileName = configuration.testFileName;
      this.airdropBaseURL = configuration.airdropBaseURL;
      this.airdropDefaultDenom = configuration.airdropDefaultDenom;
      this.proposalVotingRefreshTimeout = configuration.proposalVotingRefreshTimeout;
      this.targetInflationAprMultiplier = configuration.targetInflationAprMultiplier;
      this.faucetURL = configuration.faucetURL;
      this.faucetAvailable = configuration.faucetAvailable;
      this.tokenReservationDenom = configuration.tokenReservationDenom;
      this.currentPublicSaleRoundId = configuration.currentPublicSaleRoundId;
      this.transferDenom = configuration.transferDenom;
      this.publicSaleVisible = configuration.publicSaleVisible;
    } else {
      this.bcApiURL = '';
      this.bcRpcURL = '';
      this.hasuraURL = '';
      this.keybaseURL = '';
      this.stakingPageURL = '';
      this.publicSaleServiceURL = ' ';
      this.evServiceURL = '';
      this.addressPrefix = '';
      this.stakingDenom = '';
      this.strategicPoolAddress = [''];
      this.airdropPoolAddress = '';
      this.chainId = '';
      this.networkName = '';
      this.keplrNetworkName = '';
      this.operationGas = new Gas(undefined);
      const viewDenoms = Array<ViewDenom>();
      this.viewDenoms = viewDenoms;
      this.keplrGasPriceSteps = new KeplrGasPriceSteps(undefined);
      this.reservedCoinsAmount = 250000;
      this.minPeriodBetweenDataRefresh = 60000;
      this.blockDataRefreshTimeout = 60000;
      this.dashboardDataRefreshTimeout = 60000;
      this.validatorsDataRefreshTimeout = 60000;
      this.accountDataRefreshTimeout = 60000;
      this.proposalsPageLimit = 10;
      this.queriesEv = new QueriesEv(undefined);
      this.explorerUrl = '';
      this.explorerAccount = '';
      this.explorerTx = '';
      this.isMainNetwork = false;
      this.isEmpty = true;
      this.testMode = false;
      this.airdropBaseURL = '';
      this.airdropDefaultDenom = 'uc4e';
      this.proposalVotingRefreshTimeout = 30000;
      this.targetInflationAprMultiplier = 1;
      this.faucetURL = '';
      this.faucetAvailable = false;
      this.tokenReservationDenom = '';
      this.currentPublicSaleRoundId = 0;
      this.transferDenom = '';
      this.publicSaleVisible = false;
    }
  }
}

