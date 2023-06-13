import {RoundInfo, RoundInfoResponse} from "@/models/saleServiceCommons";
import {useConfigurationStore} from "@/store/configuration.store";
import {Coin} from "@/models/store/common";

export function mapRoundInfo(roundInfo: RoundInfoResponse | undefined): RoundInfo  {
  if (roundInfo === undefined) {
    throw new Error('roundInfo is undefined');
  }
  const denom = useConfigurationStore().config.tokenReservationDenom;
  const reservedTokens = roundInfo.reservedTokens ? roundInfo.reservedTokens : 0;
  const soldTokens = roundInfo.soldTokens ? roundInfo.soldTokens : 0;

  return {
    availableTokens:  new Coin(BigInt( roundInfo.availableTokens), denom),
    reservedTokens: new Coin(BigInt(reservedTokens), denom),
    soldTokens: new Coin(BigInt(soldTokens), denom),
    c4eToUsd: roundInfo.c4eToUsd,
    endDate: new Date(roundInfo.endDate),
    id:roundInfo.id,
    startDate: new Date(roundInfo.startDate)
  };
}


