const { defineConfig } = require('@vue/cli-service')
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    host: 'localhost',
    port: 9000,
    proxy: {
      '/api/': {
        target: 'http://10.0.14.76'
      },
      '/app': {
        target: 'http://localhost:3090'
      }
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
  }
})
