const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: config => {
    config.plugin('define').tap(definitions => {
      Object.assign(definitions[0]['process.env'], {
        NODE_HOST: '"http://127.0.0.1:8000"',
      });
      return definitions;
    });
  }
})
