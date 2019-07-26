const webpack = require('webpack')
const path = require('path')
const merge = require('webpack-merge')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']

/* ssr */
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const nodeExternals = require('webpack-node-externals')
const TARGET_NODE = process.env.WEBPACK_TARGET === 'node'
const target = TARGET_NODE ? 'server' : 'client'
const isDev = process.env.NODE_ENV !== 'production'

var baseConfig = {
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
  chainWebpack: config => {
    config.module
      .rule("vue")
      .use("vue-loader")
      .tap(options => {
        merge(options, {
          optimizeSSR: false
        })
      })
      
    // config.module
    //   .rule('images')
    //     .use('url-loader')
    //       .loader('url-loader')
    //       .tap(options => Object.assign(options, { limit: 10240 }))
    
    // config.plugin('prefetch').tap(options => {
    //   options[0].fileBlacklist = options[0].fileBlacklist || []
    //   options[0].fileBlacklist.push(/template-(.)+?\.(js|css)$/)
    //   return options
    // })

    if (TARGET_NODE) {
      config.plugins.delete("hmr")
    }
  },
  configureWebpack: config => ({
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
  })
}
  

var devConfig = {
  publicPath: '/',
	filenameHashing: false,
  devServer: {
    host: '0.0.0.0',
    port: 8088,
  },
}

var prodConfig = {
  // baseUrl: '',
  publicPath: '',
  productionSourceMap: false,
  // outputDir: 'hupan',

  // chainWebpack: config => {
  //   config.plugin('bundle-analyzer')
  //     .use(BundleAnalyzerPlugin, [{
  //       analyzerMode: 'static',
  //       reportFilename: 'report.html',
  //       openAnalyzer: false,
  //       logLevel: 'info'
  //     }])
  // },

  configureWebpack: config => {
    config.plugins.push(
      new CompressionWebpackPlugin({
        algorithm: 'gzip',
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        threshold: 10240,
        minRatio: 0.8
      }),
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/)
    )
  }
}

var config = process.env.NODE_ENV === 'production' ? merge(baseConfig, prodConfig) : merge(baseConfig, devConfig);

module.exports = config;