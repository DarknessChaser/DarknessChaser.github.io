---
layout:     post
title:      "小探vue2中的动态component"
subtitle:   ""
date:       2023-09-15
author:     "漆黑菌"
header-img: "img/post-bg.jpg"
catalog: true
tags:
    - vue 动态component
---

## 缘起

当前vue2项目中存在jsx和template混用的情况。发现可以通过
```HTML
<component
    :is="{ render: $slots.default }"
/>
```
向component is中传递一个有render属性的render函数在template中渲染jsx生成的组件。

## 总结

当向is中传入object时，vue2会调用vue.extend创建一个vue component，所以render就可以用了。此时和一个有render选项的组件是一样的。所以理论上也可以拥有自己的data，props之类的……

## 代码位置
[vnode = createComponent(tag as any, data, context, children)](https://github.com/vuejs/vue/blob/9dd006b481b4299462e044741bac0861c0b1775c/src/core/vdom/create-element.ts#L129)
createElement
[Ctor = baseCtor.extend(Ctor as typeof Component)](https://github.com/vuejs/vue/blob/9dd006b481b4299462e044741bac0861c0b1775c/src/core/vdom/create-component.ts#L116)
