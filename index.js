const debug = require('debug')('koa-easy-ws')
const http = require('http')
const process = require('process')
const WebSocket = require('ws')

const serversPatched = new WeakSet()

function createWebsocketMiddleware (propertyName = 'ws', options) {
  if (!options) options = {}
  if (options instanceof http.Server) options = { server: options }

  debug(`websocket middleware created with property name '${propertyName}'`)
  const wss = new WebSocket.Server({ noServer: true })

  const websocketMiddleware = async (ctx, next) => {
    debug(`websocket middleware called on route ${ctx.path}`)
    const upgradeHeader = (ctx.request.headers.upgrade || '').split(',').map(s => s.trim())

    if (~upgradeHeader.indexOf('websocket')) {
      debug(`websocket middleware in use on route ${ctx.path}`)
      ctx[propertyName] = () => new Promise((resolve) => {
        wss.handleUpgrade(ctx.req, ctx.request.socket, Buffer.alloc(0), resolve)
        ctx.respond = false
      })
    }

    await next()
  }

  websocketMiddleware.server = wss
  return websocketMiddleware
}

module.exports = createWebsocketMiddleware
