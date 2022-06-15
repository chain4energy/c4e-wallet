// {\"data\":{\"activeTotal\":{\"aggregate\":{\"count\":8}}}}
export interface Aggregate{
  count:number
}

export interface ActiveTotal{
  aggregate:Aggregate;
}

export interface ActiveValidatorCountData {
  activeTotal:ActiveTotal
}

export interface ActiveValidatorCount {
  data:ActiveValidatorCountData
}
