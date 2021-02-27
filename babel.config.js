// 项目在发布时需要用到的babel插件数组
const proPlugins = [];
// 如果当前是生产环境，则使用去掉console的插件
if (process.env.NODE_ENV === 'production') {
  proPlugins.push('transform-remove-console');
}

module.exports = {
  presets: [
    '@vue/app',
    [
      '@babel/preset-env',
      {
        'useBuiltIns': 'entry'
      }
    ]
  ],
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ],
    ...proPlugins,
  ],
}