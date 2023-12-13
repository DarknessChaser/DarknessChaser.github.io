---
layout:     post
title:      "小探vue2中为什么使用transition过渡元素时，元素不能show和key同时存在"
subtitle:   ""
date:       2023-12-01
author:     "漆黑菌"
header-img: "img/post-bg.jpg"
catalog: true
tags:
    - vue transition
    - vue2
---

## 缘起

如果有代码

```html
<transition
    mode="out-in"
  >
    <div
        v-show="true"
        :key="game"
        class="tab-body-item"
    />
  </transition>
```

在game值变化后，元素div.tab-body-item将会从vnode树中消失。

## 原理

在transition中实际上有两种过渡模式，一种通过子节点销毁新建。对于v-show是提供了特殊的内置支持，把切换display属性推迟到过渡执行结束后。见[leave](https://github.com/vuejs/vue/blob/223a9e9f2ecf013e6ee5dbf98cbaa8cadf9daf50/src/platforms/web/runtime/directives/show.ts#L29)

 同时使用会产生冲突，是vue2的bug（但是自己没定位到）

## 代码位置

[extractPropsFromVNodeData](https://github.com/vuejs/vue/blob/49b6bd4264c25ea41408f066a1835f38bf6fe9f1/src/core/vdom/helpers/extract-props.ts#L12)
