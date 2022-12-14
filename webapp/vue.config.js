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
    static :{
      directory: path.join('./dev/', '/')
    },
    host: '',
    port: 9000,
    proxy: {
      '/api/': {
        target: 'http://10.0.14.76',
        changeOrigin: true,
      },
      '/app': {
        target: 'http://localhost',
        changeOrigin: true,
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
});
