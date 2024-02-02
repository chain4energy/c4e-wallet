
export interface SessionInfo {
  state: SessionState;
  energyConsumed:number;
  cost:number;
  chargingStartTime: string;
  creationTime: string;
  reservationAmount: string;
  currency: string;
  energyWh: string
}

export enum SessionState {
  CREATED = 'CREATED',
  INIT = 'INIT',
  WAIT_FOR_RESERVATION_CONFIRMATION='WAIT_FOR_RESERVATION_CONFIRMATION',
  WAIT_FOR_CHARGING_START_ACCEPTED='WAIT_FOR_CHARGING_START_ACCEPTED',
  WAIT_FOR_PLUG_INSERT = 'WAIT_FOR_PLUG_INSERT',
  READY_TO_START = 'READY_TO_START',
  WAIT_FOR_STARTED = 'WAIT_FOR_STARTED',
  CHARGING = 'CHARGING',
  STOPPING = 'STOPPING',
  STARTING = 'STARTING',
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
