import WebSocket, { ServerOptions } from "ws";
import http from "http";

export type WebSocketContext = { ws?: () => Promise<WebSocket> };
declare const webSocket: (
  propertyName?: "ws",
  options?: { server?: http.Server; wsOptions?: ServerOptions }
) => any;

export default webSocket;
