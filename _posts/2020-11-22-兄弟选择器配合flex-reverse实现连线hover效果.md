---
layout:     post
title:      "兄弟选择器配合flex-reverse实现连线hover效果"
subtitle:   ""
date:       2020-11-22
author:     "漆黑菌"
header-img: "img/post-bg.jpg"
catalog: true
tags:
    - css
    - pointer-events
    - css兄弟选择器
    - flex-flow reverse
---

# 原理
因为种种原因，css世界里基本上是只能上文影响下文，父元素影响子元素的。而flex-reverse等css样式可以通过改变视觉顺序和dom实际顺序的关系，也就是看上去是下文的元素实际上在dom中是上文，产生通过下文影响上文的错觉。

# 要点
1. 看上去的第一行实际上是第二行，看上去一行的第一个item实际上是最后一个。
2. 看上去的第二行实际上的第一行hover时，左半边看上去空空的元素也会触发兄弟元素hover样式，通过父元素设置`pointer-events: none;`，子元素设置`pointer-events: auto;`来规避。

# 另一个杂技玩法

看上去是hover效果的样式实际上是默认样式，设置被hover元素后的兄弟元素被设置为看上去不是hover的样式。初始化状态不能展示看上去是hover样式的问题通过给父元素增加hover后展示看上去是默认样式来规避，同时也要通过设置父子元素的`pointer-events`来调整hover效果面积。

# 疗效
[兄弟选择器配合flex-reverse实现连线hover效果](https://darknesschaser.github.io/my-front-end-test/css-test-hover/index.html "兄弟选择器配合flex-reverse实现连线hover效果")

[默认样式和hover样式视觉欺骗效果](https://darknesschaser.github.io/my-front-end-test/css-test-hover/index2.html "默认样式和hover样式视觉欺骗效果")