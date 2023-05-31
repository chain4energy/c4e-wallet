export interface PasswordAuthenticateRequest {
  login: string,
  password: string
}

export interface CreateAccountRequest {
  contactEmail?: string,
  firstName?: string,
  lastName?: string,
  login: string,
  password: string,
  phone?: string
}

export interface AccountRequest{
  "accountType": "string",
  "kycLevel": "string",
  "login": "string",
  "terms": true
}
