import {BlockchainInfo, ReserveTokensResponse, TokenInfo, TokenReservationResponse} from "@/models/saleServiceCommons";
import {RequestResponse} from "@/models/request-response";
import {ErrorData} from "@/api/base.api";
import {UserServiceErrData} from "@/models/user/userServiceCommons";

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
  reservationList: RequestResponse<TokenReservationResponse[], any>,
  expectedReservation= defaultReservationList){
  const list = reservationList.data;
  if(!list){
    return;
  }
  expect(list.length> 0);
  for (let i = 0; i < list.length; i++){
    expect(list[i].orderId).toBe(expectedReservation[i].orderId);
    expect(list[i].status).toBe(expectedReservation[i].status);
    expect(list[i].amountRequested).toBe(expectedReservation[i].amountRequested);
    expect(list[i].orderEndTime).toBe(expectedReservation[i].orderEndTime);
    expect(list[i].reservationEndTime).toBe(expectedReservation[i].reservationEndTime);
    for(let a = 0; a < list[i].transactions.length; a++){
      expect(list[i].transactions[a].txHash).toBe(expectedReservation[i].transactions[a].txHash);
      expect(list[i].transactions[a].amount).toBe(expectedReservation[i].transactions[a].amount);
      expect(list[i].transactions[a].errorInfo).toBe(expectedReservation[i].transactions[a].errorInfo);
      expect(list[i].transactions[a].blockchain).toBe(expectedReservation[i].transactions[a].blockchain);
    }
  }
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
  expect(list.length> 0);
  for (let i = 0; i < list.length; i++){
    expect(list[i].chainId).toBe(expectedData[i].chainId);
    expect(list[i].chainName).toBe(expectedData[i].chainName);
    for(let a = 0; a < list[i].availableTokens.length; a++){
      expect(list[i].availableTokens[a].c4eAddress).toBe(expectedData[i].availableTokens[a].c4eAddress);
      expect(list[i].availableTokens[a].coinIdentifier).toBe(expectedData[i].availableTokens[a].coinIdentifier);
      expect(list[i].availableTokens[a].exchangeRate).toBe(expectedData[i].availableTokens[a].exchangeRate);
      expect(list[i].availableTokens[a].id).toBe(expectedData[i].availableTokens[a].id);
      expect(list[i].availableTokens[a].name).toBe(expectedData[i].availableTokens[a].name);
    }
  }
}
