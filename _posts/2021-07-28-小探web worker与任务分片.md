---
layout:     post
title:      "小探web worker与任务分片"
subtitle:   
date:       2021-07-28
author:     "漆黑菌"
header-img: "img/post-bg.jpg"
catalog:    true
tags:
    - web worker
    - requestIdleCallback
---

## demo
[渲染大量随机不重复颜色div测试](https://darknesschaser.github.io/my-front-end-test/div-random-color-test/div-random-color-test.html)

## 思路
1. JS只有单线程，当执行大量任务时可能阻塞渲染线程
2. web worker提供了额外线程能力，可以把较为复杂的计算任务丢给worker线程去做，（现在Monaco-editor就会把语义分析任务丢给worker）
3. requestIdleCallback接口提供了闲时执行的能力
4. 把复杂任务串行化，使之可以中断。这样就可以把浏览器渲染任务放在有空闲的时候进行。这样就不会阻塞浏览器操作了
5. 当数据处理很复杂的时候才有用，在demo中甚至是负优化
6. 把任务分成俩部分，worker负责生成任务，定期发送给主线程，然后主线程添加到队列中，再使用requestIdleCallback接口消费
