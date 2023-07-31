import {Coin} from "@/models/store/common";
import {BigDecimal} from "@/models/store/big.decimal";
import {BackendAppError} from "@/models/request-response";

export interface ReserveTokensRequest {
  roundId: number;
  amount: number;
}

export interface ReserveTokensResponse {
  orderId: number
}

export interface CancelReservationRequest {
  orderId: number
}

export interface InitPaymentSessionRequest {
  orderId: number;
  offeredCurrencyCode: string;
  offeredAmount: number;
}

export interface InitPaymentSessionResponse {
  transactionId: string;
}

export interface TokenReservationResponse {
  amountRequested: number;
  orderEndTime: string;
  timestamp: string;
  orderId: number;
  reservationEndTime: string;
  roundId: number;
  status: RESERVATION_STATUS;
  transactions?: Transaction[];
  unconfirmed: boolean;
}

export enum RESERVATION_STATUS {
  DECLARED = "DECLARED",
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  OVERPAID = 'OVERPAID',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
  CANCELED = 'CANCELED'
}

export enum TRANSACTION_STATUS {
  NOT_VERIFIED = 'NOT_VERIFIED',
  OK = 'OK',
  NO_CORRECT_TOKEN = 'NO_CORRECT_TOKEN',
  NOT_FOUND = 'NOT_FOUND',
  INVALID_TX_HASH = 'INVALID_TX_HASH',
  INVALID_TX = 'INVALID_TX',
  TRANSFER_SOURCE_ADDRESS_UNRECOGNIZED = 'TRANSFER_SOURCE_ADDRESS_UNRECOGNIZED',
  TRANSFER_RECIPIENT_ADDRESS_INCORRECT = 'TRANSFER_RECIPIENT_ADDRESS_INCORRECT',
  FAILED = 'FAILED',
  PGW_FAILED = 'PGW_FAILED'
}

export enum BLOCKCHAIN_STATUS {
  UNCONFIRMED = 'UNCONFIRMED',
  CONFIRMED = 'CONFIRMED',
  PREPARATION = 'PREPARATION',
  NOT_VERIFIED = 'NOT_VERIFIED'
}

export enum PAYMENT_TYPE {
  COIN = 'COIN',
  FIAT = 'FIAT'
}

export enum BLOCKCHAIN {
  SEPOLIA = 'SEPOLIA',
  BSC = 'BSC',
  POLYGON = 'POLYGON'
}

export enum TRANSACTION_CURRENCY {
  PLN = 'PLN',
  EUR = 'EUR',
  USD = 'USD'
}

export interface Transaction {
  blockchainStatus: BLOCKCHAIN_STATUS;
  status: TRANSACTION_STATUS;
  txHash: string;
  type: PAYMENT_TYPE;
  blockchainTxs?: BlockchainTx[];
  currencyCode: TRANSACTION_CURRENCY;
  amount: string;
  blockchain: BLOCKCHAIN;
}

export interface BlockchainTx {
  amount: string;
  coinIdentifier: string;
  coinName: TOKEN_NAME;
}

export interface TokenPaymentProofRequest {
  blockchainID: number;
  exchangeID: number;
  orderID: number;
  txHashes: string[];
}

export interface MetamaskPayInfo {
  blockchainID: number;
  exchangeID: number;
  orderId: number;
  amount: string;
  blockchainAddress: string;
  coinDecimals: number;
  c4eAddress: string;
}

export enum CHAIN_NAME {
  SEPOLIA = 'SEPOLIA',
  BSC = 'BSC',
  POLYGON = 'POLYGON'
}

export interface BlockchainInfo {
  tokenExchanges: TokenInfo[];
  chainId: number;
  chainName: CHAIN_NAME;
  id: number;
}

export enum TOKEN_NAME {
  USDC = 'USDC-PB',
  USDT = 'USDT-PB'
}

export interface TokenInfo {
  recipientAddress: string;
  coinIdentifier: string;
  exchangeRate: uC4eToUsd;
  id: number;
  name: TOKEN_NAME;
  decimals: number;
}

export interface RoundInfoResponse {
  active: boolean;
  blockchains: BlockchainInfo[];
  endDate: string;
  startDate: string;
  availableTokens: number;
  name: string;
  reservedTokens: number;
  soldTokens: number;
  totalTokens: number;
  uC4eToUsd: uC4eToUsd;
  id: number;
}

export interface RoundInfo {
  availableTokens: Coin;
  reservedTokens: Coin;
  soldTokens: Coin;
  totalTokens: Coin;
  uC4eToUsd: BigDecimal;
  endDate: Date;
  startDate: Date;
  id: number;
  name: string;
}

export interface RoundInfoListMapped {
  activeRoundInfo: RoundInfoBlockchainInfo | undefined;
  roundInfoMap: Map<number, RoundInfoBlockchainInfo>;
}

