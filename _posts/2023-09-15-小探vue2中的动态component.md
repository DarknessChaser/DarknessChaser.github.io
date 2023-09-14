---
layout:     post
title:      "小探vue2中的动态component"
subtitle:   ""
date:       2023-09-15
author:     "漆黑菌"
header-img: "img/post-bg.jpg"
catalog: true
tags:
    - vue动态component
---

## 默认安装

安装postcss-preset-env，并添加配置文件。按照文档来就可以。

## 启用有副作用插件

本次想要降级has选择器，这是一个有副作用的插件，默认不会开启，并且需要手动映入js。

1. 在配置文件中直接写好'css-has-pseudo': {}，
2. 在需要降级的地方引入import cssHasPseudo from 'css-has-pseudo/browser';并传入cssHasPseudo(document);直接传document算是偷懒，理论上应该只在需要的地方传入。
