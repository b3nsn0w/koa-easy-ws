import WebSocket, { ServerOptions } from "ws";
import http from "http";
import { Middleware } from "koa";

export type WebSocketContext<PropertyName extends string = "ws"> = { [ws in PropertyName]?: () =>  Promise<WebSocket> };

declare function websocket<PropertyName extends string = "ws">(
  propertyName?: PropertyName,
  options?: { server?: http.Server; wsOptions?: ServerOptions }
): Middleware<{}, WebSocketContext<PropertyName>>;

export default websocket;
