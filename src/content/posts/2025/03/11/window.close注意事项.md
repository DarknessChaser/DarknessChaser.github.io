---
title: "window.close注意事项"
published: 2025-03-11
category: "浏览器与 Web API"
tags: ["window.close"]
---
## 现象

直接使用`window.close()`在一些情况下会触发`Scripts may close only the windows that were opened by them.`导致关闭失败。正常通过链接跳转或者新tab装了插件通过地址栏打开，都不会触发。但是如果在无痕中，没有tab插件直接在地址栏中输入后回车，就会触发限制导致tab无法被js关闭。

