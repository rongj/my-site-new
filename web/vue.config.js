const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = ['js', 'css'];

var baseConfig = {
  chainWebpack: config => {
    config.module
      .rule('images')
        .use('url-loader')
          .loader('url-loader')
          .tap(options => Object.assign(options, { limit: 10240 }));
    
    config.plugin('prefetch').tap(options => {
      options[0].fileBlacklist = options[0].fileBlacklist || [];
      options[0].fileBlacklist.push(/template-(.)+?\.(js|css)$/);
      return options;
    });    
  },
  
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true,
      }
    }
  },
};
  

var devConfig = {
  // baseUrl: '/',
  publicPath: '/',
	filenameHashing: false,
  devServer: {
    host: '0.0.0.0',
    port: 8088,
    // proxy: {
    //   '/strategy/*': {
    //     target: 'http://172.19.14.71:8080',
    //     secure: false
    //   }
    // }
  },
};

var prodConfig = {
  // baseUrl: '',
  publicPath: '',
  productionSourceMap: false,
  // outputDir: 'hupan',

  chainWebpack: config => {
    config.plugin('bundle-analyzer')
      .use(BundleAnalyzerPlugin, [{
        analyzerMode: 'static',
        reportFilename: 'report.html',
        openAnalyzer: false,
        logLevel: 'info'
      }]);
  },

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
};

var config = process.env.NODE_ENV === 'production' ? merge(baseConfig, prodConfig) : merge(baseConfig, devConfig);

module.exports = config;