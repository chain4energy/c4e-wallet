import { BlockResponse } from "@/models/blockchain/block";
import { Block } from "@/models/store/block";

export function mapBlock(blockResponse: BlockResponse | undefined): Block  {
  if (blockResponse === undefined) {
      throw new Error('mapBlock - block response is undefined');
  }
  if (blockResponse.block?.header?.height === undefined || blockResponse.block?.header?.time === undefined) {
    throw new Error('mapBlock - no height or time defined');
  }
  return new Block(blockResponse.block.header.height, blockResponse.block.header.time);
}

