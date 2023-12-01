import {BigDecimal} from "@/models/store/big.decimal";

export interface SessionInfo {
  state: SessionState;
  energyConsumed:number;
  cost:number;
  startTime: Date;
  entDate: Date;
}

export enum SessionState {
  CREATED = 'CREATED',
  INIT = 'INIT',
  WAIT_FOR_PLUG_INSERT = 'WAIT_FOR_PLUG_INSERT',
  READY_TO_START = 'READY_TO_START',
  WAIT_FOR_STARTED = 'WAIT_FOR_STARTED',
  CHARGING = 'CHARGING',
  FINALIZE_ACCOUNTING = 'FINALIZE_ACCOUNTING',
  FINAL = 'FINAL'
  // ,
  // CREATED = "CREATED",
  // WAIT_FOR_PLUG_INSERT = "WAIT_FOR_PLUG_INSERT",
  // ACCEPTED = "ACCEPTED",
  // PAID = "PAID",
  // REJECTED = "REJECTED",
  // STARTED = "STARTED",
  // FINISHED = "FINISHED",

}
