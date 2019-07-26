const Koa = require("koa")
const path = require("path")
const koaStatic = require('koa-static')
const koaMount = require("koa-mount")

const app = new Koa()
const resolve = file => path.resolve(__dirname, file)

const isDev = process.env.NODE_ENV !== 'production'
const router = isDev ? require('./ssr.dev') : require('./ssr.build')

app.use(router.routes()).use(router.allowedMethods())
app.use(koaMount('/dist', koaStatic(resolve("../dist"))))
app.use(koaMount('/public', koaStatic(resolve("../public"))))

const port = process.env.PORT || 3000
app.listen(port, function() {
  console.log(`server started at localhost:${port}`)
})