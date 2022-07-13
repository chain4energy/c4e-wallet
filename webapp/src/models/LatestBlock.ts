export interface LatestBlock {
  blockId: BlockId,
  block: Block,
}

export interface Block {
  header: Header,
}
export interface Header {
  height: number
  time: string,
}
export class BlockId {
  hash = String;
}
