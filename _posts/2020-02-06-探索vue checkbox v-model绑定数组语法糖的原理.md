---
layout:     post
title:      "探索vue checkbox v-model绑定数组语法糖的原理"
subtitle:   
date:       2020-02-06
author:     "漆黑菌"
header-img: "img/post-bg.jpg"
catalog: true
tags:
    - vue
    - checkbox
    - v-model
    - v-model原理
---

# 简介
在使用vue完成一个对象数组绑定checkbox页面时产生了一个疑问，`Array.indexof`等方法在处理对象数组的时候比较的都是引用，那么vue会如何处理checkbox上value绑定的Object与v-model绑定数组中引用不同的两个相同对象呢？

太长不看版结论，是用类似deepequal的机制比较的，引用不同也会被当成相同的元素。

# 先做个实验
先准备俩长得一样，但是引用不同的对象
```
    var a = {
        name: 'a',
        type: 'typeA',
    };
    var b = {
        name: 'a',
        type: 'typeA',
    };
```

然后在vue中声明a，b和空数组arr1，
```
    data: {
        arr1: [],
        a: a,
        b: b,
    },
```

temple如下
```
    <input type="checkbox" v-model="arr1" :value="b">
    <button type="button" @click="arr1.push(a)">push</button>
```

点击button后，虽然数组中新增的是a，checkbox value绑定的是b，这两者的引用显然是不同的，但是依然会因为b和a相同而被选中。

ps：稍微复杂的codesandbox在线版

[![Edit check-all-test](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/check-all-test-ie749?fontsize=14&hidenavigation=1&theme=dark)

# 那么具体的运行原理是什么呢
这就需要在vue源码中寻找解释了，我用的是vue v2.6.10的完整版UMD。

在代码中寻找与checkbox和model相关的代码会发现一个名为`genCheckboxModel`的函数，经过打断点实验后这就是处理checkbox v-model的相关代码了。分析这段代码后会发现，这段代码在处理**array**时会用到一个名为`_i`的函数。说实话这个函数蛮不好找位置的，搜索代码的时候勾上**words**选项会减少无关代码干扰。发现这个函数是`looseIndexOf`函数的别名，然后`looseIndexOf`又依赖`looseEqual`。

```
  function looseEqual (a, b) {
    if (a === b) { return true }
    var isObjectA = isObject(a);
    var isObjectB = isObject(b);
    if (isObjectA && isObjectB) {
      try {
        var isArrayA = Array.isArray(a);
        var isArrayB = Array.isArray(b);
        if (isArrayA && isArrayB) {
          return a.length === b.length && a.every(function (e, i) {
            return looseEqual(e, b[i])
          })
        } else if (a instanceof Date && b instanceof Date) {
          return a.getTime() === b.getTime()
        } else if (!isArrayA && !isArrayB) {
          var keysA = Object.keys(a);
          var keysB = Object.keys(b);
          return keysA.length === keysB.length && keysA.every(function (key) {
            return looseEqual(a[key], b[key])
          })
        } else {
          /* istanbul ignore next */
          return false
        }
      } catch (e) {
        /* istanbul ignore next */
        return false
      }
    } else if (!isObjectA && !isObjectB) {
      return String(a) === String(b)
    } else {
      return false
    }
  }
```

感觉可以去回答如何实现一个简单的`deepEqual`，阅读代码后正好和实验中的结果吻合，所以vue是用类似deepequal的机制比较checkbox上value绑定的Object与v-model绑定数组中的对象。