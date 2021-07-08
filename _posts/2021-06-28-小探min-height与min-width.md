---
layout:     post
title:      "小探min-height与min-width"
subtitle:   
date:       2021-06-28
author:     "漆黑菌"
header-img: "img/post-bg.jpg"
catalog:    true
tags:
    - min-height
    - min-height:0
    - aspect-ratio
---

## 起因
某次周会分享的时候，同事介绍了`aspect-ratio`属性。有个很好玩的现象，当设置了`aspect-ratio`和`min-height:0`的时候和只设置了`aspect-ratio`的时候，虽然浏览器里`min-height`的显示都是`0`，但是表现会很不相同。详情可见参考文档1。第一种设置的时候，子元素超过比例限制会撑大父元素。但是第二种不会。

## 参考文档
1. [https://drafts.csswg.org/css-sizing-4/#aspect-ratio-minimum](https://drafts.csswg.org/css-sizing-4/#aspect-ratio-minimum)
2. [https://drafts.csswg.org/css-sizing-3/#min-size-properties](https://drafts.csswg.org/css-sizing-3/#min-size-properties)

## 神奇的min-height初始值
是0也不完全是0.根据文档，其实在css2中默认值是0，但是新版中改成了auto，为了保持兼容性会在老旧布局中把auto计算为0。这里可以观察真正的block和flex中子元素的block，第一种情况会显示为0，第二种情况会展示为auto。

ps，max-height/width的默认值是none，不是auto，但是和auto一样并不支持动画……

```
auto
For width/height, specifies an automatic size (automatic block size/automatic inline size). See the relevant layout module for how to calculate this.
For min-width/min-height, specifies an automatic minimum size. Unless otherwise defined by the relevant layout module, however, it resolves to a used value of 0. For backwards-compatibility, the resolved value of this keyword is zero for boxes of all [CSS2] display types: block and inline boxes, inline blocks, and all the table layout boxes. It also resolves to zero when no box is generated.
```

## 原因
详情见参考文档2，当min-height为auto时，实际上最小高度是一个类似最小内容高度的值，所以会撑大`aspect-ratio`设置带来的height。但是手动设置为0时，就没有这个限制了，表现就为根据`aspect-ratio`计算出的height了。

## 验证
[https://codepen.io/chriscoyier/pen/YzyoodW](https://codepen.io/chriscoyier/pen/YzyoodW) 把里面的俩DIV外面包一个flex的div，表现就一致了。
