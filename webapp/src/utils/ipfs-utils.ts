export function extractCidFromIpfsUrl(ipfsUrl: string): string {
  return ipfsUrl.replace(/^ipfs:\/\//, '').split('/')[0];
}

export function isIpfsLink(url?: string): boolean {
  if(!url){
    return false;
  }
  const ipfsSchemeRegex = /^ipfs:\/\//i;
  return ipfsSchemeRegex.test(url);

}
