---
layout:     post
title:      "事情不是你想象的那样-在chrome下操作cookie时的一些问题"
subtitle:   ""
date:       2019-09-17
author:     "漆黑菌"
header-img: "img/post-bg.jpg"
catalog:    true
tags:
    - chrome
    - cookie
    - localhost
    - 跨域
    - js-cookie
---

## 简介
这次负责的页面要提供登录授权token，目前是采用传统的cookie模式。之前只知道cookie可以通过设置domain和path来控制可读取范围，但是一直以为cookie和localstorage一样，是存在跨域限制的，然而实际上cookie理解成跟随着“域名”似乎会更加合适。

## 同域名或同IP但不同端口号
可以共享cookie，甚至协议不同（HTTP和HTTPS）也一样，此处和跨域有很明显的不同。![不同端口/协议共享cookie](/images/2019-09-17/cookie1.jpg "不同端口/协议共享cookie")

## 处理localhost
在本地测试的时候经常会需要往localhost中写cookie，根据测试结果在chrome中指定domain为localhost写入是可以的，但是在IE11中则不可以。如果需要在IE11中写入则需要不设置domain采用默认值的方式。网上一些文章中提到domain必须要有`“.”`才能正常使用，所以有些写法会指定domain为`.localhost`，然而根据测试这种写法在IE11和chrome中都不能正确工作。所以在处理主域名和子域名的时候对于localhost要单独处理一下。