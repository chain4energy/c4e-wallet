import { BigDecimal } from "@/models/store/big.decimal";
import { Coin, DecCoin } from "@/models/store/common";
import { AxiosError, AxiosResponse } from "axios";
import {TokenPrice} from "@/models/store/tokens";
import {Currency} from "@/models/currency";
import sinonChai from "cypress/types/sinon-chai";

export const accountNotFoundErrorMessage = 'rpc error: code = NotFound desc = account c4e1xe3x4w0ma4dv805q0rhe0c7xk3mv24vatg7pm3 not found: key not found';
export const axiosErrorMessagePrefix = 'Request failed with status code ';
export const axiosError404Message = axiosErrorMessagePrefix + '404';
export const defaultDenom = 'uc4e';

export const defaultAxiosErrorName = 'AxiosError';
export const defaultErrorName = 'Error';

export function createErrorResponseData(code: number, message: string) {
  return {
    code: code,
    message: message,
    details: []
  }
}

export function createAxiosError(message: string, response: AxiosResponse, name = defaultAxiosErrorName): AxiosError {
  const error = new AxiosError();
  error.name = name;
  error.message = message;
  error.response = response;
  return error;
}

export function createErrorResponse(status: number, blockchainErrorCode: number, blockchaineErrorMessage: string) {
  const axiosErrorMessage = axiosErrorMessagePrefix + status;
  const response = {
    data: createErrorResponseData(blockchainErrorCode, blockchaineErrorMessage),
    status: status,
    statusText: '',
  };
  return createAxiosError(axiosErrorMessage, response as AxiosResponse);
}

export function expectCoin(coin: Coin | undefined, expectedAmount: bigint, expectedDenom: string) {
  expect(coin).not.toBeUndefined();
  expect(coin).toBeInstanceOf(Coin);
  expect(coin?.amount).toBe(expectedAmount);
  expect(coin?.denom).toBe(expectedDenom);

}

export function expectDecCoin(coin: DecCoin | undefined, expectedAmount: BigDecimal, expectedDenom: string) {
  expect(coin).not.toBeUndefined();
  expect(coin).toBeInstanceOf(DecCoin);
  expect(coin?.amount).toStrictEqual(expectedAmount);
  expect(coin?.denom).toBe(expectedDenom);

}

export function expectTokenPrice(tokenPrice: TokenPrice | undefined, price: number, timestamp: string | undefined, currency: Currency) {
  expect(tokenPrice).not.toBeUndefined();
  expect(tokenPrice).toBeInstanceOf(TokenPrice);
  expect(tokenPrice?.price).toBe(price);
  if(timestamp) {
    expect(tokenPrice?.timestamp).toStrictEqual(new Date(timestamp));
  }
  expect(tokenPrice?.currency).toBe(currency);
}
