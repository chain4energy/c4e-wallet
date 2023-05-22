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
