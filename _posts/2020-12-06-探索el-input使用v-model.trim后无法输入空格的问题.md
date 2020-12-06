---
layout:     post
title:      "探索el-input使用v-model.trim后无法输入空格的问题"
subtitle:   ""
date:       2020-12-06
author:     "漆黑菌"
header-img: "img/post-bg.jpg"
catalog: true
tags:
    - element-ui
    - el-input
    - trim
    - 无法输入空格
---

# 原理
elementUI和vue genComponentModel机制冲突。作用在组件上的v-model在加了trim修饰符后向子组件传递value（默认情况下）事件时会先进行trim操作。而el-input中this.value和this.nativeInputValue同步的机制

```
  nativeInputValue() {
    return this.value === null || this.value === undefined ? '' : String(this.value);
  },
```
由于父传子传入的value已经被trim，导致handleInput中执行
```
  handleInput(event) {
    // should not emit input during composition
    // see: https://github.com/ElemeFE/element/issues/10516
    if (this.isComposing) return;
    // hack for https://github.com/ElemeFE/element/issues/8548
    // should remove the following line when we don't support IE
    if (event.target.value === this.nativeInputValue) return;
    this.$emit('input', event.target.value);
    // ensure native input value is controlled
    // see: https://github.com/ElemeFE/element/issues/12850
    this.$nextTick(this.setNativeInputValue);
  },
  setNativeInputValue() {
    const input = this.getInput();
    if (!input) return;
    if (input.value === this.nativeInputValue) return;
    input.value = this.nativeInputValue;
  },
```
this.$nextTick(this.setNativeInputValue);后的结果就是input.value变为父组件trim后的value。

# 原生input为什么可以输入字符串头尾空格
v-model对原生dom和component的处理逻辑不同，在处理原生dom时会生成类似
```
 on: {
    "input": function($event) {
        if ($event.target.composing)
            return;
        input = $event.target.value.trim();
        debugger ;
    },
    "blur": function($event) {
        return $forceUpdate()
    }
}
```
的代码，只在blur后才把input的值同步到dom上。

# 总结
trim修饰符作用在v-model上的时候会导致数据层数据和dom层value不一致的情况，所以就需要一个机制来把数据层trim后的值重新和dom层同步。原生dom是在blur上，component需要自己处理。因为elementui在处理的时候用的是父组件trim后的值，所以会导致空格无法输入。