/* eslint-env mocha */

// sorry for the mess, there has to be a cleaner way

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
    ws.send('anakin is evil')
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
      server.listen()
      server.once('listening', () => {
        const serverAddress = server.address()
        address = `localhost:${serverAddress.port}`
        resolve()
      })
    })
  })

  after(() => {
    server.close()
  })

  it('should trigger obi', async function () {
    await new Promise((resolve, reject) => {
      const ws = new WebSocket(`ws://${address}/pow/obi`)

      ws.once('message', (data) => {
        expect(data).to.equal('anakin is evil')
        ws.close()
        resolve()
      })
    })
  })

  it('should trigger ani', async function () {
    await new Promise((resolve, reject) => {
      const ws = new WebSocket(`ws://${address}/pow/ani`)

      ws.once('message', (data) => {
        expect(data).to.equal('the jedi are evil')
        ws.close()
        resolve()
      })
    })
  })
})
