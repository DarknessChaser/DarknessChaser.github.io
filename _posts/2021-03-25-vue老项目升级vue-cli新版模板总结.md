---
layout:     post
title:      "vue老项目升级vue-cli新版模板总结"
subtitle:   
date:       2021-03-25
author:     "漆黑菌"
header-img: "img/post-bg.jpg"
catalog: true
tags:
    - vue
    - vue-cli
    - vue-cli升级
---

## 总体思路
先用新版vue-cli创建一个空白模板，然后把原有的源代码部分迁移过去。把eslint关掉，先一点点改webpack相关报错信息，改好了再加回来，改eslint的报错信息。推荐把eslint的自动化lint单独写一个commit方便code review。只靠前端想很好的迁移也不太现实，最好找个测试也有空的时候，让测试同学一起发现各种问题。

## 遇到的坑总结
#### 环境变量名称修改
新版cli对环境变量前缀有要求，见[vue-cli官方文档](https://cli.vuejs.org/zh/guide/mode-and-env.html#%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F)
>只有 NODE_ENV，BASE_URL 和以 VUE_APP_ 开头的变量将通过 webpack.DefinePlugin 静态地嵌入到客户端侧的代码中。这是为了避免意外公开机器上可能具有相同名称的私钥。
这一步基本手动全局替换即可

#### 修改main函数入口
旧版大概长这样
```
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
});
```
新版大概这样，对着修改即可
```
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
```

#### 迁移原有webpack配置
新版vue-cli隐藏了很多旧版的webpack配置，有直接配置的，比如devServer反代设置就迁过去，没直接提供的参考[官方文档](https://cli.vuejs.org/zh/guide/webpack.html#%E9%93%BE%E5%BC%8F%E6%93%8D%E4%BD%9C-%E9%AB%98%E7%BA%A7)用chainwebpack改配置。babel，postcss之类的配置文件就直接丢到了用新cli的配置基本够用，有啥自定义的去新位置迁移就好。

#### 迁移静态资源文件
根据文档，新增了public文件夹用来存放不需要处理的静态文件，原项目只需要把favicon和index.html模板迁过来就好。

#### 迁移npm中的依赖
先一股脑复制过去，因为当时的node版本和之前创建项目时已经差的比较多了。很多版本需要手动升级，还有可能会出问题。思路是先升级最新版本，挂了就先回滚到小版本中比较新的，升级的同时找到依赖相关的页面，自己注意功能有没有什么明显问题。大概跑起来以后，去依赖库的文档站看看，基本上写的好的都有迁移指南，再大升级。

#### 构建产物配置回滚
这个一般其实不需要，但是当时项目的转发规则做了些限制，导致新版cli build出的静态资源部分无法访问，所以要返祖一波。

```
  //修改产物文件夹
  assetsDir:'static', 

  // 去掉构建产物中的hash信息，其实这算劣化并不推荐这样做
  config.module
  .rule('images')
  .use('url-loader')
  .loader('url-loader')
  .tap((options) => {
    let name = options.fallback.options.name;
    name = name.replace('[name].[hash:8].[ext]', '[name].[ext]');
    options.fallback.options.name = name;
    options.limit = 1;
    return options;
  })
  .end();
```
