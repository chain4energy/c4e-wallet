export enum ImageType {
  HEADER_LOGO
}

export function getImageUrl (imageType : ImageType) : string {
  switch (imageType) {
    case ImageType.HEADER_LOGO:
      return require('@/assets/c4e-simple-logo.jpg');
  }
}
