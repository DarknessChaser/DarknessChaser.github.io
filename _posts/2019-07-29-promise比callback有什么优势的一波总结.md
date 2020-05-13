---
layout:     post
title:      "promise比callback有什么优势的一波总结"
subtitle:   ""
date:       2019-07-29
author:     "漆黑菌"
header-img: "img/post-bg.jpg"
catalog:    true
tags:
    - promise比callback优势
---

## 参考文章
chrome有一篇介绍promise的文章很不错[https://developers.google.com/web/fundamentals/primers/promises?hl=zh-cn](https://developers.google.com/web/fundamentals/primers/promises?hl=zh-cn "JavaScript Promise：简介")

## 优势
1. 可读性上升，不用像callback写法一样层层嵌套
2. 可以成功/失败事件发生和处理分离，callback+事件监听器写法如果事件已经发生，再监听就不能捕获事件了。而且使用promise写法可以先执行promise，再进行处理。
3. 关注分离，更容易实现逻辑解耦。如处理错误时可以用一个处理方法处理多个异步操作嵌套中任意一个产生的错误。发出请求显示loading框的关闭方法不用在两个回调中分别写一遍。
4. 可以同时执行若干异步任务，等全部结束后统一处理，且promise.all得到的结果和传入的顺序一致。
5. promise是未来发展方向，如新的 await async 函数就依赖promise，可以使js异步操作更直观，callback写法就无福享受了。
