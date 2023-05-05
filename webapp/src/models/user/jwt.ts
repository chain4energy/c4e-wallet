export interface Jwt {
  "access_token": Token,
  "refresh_token": Token
}

export interface Token {
  "id" : string,
  "token": string
}
