import {
  BlockchainTx,
  RoundInfo,
  RoundInfoBlockchainInfo, RoundInfoListMapped,
  RoundInfoResponse,
  TokenReservationResponse
} from "@/models/saleServiceCommons";
import {useConfigurationStore} from "@/store/configuration.store";
import {Coin, DecCoin} from "@/models/store/common";
import {BlockchainTxStore, paymentType, StoreTransaction, TokenReservation} from "@/store/publicSales.store";
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

export function mapRoundInfoList(roundInfoList: RoundInfoResponse[] | undefined): RoundInfoListMapped  {

  if (roundInfoList === undefined) {
    throw new Error('roundInfoList is undefined');
  }

  const denom = useConfigurationStore().config.tokenReservationDenom;
  let activeRoundInfo;

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
    if(roundInfo.active) {
      activeRoundInfo = {roundInfo: storeRoundInfo, blockchainInfo: roundInfo.blockchains};
    }
  });
  return {roundInfoMap: roundInfoMap, activeRoundInfo: activeRoundInfo};
}

export function mapTokenReservations(tokenReservations: TokenReservationResponse[] | undefined): TokenReservation[]  {
  if (tokenReservations === undefined) {
    throw new Error('tokenReservations is undefined');
  }
  const denom = useConfigurationStore().config.tokenReservationDenom;

  const tokenReservationList: TokenReservation[] = [];

  tokenReservations.forEach(reservation => {

    const storeTransactions: StoreTransaction[] = [];

    reservation.transactions?.forEach(reservation => {

      const storeBlockchainTxs: BlockchainTxStore[] = [];

      reservation.blockchainTxs?.forEach(blockchainTx => {

        const storeBlockchainTx: BlockchainTxStore = new BlockchainTxStore(
          Number(blockchainTx.amount),
          blockchainTx.coinIdentifier,
          blockchainTx.coinName
        );

        storeBlockchainTxs.push(storeBlockchainTx);

      });

      const storeTransaction: StoreTransaction = new StoreTransaction(
        reservation.blockchainStatus,
        reservation.status,
        reservation.txHash,
        reservation.type,
        storeBlockchainTxs,
        reservation.currencyCode,
        reservation.amount,
        reservation.blockchain
      );

      storeTransactions.push(storeTransaction);
    });


    const storeReservation: TokenReservation = new TokenReservation(
      reservation.orderId,
      new DecCoin(new BigDecimal(reservation.amountRequested), denom),
      reservation.status,
      storeTransactions,
      new Date(reservation.reservationEndTime),
      new Date(reservation.orderEndTime),
      reservation.roundId,
      reservation.unconfirmed,
      new Date(reservation.timestamp)
    );
    tokenReservationList.push(storeReservation);
  });

  return tokenReservationList;
}
