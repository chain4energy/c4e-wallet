import { setActivePinia, createPinia } from 'pinia'
import axios, { AxiosError, AxiosInstance, AxiosResponse, AxiosResponseHeaders } from 'axios';
import { AccountApi } from "@/api/account.api";

export class TestAccountApi extends AccountApi {

  setAxiosInstance(axios: AxiosInstance) {
    this.axiosInstance = axios
  }
}

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;
    
const api = new TestAccountApi()
api.setAxiosInstance(axios)

// beforeAll(() => {
//   mockedAxios.create.mockReturnValue(mockedAxios);
// });

describe('get account', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  });

  // it('gets base account', async () => {
  //   const account = {
  //     data: {
  //       account: {
  //         "@type": "/cosmos.auth.v1beta1.BaseAccount",
  //         address: "c4e13zg4u07ymq83uq73t2cq3dj54jj37zzgqfwjpg",
  //         pub_key: {
  //           "@type": "/cosmos.crypto.secp256k1.PubKey",
  //           key: "Al619Y81/xqLCl6oREVwtBPpcwv0RuR9C4KbdNQnOwbB"
  //         },
  //         account_number: "25",
  //         sequence: "43"
  //       }
  //     }
  //   };

  //   mockedAxios.request.mockResolvedValue(account);
  //   const result = await api.fetchAccount('c4e13zg4u07ymq83uq73t2cq3dj54jj37zzgqfwjpg')
  //   expect(result.isError()).toBe(false)
  //   expect(result.isSuccess()).toBe(true)
  //   expect(result.error).toBeUndefined()
  //   expect(result.data?.account.address).toBe('c4e13zg4u07ymq83uq73t2cq3dj54jj37zzgqfwjpg')
  //   expect(result.data?.account['@type']).toBe('/cosmos.auth.v1beta1.BaseAccount')

  // });

  // it('gets unecpected data', async () => {
  //   const account = [
  //     { id: 1, name: "John" },
  //     { id: 2, name: "Andrew" },
  //   ];
  //   mockedAxios.request.mockResolvedValue(account);
  //   const result = await api.fetchAccount('123123');
  //   expect(result.isError()).toBe(true);
  //   expect(result.isSuccess()).toBe(false);
  //   expect(result.error?.name).toBe('TypeError');
  //   expect(result.error?.message).toBe('Cannot read properties of undefined (reading \'request\')');

  // });

  // it('gets unecpected data 2', async () => {
  //   const account = {
  //     status: 401,
  //     data: {
  //       accasfount: "afsdfadsadfs"
  //     }
  //   };
  //   mockedAxios.request.mockResolvedValue(account);
  //   const result = await api.fetchAccount('123123');
  //   expect(result.isError()).toBe(true);
  //   expect(result.isSuccess()).toBe(false);
  //   expect(result.error?.name).toBe('TypeError');
  //   expect(result.error?.message).toBe('Cannot read properties of undefined (reading \'request\')');

  // });

  it('gets not existent address', async () => {
    const response = {
      data: {
        "code": 5,
        "message": "rpc error: code = NotFound desc = account c4e1xe3x4w0ma4dv805q0rhe0c7xk3mv24vatg7pm3 not found: key not found",
        "details": [
        ]
      },
      status: 404,
      statusText: '',
      // headers: "AxiosResponseHeaders",


    };
    const error = new AxiosError();
    error.name = 'AxiosError';
    error.message = 'Request failed with status code 404';
    error.response = response as AxiosResponse

    mockedAxios.request.mockRejectedValue(error);
    const result = await api.fetchAccount('c4e1xe3x4w0ma4dv805q0rhe0c7xk3mv24vatg7pm3');
    expect(result.isError()).toBe(true);
    expect(result.isSuccess()).toBe(false);
    expect(result.error?.name).toBe('AxiosError');
    expect(result.error?.message).toBe('Request failed with status code 404');
    expect(result.error?.data?.code).toBe(5);
    expect(result.error?.status).toBe(404);


  });
});