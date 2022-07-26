import { BlockResponse } from "@/models/blockchain/block";
import { mapBlock } from "@/models/mapper/block.mapper";
import { createBlockResponseData, expectBlock } from "../utils/block.blockchain.data.util";


describe('map block', () => {

  it('maps block', async () => {
    const height = 123412;
    const time = new Date("2022-07-21T13:47:25.833663575Z");
    const bcBlock: BlockResponse = createBlockResponseData(height.toString(), time.toISOString());

    const block = mapBlock(bcBlock);
    expectBlock(block, height, time);

  });

  it('maps pool unexpected data', async () => {
    const bcPool: BlockResponse = {
          address: 'address',
    } as unknown as BlockResponse;

    expect(() => {mapBlock(bcPool)}).toThrowError(new Error('mapBlock - no height or time defined'));
  });

  it('maps undefined block response', async () => {
    expect(() => {mapBlock(undefined)}).toThrowError(new Error('mapBlock - block response is undefined'));

  });

  

});