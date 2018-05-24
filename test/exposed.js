/* eslint-env mocha */

const {expect} = require('chai')
// const Koa = require('koa')
const WebSocket = require('ws')

const websocket = require('..')

// const app = new Koa()
const websocketMiddleware = websocket()
const websocketServer = websocketMiddleware.server // this is where the fun begins

describe('exposed server', () => {
  it('should be a ws server', () => {
    expect(websocketServer).to.be.instanceOf(WebSocket.Server)
  })
})
