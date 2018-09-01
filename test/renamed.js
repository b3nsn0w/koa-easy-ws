/* eslint-env mocha */

// sorry for the mess, there has to be a cleaner way

const debug = require('debug')('koa-easy-ws:test')
const {expect} = require('chai')
const http = require('http')
const Koa = require('koa')
const WebSocket = require('ws')

const websocket = require('..')

const app = new Koa()

const server = http.createServer(app.callback())
let address // forgive my mutant heresy

app.use(websocket('sidious', server)) // we just renamed ctx.ws to ctx.sidious
app.use(websocket('maul', server)) // attach another one for no good reason

app.use(async (ctx, next) => {
  // the first middleware detected an upgrade request
  if (ctx.sidious && ctx.request.path === '/sidious') {
    const socket = await ctx.sidious()
    return socket.send('this is getting out of hand')
  }

  // the second middleware detected an same upgrade request
  if (ctx.maul && ctx.request.path === '/maul') {
    const socket = await ctx.maul()
    return socket.send('now there are two of them')
  }
})

describe('renamed property', function () {
  before(async () => {
    return new Promise((resolve, reject) => {
      debug("server started for test 'renamed'")
      server.listen()
      server.once('listening', () => {
        const serverAddress = server.address()
        address = `localhost:${serverAddress.port}`
        debug("server listening for test 'renamed'")
        resolve()
      })
    })
  })

  after(() => {
    debug("server closed for test 'renamed'")
    server.close()
  })

  it("should detect 'ctx.sidious' on route '/sidious'", async function () {
    await new Promise((resolve, reject) => {
      debug("running test 'renamed/sidious'")
      const ws = new WebSocket(`ws://${address}/sidious`)

      ws.once('message', (data) => {
        expect(data).to.equal('this is getting out of hand')
        ws.close()
        resolve()
      })
    })
  })

  it("should detect 'ctx.maul' on route '/maul'", async function () {
    await new Promise((resolve, reject) => {
      debug("running test 'renamed/maul'")
      const ws = new WebSocket(`ws://${address}/maul`)

      ws.once('message', (data) => {
        expect(data).to.equal('now there are two of them')
        ws.close()
        resolve()
      })
    })
  })
})
