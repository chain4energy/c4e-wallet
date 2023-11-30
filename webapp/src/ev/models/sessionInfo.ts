import {BigDecimal} from "@/models/store/big.decimal";

export interface SessionInfo {
  state: SessionState;
  energyConsumed:number;
  cost:number;
  startTime: Date;
  entDate: Date;
}

export enum SessionState {
  CREATED = "Created",
  ACCEPTED = "Accepted",
  PAID = "Paid",
  REJECTED = "Rejected",
  STARTED = "Started",
  FINISHED = "Finished",

}
