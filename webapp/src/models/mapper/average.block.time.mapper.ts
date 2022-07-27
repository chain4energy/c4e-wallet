import { AverageBlockTimeResponse } from "../hasura/average.block.time";

export function mapAverageBlockTime(averageBlockTimeResponse: AverageBlockTimeResponse | undefined): number  {
  if (averageBlockTimeResponse === undefined) {
      throw new Error('mapAverageBlockTime - average block time response is undefined');
  }
  if (averageBlockTimeResponse.data?.averageBlockTime === undefined 
      || averageBlockTimeResponse.data?.averageBlockTime.length !== 1
      || averageBlockTimeResponse.data?.averageBlockTime[0].averageTime === undefined) {
    throw new Error('mapAverageBlockTime - no average block time defined or to many elements');
  }
  return Number(averageBlockTimeResponse.data.averageBlockTime[0].averageTime);
}

