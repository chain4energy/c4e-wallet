export interface BlockResponse {
  block_id: BlockId,
  block: Block,
}

export interface Block {
  header: Header,
}
export interface Header {
  height: string
  time: string,
}
export interface BlockId {
  hash: string;
}
