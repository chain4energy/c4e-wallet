const { defineConfig } = require('@vue/cli-service');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const path = require('path');

module.exports = defineConfig({
  pages:{
    index:{
      entry: 'src/main.ts',
      title: 'Chain4Energy | C4E wallet'
    },
  },
  transpileDependencies: true,
  devServer: {
    allowedHosts: "all",
    static :{
      directory: path.join('./dev/', '/')
    },
    host: 'localhost',
    port: 9000,
    proxy: {
      '^/app': {
        target: 'http://localhost',
        changeOrigin: true,
      },
      '^/api-devnet': {
        target: 'http://198.244.154.101:31876',
        changeOrigin: true,
        pathRewrite: function (path, req) { return path.replace('/api-devnet', ''); }
      },
      '^/lcd': {
        target: 'http://127.0.0.1:31317',
        changeOrigin: true,
        pathRewrite: function (path, req) { return path.replace('/lcd', '') ;}
      },
      '^/rpc': {
        target: 'http://127.0.0.1:26657',
        changeOrigin: true,
        pathRewrite: function (path, req) { return path.replace('/rpc', ''); }
      },
    }
  },
  configureWebpack: {
    devtool: 'source-map',
    plugins: [new NodePolyfillPlugin()],
    resolve: {
      fallback: {
        buffer: false,
        crypto: false,
        events: false,
        path: false,
        stream: false,
        string_decoder: false,
      },
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
    },
  },
  pluginOptions: {
    i18n: {
      locale: 'pl',
      fallbackLocale: 'pl',
      localeDir: 'locales',
      enableInSFC: false,
      enableBridge: false
    }
  },
  css:{
    extract:false
  }
});
