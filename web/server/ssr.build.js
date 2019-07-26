const fs = require("fs");
const path = require("path");
const Router = require('koa-router')
const send = require('koa-send')
const router = new Router()

const resolve = file => path.resolve(__dirname, file)

const { createBundleRenderer } = require("vue-server-renderer")
const bundle = require("../dist/vue-ssr-server-bundle.json")
const clientManifest = require("../dist/vue-ssr-client-manifest.json")

const renderer = createBundleRenderer(bundle, {
  runInNewContext: false,
  template: fs.readFileSync(resolve("./index.template.html"), "utf-8"),
  clientManifest: clientManifest
});

function renderToString(context) {
  return new Promise((resolve, reject) => {
    renderer.renderToString(context, (err, html) => {
      err ? reject(err) : resolve(html);
    })
  })
}

const handleRequest = async (ctx, next) => {
  const url = ctx.path
  if (url.includes('.')) {
    return await send(ctx, url, {root: path.resolve(__dirname,'../dist')})
  }

  ctx.res.setHeader("Content-Type", "text/html")
  const context = {
    title: "vue ssr",
    url
  }
  const html = await renderToString(context)
  ctx.body = html
}

router.get('*', handleRequest)

module.exports = router