export interface RoundInfoBlockchainInfo {
  roundInfo: RoundInfo;
  blockchainInfo: BlockchainInfo[];
}

export interface uC4eToUsd {
  amount: number;
  decimal: number;
}

export interface SaleServiceApplicationError {
  code: number,
  name: string,
  codespace: SaleServiceApplicationErrorCodespace,
  message: string,
  data: Date,
  causeMessage: string,
  causeAppError: SaleServiceApplicationError
}

export enum SaleServiceApplicationErrorCodespace {
  API = 'api',
  AUTH = 'auth',
  CACHE = 'cache',
  ETH_CLIENT = 'eth-client',
  KYC_PROVIDER = 'kyc-provider',
  NOTIFIER = 'notifier',
  PAYMENT_GW = 'payment-gw',
  PERSISTENCE = 'persistence',
  SERVICE = 'service',
  SIGNATURE = 'signature'
}

export enum SaleServiceApplicationErrorName {

  AUTH_PASSWORD_TOO_SHORT = 'AUTH_PASSWORD_TOO_SHORT',
  AUTH_PASSWORD_NO_DIGIT = 'AUTH_PASSWORD_NO_DIGIT',
  AUTH_PASSWORD_NO_LETTER = 'AUTH_PASSWORD_NO_LETTER',
  AUTH_PASSWORD_NO_LOWERCASE = 'AUTH_PASSWORD_NO_LOWERCASE',
  AUTH_PASSWORD_NO_UPPERCASE = 'AUTH_PASSWORD_NO_UPPERCASE',
  AUTH_PASSWORD_NO_SPECIAL_CHAR = 'AUTH_PASSWORD_NO_SPECIAL_CHAR',
  SERVICE_LOGIN_FAILED = 'SERVICE_LOGIN_FAILED',
  SERVICE_ACCOUNT_ALREADY_EXISTS = 'SERVICE_ACCOUNT_ALREADY_EXISTS',
  SERVICE_ACCOUNT_INACTIVE = 'SERVICE_ACCOUNT_INACTIVE',
  SERVICE_ACCOUNT_ACTIVATION_TIME_EXPIRED = 'SERVICE_ACCOUNT_ACTIVATION_TIME_EXPIRED',
  SERVICE_ACCOUNT_PAIRING_TIME_EXPIRED = 'SERVICE_ACCOUNT_PAIRING_TIME_EXPIRED',

  PERSISTENCE_ERROR = 'PERSISTENCE_ERROR',
  PERSITENCE_RESOURCE_NOT_FOUND = 'PERSITENCE_RESOURCE_NOT_FOUND',
  PERSITENCE_RESOURCE_TOO_MANY = 'PERSITENCE_RESOURCE_TOO_MANY',
  PERSITENCE_COMMIT_ERROR = 'PERSITENCE_COMMIT_ERROR',
  PERSITENCE_ROLLBACK_ERROR = 'PERSITENCE_ROLLBACK_ERROR',
  PERSITENCE_FIND_ERROR = 'PERSITENCE_FIND_ERROR',
  PERSITENCE_CREATE_ERROR = 'PERSITENCE_CREATE_ERROR',
  PERSITENCE_UPDATE_ERROR = 'PERSITENCE_UPDATE_ERROR',
  PERSITENCE_AVAILABLE_TOKEN_POOL_EXCEEDED = 'PERSITENCE_AVAILABLE_TOKEN_POOL_EXCEEDED',
  PERSITENCE_ORDER_PUBLIC_SALE_ROUND_INACTIVE = 'PERSITENCE_ORDER_PUBLIC_SALE_ROUND_INACTIVE',
  PERSITENCE_ORDER_AMOUNT_NOT_POSITIVE = 'PERSITENCE_ORDER_AMOUNT_NOT_POSITIVE',
  PERSITENCE_ORDER_TX_CLOSED_ORDER = 'PERSITENCE_ORDER_TX_CLOSED_ORDER',
  PERSITENCE_ORDER_TX_NOT_UNIQUE_BLOCKHAIN_AND_TX_HASH = 'PERSITENCE_ORDER_TX_NOT_UNIQUE_BLOCKHAIN_AND_TX_HASH',
  PERSITENCE_USER_NOT_UNIQUE_KYC_SESSION_ID = 'PERSITENCE_USER_NOT_UNIQUE_KYC_SESSION_ID',
  PERSITENCE_USER_NOT_UNIQUE_CLAIM_ADDRESS = 'PERSITENCE_USER_NOT_UNIQUE_CLAIM_ADDRESS',
  PERSITENCE_USER_NOT_UNIQUE_EVM_ADDRESS = 'PERSITENCE_USER_NOT_UNIQUE_EVM_ADDRESS'

}
