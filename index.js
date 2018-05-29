const WebSocket = require('ws')

const manualPromise = () => {
  let result
  const promise = new Promise((resolve, reject) => (result = {resolve, reject}))
  return {...result, promise}
}

function createWebsocketMiddleware (propertyName = 'ws') {
  const wss = new WebSocket.Server({noServer: true})

  const websocketMiddleware = async (ctx, next) => {
    const upgradeHeader = (ctx.request.headers.upgrade || '').split(',').map(s => s.trim())

    if (~upgradeHeader.indexOf('websocket')) {
      ctx[propertyName] = async () => {
        const {promise, resolve} = manualPromise()
        wss.handleUpgrade(ctx.req, ctx.request.socket, Buffer.alloc(0), resolve)
        ctx.respond = false

        return promise
      }
    }

    await next()
  }

  websocketMiddleware.server = wss
  return websocketMiddleware
}

module.exports = createWebsocketMiddleware
