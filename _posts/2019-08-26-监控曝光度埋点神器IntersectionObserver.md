---
layout:     post
title:      "监控曝光度埋点神器IntersectionObserver"
subtitle:   ""
date:       2019-08-26
author:     "漆黑菌"
header-img: "img/post-bg.jpg"
catalog:    true
tags:
    - 曝光埋点
    - IntersectionObserver
    - swiper插件
---


## 需求背景
8月初接到了产品侧的一个需求，希望埋点能够提供活动的曝光情况，正好就想到了`IntersectionObserver`这个新API。

## 参考文章
阮一峰老师的文章入门也不错，但是后面缺乏更新和polyfill就不推荐了。

从入门到进阶的用法[https://juejin.im/post/5d23fe1551882514bf5bf4c9](https://juejin.im/post/5d23fe1551882514bf5bf4c9 "监听DOM曝光事件 IntersectionObserver")

一个初步入门的例子，基本能满足需求[https://juejin.im/post/5d11ced1f265da1b7004b6f7](https://juejin.im/post/5d11ced1f265da1b7004b6f7 "超好用的API之IntersectionObserver")

W3C的polyfill[https://github.com/w3c/IntersectionObserver/tree/master/polyfill](https://github.com/w3c/IntersectionObserver/tree/master/polyfill "IntersectionObserver Polyfill")

MDN链接可以自行搜索


## 简介
虽然`IntersectionObserver`在caniuse上显示的支持情况并不太好（尤其是iOS到iOS12才支持），但是W3C给出的polyfill兼容性非常好（根据GitHub说明为IE7+），实际上兼容性已经不是问题了。具体到曝光的需求上，需要注意的是。
1. 目标元素出现在root可视区或者离开都会触发callback，所以要通过`intersectionRatio`或`isIntersecting`来判断是否进入**可见**区域。
2. 曝光统计实际上只需要发出一次就可以了，所以可以在当前页面维护一个set队列。只有当出现的dom不在set中才发送曝光埋点，并同时使用`unobserve()`移除监听此dom。
3. vue中使用时，初始化监听dom操作要在`$nextTick`后。记得在组件销毁，或路由离开时使用`disconnect()`销毁监听任务，防止内存泄漏。
4. 遇到使用`swiper`插件的情况时，因为dom操作比较复杂并不推荐使用`IntersectionObserver`，我选择埋在`slideChange`事件中。`swiper`插件初始化的时候，因为要滚动到指定的轮播元素，所以也会触发`slideChange`事件，似乎并不用为了第一帧专门在初始化事件里单独监听。

## 展示
利用IntersectiOnobserver新API特性进行的监控可见性测试[https://darknesschaser.github.io/my-front-end-test/intersectionobserver-test/intersectionobserver-test.html](https://darknesschaser.github.io/my-front-end-test/intersectionobserver-test/intersectionobserver-test.html "利用IntersectiOnobserver新API特性进行的监控可见性测试")
