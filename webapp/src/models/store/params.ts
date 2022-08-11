export class Params {
  unbondingTime: number;
  maxValidators: number;
  maxEntries: number;
  historicalEntries: number;
  bondDenom: string;
  dateWhenComplete: Date
  constructor(
    unbonding_time: string,
    max_validators: number,
    max_entries: number,
    historical_entries: number,
    bond_denom: string,
    ) {
      this.unbondingTime = Number(unbonding_time.slice(0, -1))/86400
      this.maxEntries = max_entries;
      this.maxValidators = max_validators;
      this.historicalEntries = historical_entries;
      this.bondDenom = bond_denom;
      this.dateWhenComplete = new Date(Date.now() + Number(unbonding_time.slice(0, -1))* 1000);

    }
}
