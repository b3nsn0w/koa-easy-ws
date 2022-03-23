/* eslint-env mocha */

// sorry for the mess, there has to be a cleaner way

const debug = require('debug')('koa-easy-ws:test')
const { expect } = require('chai')
const http = require('http')
const Koa = require('koa')
const request = require('request-promise')
const WebSocket = require('ws')

const websocket = require('..')

const app = new Koa()

const server = http.createServer(app.callback())
let address // forgive my mutant heresy

app.use(websocket('ws', server))
app.use(async (ctx, next) => {
  // check if the current request is websocket
  if (ctx.ws) {
    const ws = await ctx.ws() // retrieve socket

    // now you have a ws instance, you can use it as you see fit
    return ws.send('hello there')
  }

  // we're back to regular old http here
  ctx.body = 'general kenobi'
})

describe('simple example', function () {
  before(async () => {
    return new Promise((resolve, reject) => {
      debug("server started for test 'simple'")
      server.listen()
      server.once('listening', () => {
        const serverAddress = server.address()
        address = `localhost:${serverAddress.port}`
        debug("server listening for test 'simple'")
        resolve()
      })
    })
  })

  after(() => {
    debug("server closed for test 'simple'")
    server.close()
  })

  it('should reply to websocket', async function () {
    await new Promise((resolve, reject) => {
      debug("running test 'simple/websocket'")
      const ws = new WebSocket(`ws://${address}`)

      ws.on('message', (data) => {
        expect(data.toString('utf8')).to.equal('hello there')
        ws.close()
        resolve()
      })
    })
  })

  it('should still handle http', async function () {
    debug("running test 'simple/http'")
    const reply = await request(`http://${address}`)
    expect(reply).to.equal('general kenobi')
  })
})
