export interface SessionInfo {
  state: SessionState;
}

export enum SessionState {
  CREATED = "Created",
  ACCEPTED = "Accepted",
  PAID = "Paid",
  REJECTED = "Rejected",
  STARTED = "Started",
  FINISHED = "Finished",

}
