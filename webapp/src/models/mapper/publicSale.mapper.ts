import {
  RoundInfo,
  RoundInfoBlockchainInfo,
  RoundInfoResponse,
  TokenReservationResponse
} from "@/models/saleServiceCommons";
import {useConfigurationStore} from "@/store/configuration.store";
import {Coin} from "@/models/store/common";
import {paymentType, TokenReservation} from "@/store/publicSales.store";
import {BigDecimal} from "@/models/store/big.decimal";

export function mapRoundInfo(roundInfo: RoundInfoResponse | undefined): RoundInfoBlockchainInfo  {

  if (roundInfo === undefined) {
    throw new Error('roundInfo is undefined');
  }
  const denom = useConfigurationStore().config.tokenReservationDenom;
  const reservedTokens = roundInfo.reservedTokens ? roundInfo.reservedTokens : 0;
  const soldTokens = roundInfo.soldTokens ? roundInfo.soldTokens : 0;
  const totalTokens = roundInfo.totalTokens ? roundInfo.totalTokens : 0;

  const storeRoundInfo: RoundInfo = {
    name: roundInfo.name,
    availableTokens:  new Coin(BigInt( roundInfo.availableTokens), denom),
    reservedTokens: new Coin(BigInt(reservedTokens), denom),
    soldTokens: new Coin(BigInt(soldTokens), denom),
    totalTokens: new Coin(BigInt(totalTokens), denom),
    uC4eToUsd: new BigDecimal(roundInfo.uC4eToUsd.amount, roundInfo.uC4eToUsd.decimal),
    endDate: new Date(roundInfo.endDate),
    id:roundInfo.id,
    startDate: new Date(roundInfo.startDate)
  };

  return {roundInfo: storeRoundInfo, blockchainInfo: roundInfo.blockchains};
}

export function mapRoundInfoList(roundInfoList: RoundInfoResponse[] | undefined): Map<number, RoundInfoBlockchainInfo>  {

  if (roundInfoList === undefined) {
    throw new Error('roundInfoList is undefined');
  }

  const denom = useConfigurationStore().config.tokenReservationDenom;

  const roundInfoMap = new Map<number, RoundInfoBlockchainInfo>();

  roundInfoList.forEach(roundInfo => {
    const reservedTokens = roundInfo.reservedTokens ? roundInfo.reservedTokens : 0;
    const soldTokens = roundInfo.soldTokens ? roundInfo.soldTokens : 0;
    const totalTokens = roundInfo.totalTokens ? roundInfo.totalTokens : 0;

    const storeRoundInfo: RoundInfo = {
      name: roundInfo.name,
      availableTokens:  new Coin(BigInt( roundInfo.availableTokens), denom),
      reservedTokens: new Coin(BigInt(reservedTokens), denom),
      soldTokens: new Coin(BigInt(soldTokens), denom),
      totalTokens: new Coin(BigInt(totalTokens), denom),
      uC4eToUsd: new BigDecimal(roundInfo.uC4eToUsd.amount, roundInfo.uC4eToUsd.decimal),
      endDate: new Date(roundInfo.endDate),
      id:roundInfo.id,
      startDate: new Date(roundInfo.startDate)
    };
    const roundInfoBlockchainInfo: RoundInfoBlockchainInfo = {roundInfo: storeRoundInfo, blockchainInfo: roundInfo.blockchains};
    roundInfoMap.set(roundInfo.id, roundInfoBlockchainInfo);
  });
  return roundInfoMap;
}

export function mapTokenReservations(tokenReservations: TokenReservationResponse[] | undefined): TokenReservation[]  {
  if (tokenReservations === undefined) {
    throw new Error('tokenReservations is undefined');
  }
  const denom = useConfigurationStore().config.tokenReservationDenom;

  const tokenReservationList: TokenReservation[] = [];

  tokenReservations.forEach(reservation => {

    const storeReservation: TokenReservation = new TokenReservation(
      reservation.orderId,
      new Coin(BigInt(reservation.amountRequested), denom),
      paymentType.Crypto,
      reservation.status,
      reservation.transactions,
      new Date(reservation.reservationEndTime),
      new Date(reservation.orderEndTime)
    );
    tokenReservationList.push(storeReservation);
  });

  return tokenReservationList;
}
