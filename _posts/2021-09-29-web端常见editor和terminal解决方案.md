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

#### yaml能力验证
折叠可以 上色有 报错没有

#### 快速体验链接
https://ace.c9.io/build/kitchen-sink.html

## monaco-editor
72.5kB MINIFIED
12.9kB MINIFIED + GZIPPED
开源许可证MIT可以商用
功能够强大……用起来很顺手。
内置主题比较少（目测第三方一车），而且没有分包。官方的最小展示demo中搜索框和代码小地图也没有移除。
官方JavaScript无主题+worker + 字体 7.8mb 其中worker4.8mb，字体66kb。
最大缺点就是太大了

#### yaml能力验证
折叠可以 上色有 报错可以有（第三方）而且还是像显示在ide里面的那种

#### 快速体验链接
https://github.com/remcohaszing/monaco-yaml

## CodeMirror
168.8kB MINIFIED
55.6kB MINIFIED + GZIPPED
开源许可证MIT可以商用
基础使用JavaScript上色功能+主题+联想
9kb（基础CSS） + 400kb（基础js）+9kb（monokai主题） +1kb（基础联想css）+20kb（基础联想js） + 7kb（js联想）+ 40kb（js语言支持）= 486kb
拥有基础的联想能力，HTML，JavaScript，YAML等都支持，也支持按需手动引入支持。

#### yaml能力验证
折叠可以 上色有 不内置要依赖第三方，现在应该用的yaml js转换校验的方案

## CodeMirror6
上面的现代化版本，拆的很细自动补全等功能都拆成了单独的包。
开发环境要求node16，使用了es model。
还在开发中，缺少主题信息。使用基础配置加简单的js联想（主题暂缺）大概950kb。

#### yaml能力验证
无内置yaml支持

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

## hterm
GCP在用，直接起demo加载大概900kb资源，在GCP里看依赖大概200kb。有虚拟列表，使用web component。文档支持比较差，高度怀疑是给内部用的。文档里说有个examples其实根本没有，而且win环境开发不友好。GCP文档搜了下也没说能支持搜索功能。

PS：谷歌有个文件上传下载功能。我觉得不错。可以输入目录然后把文件下载下来。
PPS：可以搞成浏览器拓展加快加载速度。

## xterm
阿里云和腾讯云，谷歌的Cloud Shell Editor都用的这款，算业界优选了吧。颜色输入复制粘贴啥的都没问题，滚动选中是ok的，有插件可以支持搜索功能。唯一缺点稍微有点大。性能测试里最大限制100w行吧，一般也够用。scrollback设置成infinity时会被设置成4294967295。
327.2kB MINIFIED
71.2kB MINIFIED + GZIPPED