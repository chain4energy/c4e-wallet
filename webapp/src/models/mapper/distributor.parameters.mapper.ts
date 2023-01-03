import {DistributorParams} from "@/models/blockchain/distributorParams";

export function mapDistributorParameters(parameters: DistributorParams | undefined): number {
  if (parameters === undefined) {
    throw new Error('Parameters are undefined');
  }

  let sum = 0;
  let burnShare = 0;

  parameters.sub_distributors.forEach(param => {
    if(param.name == 'inflation_and_fee_distributor') {
      burnShare = param.destinations.burn_share;
      param.destinations.shares.forEach(share => sum += Number(share.share));
    }
  });

  return 1 - sum - burnShare;
}
