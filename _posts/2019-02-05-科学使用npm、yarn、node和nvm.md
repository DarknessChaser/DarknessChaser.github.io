---
layout:     post
title:      "科学使用npm、yarn、node和nvm"
subtitle:   ""
date:       2019-02-05
author:     "漆黑菌"
header-img: "img/post-bg.jpg"
catalog: true
tags:
    - 科学使用
    - 网络工程
    - npm
    - nvm
    - 代理
---

# 问题
**npm**、**yarn**和**nvm**指令有时会遇到些不可抗力问题。
> nvm是解决node版本不兼容导致项目无法启动问题的node版本管理工具

# 方法
#### 给npm设置代理

```
    启动

    $ npm config set proxy http://server:port
    $ npm config set https-proxy http://server:port
    
    
    取消
    
    npm config delete proxy
    npm config delete https-proxy

    查看配置项
    
    npm config list
```

#### 指定淘宝源安装

**注意** 
1. yarn和npm不一样，npm设置registry会覆盖lock文件中的依赖下载来源，yarn@1.22.10则相反，会按照lock文件中的下载地址安装。所以建议改变registry后把本地依赖删了重新装一下。（而且理论上构建的时候就不用配置registry了？）
2. 阿里源有两个地址`registry.nlark.com`和`registry.npm.taobao.org`，前者在网上检索可以发现cnpm会用。所以设置阿里源后出现第一个地址的依赖也很正常。

npm

```
    一次性

    npm install --registry=https://registry.npm.taobao.org
    
    长期

    npm config set registry https://registry.npm.taobao.org

    取消

    npm config delete registry

```

yarn
``` 
    长期

    yarn config set registry https://registry.npm.taobao.org/

    取消

    yarn config delete registry

```

#### nvm指定淘宝源
```
nvm node_mirror https://npm.taobao.org/mirrors/node/
nvm npm_mirror https://npm.taobao.org/mirrors/npm/
```

#### nvm设置代理
```
nvm proxy localhost:1081
```
> 经测试（当前版本1.1.7）只支持HTTP代理