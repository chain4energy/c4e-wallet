const { defineConfig } = require('@vue/cli-service')
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
    devtool: 'source-map'
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
