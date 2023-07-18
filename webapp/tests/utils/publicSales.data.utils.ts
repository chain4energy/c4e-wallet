import {BlockchainInfo, ReserveTokensResponse, TokenInfo, TokenReservationResponse} from "@/models/saleServiceCommons";
import {RequestResponse} from "@/models/request-response";
import {ErrorData} from "@/api/base.api";
import {UserServiceErrData} from "@/models/user/userServiceCommons";
import {TokenReservation} from "@/store/publicSales.store";

export function createReservationList(){
  return [
    {
      orderId: 1,
      status: 'DECLARED',
      amountRequested: 20000000,
      orderEndTime: '2023-06-11T12:54:03.326Z',
      reservationEndTime: '2023-06-11T13:54:03.326Z',
      transactions:[{
        txHash: '',
        amount: '20000000',
        errorInfo: '',
        blockchain: '',
      }]
    }
  ];
}

export function createReservationToken(){
  return {
    orderId: 1
  }
}
export function createBlockchainInfo(){
  return{
    availableTokens: [
      {
        c4eAddress: 'someAddress',
        coinIdentifier: 'c4e',
        exchangeRate: 0.7,
        id: 1,
        name: 'some Id'
      }
    ],
    chainId: 1,
    chainName: 'test',
    id: 1,
  };
}
export const defaultReservationList = [
  {
    orderId: 1,
    status: 'DECLARED',
    amountRequested: 20000000n,
    orderEndTime: new Date('2023-06-11T12:54:03.326Z'),
    reservationEndTime: new Date('2023-06-11T13:54:03.326Z'),
    transactions:[{
      txHash: '',
      amount: '20000000',
      errorInfo: '',
      blockchain: '',
    }]
  }
];

export const defaultBlockchainData = [
  {
    availableTokens: [
      {
        c4eAddress: 'someAddress',
        coinIdentifier: 'c4e',
        exchangeRate: 0.7,
        id: 1,
        name: 'some Id'
      }
    ],
    chainId: 1,
    chainName: 'test',
    id: 1,
  }
]
export function expectReservationList(
  reservationList: RequestResponse<TokenReservation[], any>,
  expectedReservation= defaultReservationList){
  const list = reservationList.data;
  if(!list){
    return;
  }
  // expect(list.length> 0);
  // for (let i = 0; i < list.length; i++){
  //   expect(list[i].orderId).toBe(expectedReservation[i].orderId);
  //   expect(list[i].status).toBe(expectedReservation[i].status);
  //   expect(list[i].amount.amount).toBe(expectedReservation[i].amountRequested);
  //   expect(list[i].orderEndTime).toEqual(expectedReservation[i].orderEndTime);
  //   expect(list[i].reservationEnd).toEqual(expectedReservation[i].reservationEndTime);
  //   for(let a = 0; a < list[i].transactions.length; a++){
  //     expect(list[i].transactions[a].txHash).toBe(expectedReservation[i].transactions[a].txHash);
  //     expect(list[i].transactions[a].amount).toBe(expectedReservation[i].transactions[a].amount);
  //     expect(list[i].transactions[a].errorInfo).toBe(expectedReservation[i].transactions[a].errorInfo);
  //     expect(list[i].transactions[a].blockchain).toBe(expectedReservation[i].transactions[a].blockchain);
  //   }
  // }
}

export function expectReserveTokens(token : RequestResponse<ReserveTokensResponse, any>){
  expect(token).not.toBeUndefined();
}
export function expectBlockchainInfo(
  reservationList: RequestResponse<BlockchainInfo[], ErrorData<UserServiceErrData>>,
  expectedData= defaultBlockchainData){
  const list = reservationList.data;
  if(!list){
    return;
  }
  // expect(list.length> 0);
  // for (let i = 0; i < list.length; i++){
  //   expect(list[i].chainId).toBe(expectedData[i].chainId);
  //   expect(list[i].chainName).toBe(expectedData[i].chainName);
  //   for(let a = 0; a < list[i].tokenExchanges.length; a++){
  //     expect(list[i].tokenExchanges[a].recipientAddress).toBe(expectedData[i].availableTokens[a].c4eAddress);
  //     expect(list[i].tokenExchanges[a].coinIdentifier).toBe(expectedData[i].availableTokens[a].coinIdentifier);
  //     expect(list[i].tokenExchanges[a].exchangeRate).toBe(expectedData[i].availableTokens[a].exchangeRate);
  //     expect(list[i].tokenExchanges[a].id).toBe(expectedData[i].availableTokens[a].id);
  //     expect(list[i].tokenExchanges[a].name).toBe(expectedData[i].availableTokens[a].name);
  //   }
  // }
}
