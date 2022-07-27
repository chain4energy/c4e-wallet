import { AverageBlockTimeResponse } from "@/models/hasura/average.block.time";
import { mapAverageBlockTime } from "@/models/mapper/average.block.time.mapper";
import { createAveragetBlockTimeResponseData } from "../utils/average.block.time.hasura.data.util";


describe('map block', () => {

  it('maps average block time', async () => {
    const avgTime = 4.34332423243;
    const avgResp: AverageBlockTimeResponse = createAveragetBlockTimeResponseData(avgTime);

    const time = mapAverageBlockTime(avgResp);
    expect(time).toBe(avgTime);

  });

  it('maps average block time unexpected data', async () => {
    const avgResp: AverageBlockTimeResponse = {
          address: 'address',
    } as unknown as AverageBlockTimeResponse;

    expect(() => {mapAverageBlockTime(avgResp)}).toThrowError(new Error('mapAverageBlockTime - no average block time defined or to many elements'));
  });

  it('maps undefined average block time response', async () => {
    expect(() => {mapAverageBlockTime(undefined)}).toThrowError(new Error('mapAverageBlockTime - average block time response is undefined'));

  });

  

});