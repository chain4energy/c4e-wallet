import {RoundInfo, RoundInfoResponse, TokenReservationResponse} from "@/models/saleServiceCommons";
import {useConfigurationStore} from "@/store/configuration.store";
import {Coin} from "@/models/store/common";
import {paymentType, TokenReservation} from "@/store/publicSales.store";

export function mapRoundInfo(roundInfo: RoundInfoResponse | undefined): RoundInfo  {
  if (roundInfo === undefined) {
    throw new Error('roundInfo is undefined');
  }
  const denom = useConfigurationStore().config.tokenReservationDenom;
  const reservedTokens = roundInfo.reservedTokens ? roundInfo.reservedTokens : 0;
  const soldTokens = roundInfo.soldTokens ? roundInfo.soldTokens : 0;
  const totalTokens = roundInfo.totalTokens ? roundInfo.totalTokens : 0;

  return {
    availableTokens:  new Coin(BigInt( roundInfo.availableTokens), denom),
    reservedTokens: new Coin(BigInt(reservedTokens), denom),
    soldTokens: new Coin(BigInt(soldTokens), denom),
    totalTokens: new Coin(BigInt(totalTokens), denom),
    c4eToUsd: roundInfo.c4eToUsd,
    endDate: new Date(roundInfo.endDate),
    id:roundInfo.id,
    startDate: new Date(roundInfo.startDate)
  };
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
