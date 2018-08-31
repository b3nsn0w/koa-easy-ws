/* eslint-env mocha */

// sorry for the mess, there has to be a cleaner way

const debug = require('debug')('koa-easy-ws:test')
const {expect} = require('chai')
const http = require('http')
const Koa = require('koa')
const Router = require('koa-router')
const WebSocket = require('ws')

const websocket = require('..')

const app = new Koa()
const router = new Router()

app
  .use(websocket())
  .use(router.routes())
  .use(router.allowedMethods())

router.get('/pow/obi', async (ctx, next) => {
  if (ctx.ws) {
    const ws = await ctx.ws()
    ws.send('chancellor palpatine is evil')
  }
})

router.get('/pow/ani', async (ctx, next) => {
  if (ctx.ws) {
    const ws = await ctx.ws()
    ws.send('the jedi are evil')
    ws.send('404')
  }
})

const server = http.createServer(app.callback())
let address // forgive my mutant heresy

describe('composing with router', function () {
  before(async () => {
    return new Promise((resolve, reject) => {
      debug("server started for test 'router'")
      server.listen()
      server.once('listening', () => {
        const serverAddress = server.address()
        address = `localhost:${serverAddress.port}`
        debug("server listening for test 'router'")
        resolve()
      })
    })
  })

  after(() => {
    debug("server closed for test 'router'")
    server.close()
  })

  it("should connect to handler at '/pow/obi'", async function () {
    await new Promise((resolve, reject) => {
      debug("running test 'router/obi'")
      const ws = new WebSocket(`ws://${address}/pow/obi`)

      ws.once('message', (data) => {
        expect(data).to.equal('chancellor palpatine is evil')
        ws.close()
        resolve()
      })
    })
  })

  it("should connect to handler at '/pow/ani'", async function () {
    await new Promise((resolve, reject) => {
      debug("running test 'router/ani'")
      const ws = new WebSocket(`ws://${address}/pow/ani`)

      ws.once('message', (data) => {
        expect(data).to.equal('the jedi are evil')
        ws.close()
        resolve()
      })
    })
  })
})
