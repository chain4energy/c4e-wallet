import { ConnectionInfo, ConnectionType } from "@/api/wallet.connecton.api";

export function expectAddressConnectionInfo(connectionInfo: ConnectionInfo | undefined, expectedAddress: string) {
  expect(connectionInfo?.account).toBe(expectedAddress);
  expect(connectionInfo?.modifiable).toBe(false);
  expect(connectionInfo?.connectionType).toBe(ConnectionType.Address);
}

export function expectKeplrConnectionInfo(connectionInfo: ConnectionInfo | undefined, expectedAddress: string) {
  expect(connectionInfo?.account).toBe(expectedAddress);
  expect(connectionInfo?.modifiable).toBe(true);
  expect(connectionInfo?.connectionType).toBe(ConnectionType.Keplr);
}

export function expectDisconnectedConnectionInfo(connectionInfo: ConnectionInfo | undefined) {
  expect(connectionInfo?.account).toBe('');
  expect(connectionInfo?.modifiable).toBe(false);
  expect(connectionInfo?.connectionType).toBe(ConnectionType.Disconnected);
}