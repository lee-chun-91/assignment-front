const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  // publicPath: '/surveySystem',
  outputDir: 'docs',
  transpileDependencies: true,
  css: {
    loaderOptions: {
      scss: {
        additionalData: '@import "~@/assets/scss/variables.scss";',
      },
    },
  },
});
