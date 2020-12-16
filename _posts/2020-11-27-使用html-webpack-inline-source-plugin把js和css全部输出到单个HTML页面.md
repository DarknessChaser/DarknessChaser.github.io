---
layout:     post
title:      "使用html-webpack-inline-source-plugin把js和css全部输出到单个HTML页面"
subtitle:   ""
date:       2020-11-27
author:     "漆黑菌"
header-img: "img/post-bg.jpg"
catalog: true
tags:
    - webpack
    - html-webpack-inline-source-plugin
    - vue-cli
    - inline-js
    - inline-css
---

# 需求
公司项目有个新需求，需要前端提供HTML模板后端灌数据进行混合渲染。

# 遇到的问题
首先想到的就是最原始的前端写HTML基础，然后后端写逻辑+灌数据的模式。之前同项目的消息通知模板也是采用这种模式，但是这种模式在使用过程中暴露了很多问题。

1. 前后端责任不清晰，之前要进行国际化的时候，就需要前后端反复沟通费时费力效率低。
2. 前端工程化技术突飞猛进，再也不是当年简简单单引入bootstrap+jQuery就能打天下的局面了。一方面前端日渐专业化，另一方面后端同事也习惯了前后端分离的开发模式，前端更加搞不定了。导致之前后端用模板语法+简单js写逻辑的方式完全失效。

于是决定改用现在vue-cli的打包模式，后端只负责往生成的HTML文件里灌数据即可。这样各种现代工程化前端的工具就都可以用起来了。不过在这个需求里，前端需要分开构建6份HTML模板提供给后端。按照默认的vue-cli玩法，就需要写6个构建指令。而且各种静态资源的路径引用还有很大隐患。于是网上一番搜索决定使用多页面构建+html-webpack-inline-source-plugin插件的形式，一次构建生成6份包含全部静态资源的HTML。

# 成果
```
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

const pageTitles = {
  zap: 'DAST 扫描',
  dss: 'DSS 镜像安全扫描',
  password: '密码扫描',
  cobot: '代码安全扫描',
  license: '许可证扫描',
  dependency: '依赖扫描',
};

const pageNames = Object.keys(pageTitles);

const pageConfigs = {};
pageNames.forEach((name) => {
  pageConfigs[name] = {
    // page 的入口
    entry: `src/views/${name}/index.js`,
    // 模板来源
    template: 'public/index.html',
    // 在 dist/index.html 的输出
    filename: `${name}.html`,
    // 当使用 title 选项时，
    // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
    title: pageTitles[name],
    // html-webpack-inline-source-plugin inline资源的规则
    inlineSource: '.(js|css)$',
    // 在这个页面中包含的块，默认情况下会包含
    // 提取出来的通用 chunk 和 vendor chunk。
    chunks: [name],
  };
});

module.exports = {
  publicPath: './',
  pages: pageConfigs,
  css: {
    // 不生成单独的css文件
    extract: false,
  },
  chainWebpack: (config) => {
    // 不分片只生成一个js文件
    config.optimization.splitChunks(false);
    // 不处理svg
    config.module.rules.delete('svg');
    // 尽量把图片打包成base64形式
    config.module
      .rule('images')
      .test(/\.(png|jpe?g|gif|webp|svg)(\?.*)?$/)
      .use('url-loader')
      .loader('url-loader')
      .tap((options) => Object.assign(options, { limit: 100 * 1024 }));
    // 移除 preload 和 prefetch 修复资源会被inline两次的问题
    pageNames.forEach((name) => {
      config.plugins.delete(`preload-${name}`);
      config.plugins.delete(`prefetch-${name}`);
    });
    // 添加 inline 所需plugin
    config.plugin('inline-source')
      .use(new HtmlWebpackInlineSourcePlugin());
  },
};
```

# 参考文档
1. [vue-cli配置multi-page模式](https://cli.vuejs.org/zh/config/#pages "vue-cli配置multi-page模式")
2. [vue-cli修改webpack配置](https://cli.vuejs.org/zh/guide/webpack.html#%E7%AE%80%E5%8D%95%E7%9A%84%E9%85%8D%E7%BD%AE%E6%96%B9%E5%BC%8F "vue-cli修改webpack配置")
3. [html-webpack-inline-source-plugin官方文档](https://github.com/DustinJackson/html-webpack-inline-source-plugin "html-webpack-inline-source-plugin官方文档")
4. [使用vue-cli+html-webpack-inline-source-plugin单页模式下使用方法](https://stackoverflow.com/questions/58274001/vue-cli-combine-build-output-to-a-single-html-file "使用vue-cli+html-webpack-inline-source-plugin单页模式下使用方法")
5. [使用vue-cli+html-webpack-inline-source-plugin资源被多次引入问题](https://github.com/DustinJackson/html-webpack-inline-source-plugin/issues/50 "使用vue-cli+html-webpack-inline-source-plugin资源被多次引入问题")
6. [禁用vue-cli中的preload和prefetch](https://stackoverflow.com/questions/62150392/how-disable-link-async-module-prefetch-preload-by-default-with-vue-cli-4-3)

# 总结
1. 自己体感vue-cli会循环pages选项，生成多组单独的HtmlWebpackPlugin配置，所以修改的时候也要多处修改。vue cli文档中其实也提到了，但是要真的get并且成功修改并不是那么简单的。
2. 根据上一个推论，html-webpack-inline-source-plugin插件要用的配置inlineSource其实要写在pages里。
3. 强烈建议构建个包含全部pageName的数组，方便合并同样的配置项和批量删除preload和prefetch。
4. 关闭单独打包css和js分片，减少不必要的麻烦。
5. 多使用vue inspect指令查看生成的webpack设置。
