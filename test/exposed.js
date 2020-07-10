/* eslint-env mocha */

const debug = require('debug')('koa-easy-ws:test')
const { expect } = require('chai')
// const Koa = require('koa')
const WebSocket = require('ws')

const websocket = require('..')

// const app = new Koa()
const websocketMiddleware = websocket('ws', {
  noServerWorkaround: true, // required for testing on node 9 or earlier
  wsOptions: {
    clientTracking: false,
    maxPayload: 69420
  }
})
const websocketServer = websocketMiddleware.server // this is where the fun begins

describe('exposed server', () => {
  it('should be a ws server', () => {
    debug("running test 'exposed'")
    expect(websocketServer).to.be.instanceOf(WebSocket.Server)
  })

  it('should be configurable', () => {
    debug('running test for wsOptions')
    expect(websocketServer.options.maxPayload).to.equal(69420)
    expect(websocketServer.options.clientTracking).to.be.false // eslint-disable-line no-unused-expressions
    expect(websocketServer.clients).to.not.exist // eslint-disable-line no-unused-expressions
  })
})
