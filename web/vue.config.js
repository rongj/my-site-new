const VueSSRServerPlugin = require("vue-server-renderer/server-plugin")
const VueSSRClientPlugin = require("vue-server-renderer/client-plugin")
const nodeExternals = require("webpack-node-externals")
const merge = require('webpack-merge')
const TARGET_NODE = process.env.WEBPACK_TARGET === "node"
const target = TARGET_NODE ? "server" : "client"
const isDev = process.env.NODE_ENV !== 'production'

module.exports = {
  publicPath: isDev ? 'http://localhost:8080' : 'http://localhost:3000',
  filenameHashing: !isDev,
  productionSourceMap: isDev,
  devServer: {
    historyApiFallback: true,
    headers: { 'Access-Control-Allow-Origin': '*' }
  },
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true,
      }
    },
    extract: isDev
  },
  configureWebpack: () => ({
    entry: `./src/entry-${target}.js`,
    devtool: false,
    target: TARGET_NODE ? "node" : "web",
    node: TARGET_NODE ? undefined : false,
    output: {
      libraryTarget: TARGET_NODE ? "commonjs2" : undefined
    },
    externals: TARGET_NODE ? nodeExternals({ whitelist: [/\.css$/] }) : undefined,
    optimization: {
      splitChunks: TARGET_NODE ? false : undefined
    },
    plugins: [TARGET_NODE ? new VueSSRServerPlugin() : new VueSSRClientPlugin()]
  }),
  chainWebpack: config => {
    config.module
      .rule("vue")
      .use("vue-loader")
      .tap(options => {
        merge(options, {
          optimizeSSR: false
        })
      })

    if (TARGET_NODE) {
      config.plugins.delete("hmr")
    }
  }
}