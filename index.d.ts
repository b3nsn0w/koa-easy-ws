import WebSocket, { ServerOptions } from "ws";
import http from "http";
import { Middleware } from "koa";

export type WebSocketContext = { ws?: () => Promise<WebSocket> };
declare function webSocket(
  propertyName?: "ws",
  options?: { server?: http.Server; wsOptions?: ServerOptions }
): Middleware<{}, WebSocketContext>;

export default webSocket;
