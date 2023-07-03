

export function createAuthWalletInitResponse() {

  return {
    dataToSign: {
      accountNumber: 123123,
      randomString: 'gs0mqsgRfGVATLH5W3OssR8bfANTj4AK',
      sequenceNumber: 4393862425760475
    },
    processID: 'bc027e18-0d44-4a5e-ac8d-1f7fea4f01bf'
  };
}

export function createAuthWalletResponse() {

  return {
    access_token: {
      id: '32b346fb-0744-4d44-8491-59a5c2832657',
      token: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODQyMzIxMDAxMTQsImlzcyI6ImM0ZSIsIm5iZiI6MTY4NDIzMDYwMDExNCwidXNlcklkZW50aXR5SWQiOjYsImxvZ2luVHlwZSI6ImtlcGxyIiwibG9naW4iOiJjNGUxNjd2NGtsaGxuN3Q5bDR2ZGhzMzJ5ZHZ1dTk1MHNlcTZscG01bXEiLCJ1dWlkIjoiMzJiMzQ2ZmItMDc0NC00ZDQ0LTg0OTEtNTlhNWMyODMyNjU3In0.DpTAUrX9PBb1rzm9bxR0d5n7ib3_9OyP7-D2BMaxZleYih5zUIhxNrKDhjk5lnKkbpvI8RG-2C79Vs0rkYydCQ'
    },
    refresh_token: {
      id: 'f08c6518-2fca-47fc-b50c-010c63b3abd7',
      token: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODQyMzI0MDAxMTQsImlzcyI6ImM0ZSIsIm5iZiI6MTY4NDIzMDYwMDExNCwidXNlcklkZW50aXR5SWQiOjYsImxvZ2luVHlwZSI6ImtlcGxyIiwibG9naW4iOiJjNGUxNjd2NGtsaGxuN3Q5bDR2ZGhzMzJ5ZHZ1dTk1MHNlcTZscG01bXEiLCJ1dWlkIjoiZjA4YzY1MTgtMmZjYS00N2ZjLWI1MGMtMDEwYzYzYjNhYmQ3In0.tf3vB-PUOyOkkn2m47dFZsBQdIuaur1b6-C4CYI86ClKd2bAgc3CCxbBZMnf9gEeIyk1jupNIyrrsMZ1_v3QCg'
    }
  };
}

export function createRegisterEmailResponse() {
  return {
    login: 'test@test.pl',
    loginId: 1,
    userId: 1,
    userIdentityId: 1
  };
}
