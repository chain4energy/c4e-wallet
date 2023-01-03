export interface DistributorParams {
  sub_distributors: SubDistributors[]
}

export interface DistributorParamsResponse {
  params: DistributorParams
}

export interface SubDistributors {
  name: string,
  sources: Sources[]
  destinations: Destinations
}
export interface Sources {
  id: string,
  type: string
}
export interface Destinations {
  primary_share: PrimaryShare,
  shares: Share[],
  burn_share: number

}
export interface Share {
  name: string,
  share: number,
  destination: Destination;
}

export interface PrimaryShare {
  id: string,
  type: string
}
export interface Destination {
  id: string,
  type: string
}
