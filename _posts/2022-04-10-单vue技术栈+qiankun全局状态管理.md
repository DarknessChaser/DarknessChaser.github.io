---
layout:     post
title:      "单vue技术栈+qiankun全局状态管理"
subtitle:   ""
date:       2022-04-10
author:     "漆黑菌"
header-img: "img/post-bg.jpg"
catalog: true
tags:
    - vue3
    - vue2
    - pinia
    - vuex
    - qiankun
    - 全局状态管理
---

# vue2+qiankun+vuex全局状态管理
基于他人项目改造的，有用的部分是main + app-vue-history + app-vue-history2。项目链接：[https://github.com/DarknessChaser/qiankun-global-test](https://github.com/DarknessChaser/qiankun-global-test)

# vue3+qiankun+pinia全局状态管理
基于他人项目改造的，有用的部分是main + huge-spa-1 + huge-spa-1-sub。项目链接：[https://github.com/DarknessChaser/qiankun-global-vue3-test](https://github.com/DarknessChaser/qiankun-global-vue3-test)

# 为什么vue2中可以直接重复observer vue3就不行了
## demo链接
在线访问链接：
1. vue2[https://darknesschaser.github.io/my-front-end-test/vue-global-test/vue2.html](https://darknesschaser.github.io/my-front-end-test/vue-global-test/vue2.html)
2. vue3[https://darknesschaser.github.io/my-front-end-test/vue-global-test/vue3.html](https://darknesschaser.github.io/my-front-end-test/vue-global-test/vue3.html)

源码链接：[https://github.com/DarknessChaser/my-front-end-test/tree/master/vue-global-test](https://github.com/DarknessChaser/my-front-end-test/tree/master/vue-global-test)

## vue2的行为
vue2会改变被observer的对象本身的get和set方法，然后当再一次被另一个vue2 observer的时候，get和set都会被存起来。
```
// cater for pre-defined getter/setters
var getter = property && property.get;
var setter = property && property.set;
```
```
set: function reactiveSetter (newVal) {
  var value = getter ? getter.call(obj) : val;
  ...
  // 删除了部分代码
  if (setter) {
    setter.call(obj, newVal);
  } else {
    val = newVal;
  }
  ...
  // 删除了部分代码
  dep.notify();
}
```

当执行了第二个vue2 挂上的set以后，也会在执行之后执行第一个vue2挂上去的set。

## vue3的行为
vue3改用了另一种方式，不改变对象本身。而是通过proxy把对象包一层，平时操作的都是proxy后的对象。因此直接操作对象本体是不会触发视图层更新的。而且当一个对象被reactive后，vue3会设置一个**__v_isReactive**的标记。第二个vue3再去reactive的时候会读到这个标记直接中断操作。因此，使用第二个vue3的reactive包第一个vue3 reactive后的对象并不会成功。
```
if (target["__v_raw" /* RAW */] &&
    !(isReadonly && target["__v_isReactive" /* IS_REACTIVE */])) {
    return target;
}
```
当对同一个对象reactive两次的时候，虽然会产生两个被proxy后的对象，但是因为背后都是同一个对象。当第一个被proxy的对象更改时，本体对象也会被更改，第二个被proxy对象去更改时会检查一次数值有无变化，此时会发现本体的值已经被改了，所以不会触发set操作因此也不会触发视图层更新。
```
return function set(target, key, value, receiver) {
    ...
    // 删去部分代码
    const result = Reflect.set(target, key, value, receiver);
    // don't trigger if target is something up in the prototype chain of original
    if (target === toRaw(receiver)) {
        if (!hadKey) {
            trigger(target, "add" /* ADD */, key, value);
        }
        else if (hasChanged(value, oldValue)) { // 在这里会通过hasChanged（里面是object.is）判断是否需要触发set操作
            trigger(target, "set" /* SET */, key, value, oldValue);
        }
    }
    return result;
};
```
