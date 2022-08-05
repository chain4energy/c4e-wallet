export interface PictureUrlResponse extends KeybaseResponse{
  list: [
    {
      keybase: {
        picture_url: string,
      },
    }
  ]
}

export interface KeybaseResponse {
  status: {
    code: number,
    name: string
  },
}

export interface KeybaseErrorData extends KeybaseResponse {
  status: {
    code: number,
    name: string,
    desc: string
  },
}