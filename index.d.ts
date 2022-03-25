import WebSocket, { ServerOptions } from "ws";
import http from "http";
import { Middleware } from "koa";

export type WebSocketContext<PropertyName extends string = "ws", ServerPropertyName extends string> = {
  [PropertyName]?: () => Promise<WebSocket>;
  [ServerPropertyName]?: WebSocket.Server;
};

export type WebSocketMiddleware = {
  server: WebSocket.Server;
};

declare function websocket<PropertyName extends string = "ws", ServerPropertyName extends string>(
  propertyName?: PropertyName,
  options?: { server?: http.Server; wsOptions?: ServerOptions, exposeServerOn?: ServerPropertyName }
): Middleware<{}, WebSocketContext<PropertyName, ServerPropertyName>> & WebSocketMiddleware;

export default websocket;
