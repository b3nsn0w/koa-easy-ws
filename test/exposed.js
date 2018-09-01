/* eslint-env mocha */

const debug = require('debug')('koa-easy-ws:test')
const {expect} = require('chai')
// const Koa = require('koa')
const WebSocket = require('ws')

const websocket = require('..')

// const app = new Koa()
const websocketMiddleware = websocket('ws', {noServerWorkaround: true}) // required for testing on node 9 or earlier
const websocketServer = websocketMiddleware.server // this is where the fun begins

describe('exposed server', () => {
  it('should be a ws server', () => {
    debug("running test 'exposed'")
    expect(websocketServer).to.be.instanceOf(WebSocket.Server)
  })
})
