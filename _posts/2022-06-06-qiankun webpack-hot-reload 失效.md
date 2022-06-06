---
layout:     post
title:      "qiankun webpack-hot-reload 失效"
subtitle:   ""
date:       2022-06-06
author:     "漆黑菌"
header-img: "img/post-bg.jpg"
catalog: true
tags:
    - qiankun
    - fetch
    - CORS
    - dev server
---

# 依赖版本
新版webpack-dev-server（4.8.1）获取更新数据方式是通过fetch获取一个xxxxx-.hot-update.json/js的文件来更新，所以如果因为fetch等问题导致无法获取文件的话，hot reload会失效。

# dev server CORS
qiankun中父应用需要使用fetch拉取子应用的数据，但是子应用在开发时不在同一端口，有跨域问题，所以需要设置CORS。一般的设置在子应用dev server中配置Access-Control-Allow-Origin header即可。
```
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
```
但是项目开发中对fetch进行了一些手动处理，添加了authorization header。这样会导致只配置Access-Control-Allow-Origin的跨域失效，需要“复杂”的CORS。

dev server实际上是基于Express的。但是Express的CORS并没有那么智能，需要依赖中间件[expressjs/cors]('https://github.com/expressjs/cors')增强，否则无法处理“复杂”的CORS。
```
// 因为只需要给dev server用装到dev依赖中即可
npm i cors --save-dev 
```
根据[webpack-dev-server的文档](https://webpack.js.org/configuration/dev-server/#devserversetupmiddlewares)，可以在dev server中配置如下：
```
  const cors = require('cors');
  // ……
  devServer: {
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }

      devServer.app.use(cors());

      return middlewares;
    },
  },
```
