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
