---
layout:     post
title:      "移动端混合开发监听页面可见性visibilitychange优化页面数据同步"
subtitle:   ""
date:       2019-08-27
author:     "漆黑菌"
header-img: "img/post-bg.jpg"
catalog:    true
tags:
    - 移动端
    - visibilitychange
    - 锁屏
    - 定时器不准确
---

## 需求背景
1. 任务中心中，跳转第三方页面完成任务后，因为没有一个机制通知前端已经在第三方页面完成任务，导致任务完成状态无法更新。
2. 领券中心中，现有的预热倒计时需利用前端计时器，当页面被切换到后台或者手机锁屏时计时器会暂停，导致虽然领券时间已经到了但是前端页面还在倒计时。

## 参考文章
阮一峰老师的文章入门[http://www.ruanyifeng.com/blog/2018/10/page_visibility_api.html](http://www.ruanyifeng.com/blog/2018/10/page_visibility_api.html "Page Visibility API 教程")。

MDN介绍，其中还有个简单的polyfill，使用该polyfill后基本可支持到安卓4.0和iOS7.0级别，兼容性方面完全可用[https://developer.mozilla.org/zh-CN/docs/Web/API/Page_Visibility_API](https://developer.mozilla.org/zh-CN/docs/Web/API/Page_Visibility_API "页面可见性 API")

#### 备注
1. 更传统的还有`PageTransitionEvent`API(含`pageshow`和`pagehide`)与监听`onblur、onfocus`事件，但是并不是很适合移动端的情况，如移动设备息屏。
2. 还发现个`Page Lifecycle`API可以更好的完成类似任务，但是目前来看应该是chrome自己的私有实现，暂未成为标准。

## 简介
内部测试了一下`visibilitychange`事件在移动端的兼容性情况，发现在应用内和系统浏览器里进行多任务切换，返回首页、息屏和跳转其他方页面后返回可以触发`visibilitychange`事件，但是在微信浏览器中跳转其他页面后返回并不可以……还需要进一步探究解决方案。因为这种`visibilitychange`事件后的同步优先级并不是非常高，所以在任务中心中暂时选择了关闭loading提示。而领券中心中相对对时间更敏感，选择了保留。
