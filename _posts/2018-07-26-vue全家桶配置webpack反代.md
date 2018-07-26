---
layout:     post
title:      "vue全家桶配置webpack反代"
subtitle:   ""
date:       2018-07-26
author:     "漆黑菌"
header-img: "img/post-bg.jpg"
catalog: true
tags:
    - vue
    - 混淆
    - 反代
    - webpack
---

# vue全家桶配置反代
在运行前后的分离的项目时，有时候工程化前端项目需要打包后才能运行，此时使用传统的nginx反代方式就会非常的麻烦。此时就可以用到`html-webpack-plugin`这款插件。在vue全家桶中，已经集成了这款插件，并且进行了封装。

打开`项目名\config\index.js`文件，在dev配置下找到`proxytable`选项，原理类似nginx参照配置即可，附上一份配置文件。


```
    proxyTable: {
          '/api/*': {
            target: 'http://10.0.0.90:8999',
            changeOrigin: true,
            secure: false
          }
        }
```
