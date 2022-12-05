export interface ValidatorDescriptionResponse {
  data: {
    validator: {
      validator_infos: {operator_address : string}[],
      validator_descriptions: {avatar_url: string}[]
    }[]
  }
}
