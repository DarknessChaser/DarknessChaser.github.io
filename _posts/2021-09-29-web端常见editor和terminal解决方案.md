---
layout:     post
title:      "web端常见editor和terminal解决方案"
subtitle:   ""
date:       2021-09-29
author:     "漆黑菌"
header-img: "img/post-bg.jpg"
catalog:    true
tags:
    - ace-editor
    - monaco-editor
    - CodeMirror
    - CodeMirror6
    - novnc
    - guacamole
    - xterm
---

# editor
## Ace (editor)
npm的ace-builds@1.4.12  357.5kB 97.9kB
爹是AWS，主要产品是[AWS Cloud9](https://aws.amazon.com/cn/cloud9/)，更新有保障。
开源许可证是BSD New，可以二次打包商用。
基础使用JavaScript上色功能+主题+联想+worker
372kb（editor基础）+78kb（显示联想的语言基础支持） + 20kb（JavaScript支持） + 3kb（monokai主题） + 208kb（worker是可选项） = 681kb/473kb（没worker）
拥有基础的联想能力，HTML，JavaScript，YAML等都支持，也支持按需手动引入支持。

## monaco-editor
72.5kB MINIFIED
12.9kB MINIFIED + GZIPPED
开源许可证MIT可以商用
功能够强大……用起来很顺手。
内置主题比较少（目测第三方一车），而且没有分包。官方的最小展示demo中搜索框和代码小地图也没有移除。
官方JavaScript无主题+worker + 字体 7.8mb 其中worker4.8mb，字体66kb。
最大缺点就是太大了

## CodeMirror
168.8kB MINIFIED
55.6kB MINIFIED + GZIPPED
开源许可证MIT可以商用
基础使用JavaScript上色功能+主题+联想
9kb（基础CSS） + 400kb（基础js）+9kb（monokai主题） +1kb（基础联想css）+20kb（基础联想js） + 7kb（js联想）+ 40kb（js语言支持）= 486kb
拥有基础的联想能力，HTML，JavaScript，YAML等都支持，也支持按需手动引入支持。

## CodeMirror6
上面的现代化版本，拆的很细自动补全等功能都拆成了单独的包。
开发环境要求node16，使用了es model。
还在开发中，缺少主题信息。使用基础配置加简单的js联想（主题暂缺）大概950kb。

# terminal
## @novnc/novnc
自己在用的云服务器厂商在用，支持颜色，输入没啥问题，新版支持复制粘贴和选中。不支持插件。
185.4kB MINIFIED
50.7kB MINIFIED + GZIPPED
协议MPL 2.0对商用还是比较友好的。实际找了个页面进去只加载了150kb左右的资源。

## guacamole
aws的终端，颜色输入没问题，粘贴和复制要手动右键，滚动选中直接快捷键有问题需要右键，无搜索功能。整个终端加载需要2.5mb。
63.9kB MINIFIED
18.7kB MINIFIED + GZIPPED

## xterm
阿里云和腾讯云都用的这款，算业界优选了吧。颜色输入复制粘贴啥的都没问题，滚动选中是ok的，有插件可以支持搜索功能。唯一缺点稍微有点大。
327.2kB MINIFIED
71.2kB MINIFIED + GZIPPED