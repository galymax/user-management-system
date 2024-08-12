const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: config => {
    config.plugin('define').tap(args => {
      args[0].__VUE_PROD_DEVTOOLS__ = JSON.stringify(false)
      return args
    })
  }
})
