Simple, easy to use, composable middleware for websocket handling in Koa

# Usage

```javascript
const Koa = require('koa')
const websocket = require('koa-easy-ws')

const app = new Koa()

app.use(websocket())
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
```

**Note: you will also need to install the `ws` package** (`npm install --save ws` or `yarn add ws`), **it is linked only as a peer dependency.**

First, you need to pass the koa-easy-ws middleware before the one handling your request. Remember to call it as a function, `app.use(websocket())`, not `app.use(websocket)`. This sets up on-demand websocket handling for the rest of the middleware chain.

The middleware adds the `ctx.ws()` function whenever it detects an upgrade request, calling which handles the websocket and returns a [ws][ws] instance. If not called, regular Koa flow continues, likely resulting in a client-side error.

# Features

 - No magic. This is a middleware, it doesn't turn your Koa app into a KoaMagicWebSocketServer. It knows its place.
 - Integrates [ws][ws], one of the fastest and most popular websocket libraries.
 - Full composability. Since this is just a middleware, it's not picky on what other libraries you use.
 - Minimal, unopinionated 44 SLOC codebase. Seriously, this readme alone contains more code than what's imported into your project. (sorry about the tests though)
 - Two dependencies only, and it's the ws library and [debug][debug] (because apparently logs are not a bad idea). No need for more clutter in your node_modules.

# Examples and advanced configuration

You can easily compose koa-easy-ws with a routing library:

```javascript
const Koa = require('koa')
const Router = require('koa-router')
const websocket = require('koa-easy-ws')

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
```

If `ctx.ws()` isn't enough for you, the websocket server instance is also exposed:

```javascript
const Koa = require('koa')
const websocket = require('koa-easy-ws')

const app = new Koa()
const websocketMiddleware = websocket()
const websocketServer = websocketMiddleware.server // this is where the fun begins

app.use(websocketMiddleware) // we already have the instance here

// <insert rest of the app>
```

This gives you access to the [ws][ws] server object, allowing to pass down custom listeners, connection validators, etc.

Alternatively, you can pass options to the underlying [ws][ws] server as part of the options object:

```javascript
app.use(websocket('ws', {
  wsOptions: {
    clientTracking: false,
    maxPayload: 69420
  }
}))
```

The `wsOptions` object will be forwarded to [ws][ws] unchanged, you can check [its documentation][ws] for the available options.

In case `ctx.ws` conflicts with something else in your code, koa-easy-ws doesn't mind changing the property name, just pass it as a property. This also lets you use multiple websocket middlewares if you ever find a reason to do so:

```javascript
const Koa = require('koa')
const websocket = require('koa-easy-ws')

const app = new Koa()

app.use(websocket('sidious')) // we just renamed ctx.ws to ctx.sidious
app.use(websocket('maul')) // attach another one for no good reason

app.use(async (ctx, next) => {
  // the first middleware detected an upgrade request
  if (ctx.sidious) {
    const socket = await ctx.sidious()
    return socket.send('this is getting out of hand')
  }

  // the second middleware detected the same upgrade request
  if (ctx.maul) {
    const socket = await ctx.maul()
    return socket.send('now there are two of them')
  }
})
```

Note: in this example `ctx.maul` is never used because there is no limit on the authority of `ctx.sidious`. However, if you define custom logic this technique could sort incoming requests to separate websocket servers.

If needed, you can also expose the websocket server on a context property, which can itself be renamed:

```javascript
const Koa = require('koa')
const websocket = require('koa-easy-ws')

const app = new Koa()

app.use(websocket('ws', { exposeServerOn: 'wss' }))

app.use(async (ctx, next) => {
  if (ctx.ws) {
    console.log('found the server', ctx.wss)
  }
})
```

In the above example, `ctx.ws` behaves as normal, but you also have the server instance available on `ctx.wss`. This saves you the trouble of having to access `websocket().server` as seen in a prior example.

From here, the sky is the limit, unless you work for SpaceX.

# Version 2 changelog

In version 2, `ws` has been moved to a peer dependency, which is a breaking change with the way dependency resolution works. It will _technically_ work if you just upgrade to v2 with no changes, especially because of the `package-lock.json` or `yarn.lock` keeping `ws` there, but it would most likely inject a weird bug. **To avoid unpredictable issues in the future, add `ws` to your own package's dependencies.**

On top of that, the peer dependency is for ws@8, not ws@7 which koa-easy-ws previously used, so refer to ws@8's breaking changes for that (but if you're fine with a warning ws@7 should continue to work).

# Special usage for Node 9 or earlier

Node's HTTP server doesn't send upgrade requests through the normal callback (and thus your Koa middleware chain) prior to version 10, preventing koa-easy-ws from handling them. Because of this, if you target Node 9 or earlier, you must pass your HTTP server to the middleware which handles the workaround:

```javascript
const server = http.createServer(app.callback())

app.use(websocket('ws', server))

// alternatively, you can pass it as part of the options object:
app.use(websocket('ws2', {
  server: server
}))

server.listen(process.env.PORT) // use this function instead of your app.listen() call
```

koa-easy-ws then automatically feeds any upgrade request into your regular middleware chain. If you wish to opt out and do this yourself, use the `noServerWorkaround` option:

```javascript
app.use(websocket('ws', {
  noServerWorkaround: true
}))
```

# Contributing

Pull requests are welcome. As always, be respectful towards each other and maybe run or create tests, as appropriate. It's on `npm test`, as usual.

koa-easy-ws uses the MIT license. Was considering the WTFPL, but I like the "no warranty" clause.

[ws]: https://github.com/websockets/ws
[debug]: https://github.com/visionmedia/debug
