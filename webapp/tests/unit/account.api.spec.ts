import { setActivePinia, createPinia } from 'pinia'
import axios, { AxiosError, AxiosInstance, AxiosResponse, AxiosResponseHeaders } from 'axios';
import { AccountType, ContinuousVestingData } from "@/models/store/account";
import apiFactory from "@/api/factory.api";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;
const api = apiFactory.accountApi()
apiFactory.setAxiosInstance(mockedAxios)

describe('get account', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  });

  it('gets BaseAccount', async () => {
    const account = {
      data: {
        account: {
          "@type": "/cosmos.auth.v1beta1.BaseAccount",
          address: "c4e13zg4u07ymq83uq73t2cq3dj54jj37zzgqfwjpg",
          pub_key: {
            "@type": "/cosmos.crypto.secp256k1.PubKey",
            key: "Al619Y81/xqLCl6oREVwtBPpcwv0RuR9C4KbdNQnOwbB"
          },
          account_number: "25",
          sequence: "43"
        }
      }
    };

    mockedAxios.request.mockResolvedValue(account);
    const result = await api.fetchAccount('c4e13zg4u07ymq83uq73t2cq3dj54jj37zzgqfwjpg')
    expect(result.isError()).toBe(false)
    expect(result.isSuccess()).toBe(true)
    expect(result.error).toBeUndefined()
    expect(result.data?.address).toBe('c4e13zg4u07ymq83uq73t2cq3dj54jj37zzgqfwjpg')
    expect(result.data?.type).toBe(AccountType.BaseAccount)
    expect(result.data?.continuousVestingData).toBeUndefined();

  });

  it('gets ContinuousVestingAccount', async () => {
    const account = {
      data: {
        account: {
          "@type": "/cosmos.vesting.v1beta1.ContinuousVestingAccount",
          base_vesting_account: {
            base_account: {
              address: "c4e17svcuc8dt7gr4hlu3rmeu5u0jpc7snar3kdr55",
              pub_key: {
                "@type": "/cosmos.crypto.secp256k1.PubKey",
                key: "dvvcfsvwfevceewcw"
              },
              account_number: "52",
              sequence: "1"
            },
            original_vesting: [
              {
                denom: "uc4e",
                amount: "100000000000"
              }
            ],
            delegated_free: [],
            delegated_vesting: [
              {
                denom: "uc4e",
                amount: "12"
              }
            ],
            end_time: "1657372098"
          },
          start_time: "1657112898"
        }
      }
    };

    mockedAxios.request.mockResolvedValue(account);
    const result = await api.fetchAccount('c4e13zg4u07ymq83uq73t2cq3dj54jj37zzgqfwjpg');
    expect(result.isError()).toBe(false);
    expect(result.isSuccess()).toBe(true);
    expect(result.error).toBeUndefined();
    expect(result.data?.address).toBe('c4e17svcuc8dt7gr4hlu3rmeu5u0jpc7snar3kdr55');
    expect(result.data?.type).toBe(AccountType.ContinuousVestingAccount);
    expect(result.data?.continuousVestingData).toBeInstanceOf(ContinuousVestingData);
    expect(result.data?.continuousVestingData?.endTime).toBe('1657372098000');
    expect(result.data?.continuousVestingData?.startTime).toBe('1657112898000');
    expect(result.data?.continuousVestingData?.originalVesting.length).toBe(1);
    const origVesting = result.data?.continuousVestingData?.originalVesting[0]
    expect(origVesting?.amount).toBe('100000000000');
    expect(origVesting?.denom).toBe('uc4e');
  });

  it('gets unecpected data', async () => {
    const account = [
      { id: 1, name: "John" },
      { id: 2, name: "Andrew" },
    ];
    mockedAxios.request.mockResolvedValue(account);
    const result = await api.fetchAccount('123123');
    expect(result.isError()).toBe(true);
    expect(result.isSuccess()).toBe(false);
    expect(result.error?.name).toBe('Error');
    expect(result.error?.message).toBe('Account is undefined');

  });

  it('gets unecpected data 2', async () => {
    const account = {
      status: 401,
      data: {
        accasfount: "afsdfadsadfs"
      }
    };
    mockedAxios.request.mockResolvedValue(account);
    const result = await api.fetchAccount('123123');
    expect(result.isError()).toBe(true);
    expect(result.isSuccess()).toBe(false);
    expect(result.error?.name).toBe('Error');
    expect(result.error?.message).toBe('Account is undefined');
  });

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
    expect(result.isError()).toBe(false)
    expect(result.isSuccess()).toBe(true)
    expect(result.error).toBeUndefined()
    expect(result.data?.address).toBe('c4e1xe3x4w0ma4dv805q0rhe0c7xk3mv24vatg7pm3')
    expect(result.data?.type).toBe(AccountType.Nonexistent)
    expect(result.data?.continuousVestingData).toBeUndefined();
  });

  it('gets address with 404 response and error code 0', async () => {
    const response = {
      data: {
        "code": 0,
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
    expect(result.error?.data?.code).toBe(0);
    expect(result.error?.data?.message).toBe('rpc error: code = NotFound desc = account c4e1xe3x4w0ma4dv805q0rhe0c7xk3mv24vatg7pm3 not found: key not found');
  });

  it('gets address with 404 response and error messege <> NotFound', async () => {
    const response = {
      data: {
        "code": 5,
        "message": "some error message",
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
    expect(result.error?.data?.message).toBe('some error message');
  });

  it('gets address with not 404 response and error messege <> NotFound', async () => {
    const response = {
      data: {
        "code": 5,
        "message": "rpc error: code = NotFound desc = account c4e1xe3x4w0ma4dv805q0rhe0c7xk3mv24vatg7pm3 not found: key not found",
        "details": [
        ]
      },
      status: 401,
      statusText: '',
      // headers: "AxiosResponseHeaders",
    };
    const error = new AxiosError();
    error.name = 'AxiosError';
    error.message = 'Request failed with status code 401';
    error.response = response as AxiosResponse

    mockedAxios.request.mockRejectedValue(error);
    const result = await api.fetchAccount('c4e1xe3x4w0ma4dv805q0rhe0c7xk3mv24vatg7pm3');
    expect(result.isError()).toBe(true);
    expect(result.isSuccess()).toBe(false);
    expect(result.error?.name).toBe('AxiosError');
    expect(result.error?.message).toBe('Request failed with status code 401');
    expect(result.error?.data?.code).toBe(5);
    expect(result.error?.data?.message).toBe('rpc error: code = NotFound desc = account c4e1xe3x4w0ma4dv805q0rhe0c7xk3mv24vatg7pm3 not found: key not found');
  });

  it('gets balance', async () => {
    const balance = {
      data: {
        balance: {
          denom: "uc4e",
          amount: "43"
        }
      }
    };

    mockedAxios.request.mockResolvedValue(balance);
    const result = await api.fetchBalance('c4e13zg4u07ymq83uq73t2cq3dj54jj37zzgqfwjpg', 'uc4e')
    expect(result.isError()).toBe(false)
    expect(result.isSuccess()).toBe(true)
    expect(result.error).toBeUndefined()
    expect(result.data?.amount).toBe('43')
    expect(result.data?.denom).toBe('uc4e')
  });

  it('gets balance wth error', async () => {
    const response = {
      data: {
        "code": 3,
        "message": "rpc error: code = InvalidArgument desc = invalid address: decoding bech32 failed: invalid checksum (expected xq32ez got tg7pm3): invalid request",
        "details": []
      },
      status: 400,
      statusText: '',
      // headers: "AxiosResponseHeaders",
    };
    const error = new AxiosError();
    error.name = 'AxiosError';
    error.message = 'Request failed with status code 400';
    error.response = response as AxiosResponse

    mockedAxios.request.mockRejectedValue(error);
    const result = await api.fetchBalance('c4e13zg4u07ymq83uq73t2cq3dj54jj37zzgqfwjpg', 'uc4e')
    expect(result.isError()).toBe(true);
    expect(result.isSuccess()).toBe(false);
    expect(result.error?.name).toBe('AxiosError');
    expect(result.error?.message).toBe('Request failed with status code 400');
    expect(result.error?.data?.code).toBe(3);
    expect(result.error?.data?.message).toBe('rpc error: code = InvalidArgument desc = invalid address: decoding bech32 failed: invalid checksum (expected xq32ez got tg7pm3): invalid request');
  
  });

});