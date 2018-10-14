---
layout:     post
title:      "JavaScript中的四种相等判断"
subtitle:   "由ES6中Set唯一性判断想到的"
date:       2018-10-14
author:     "漆黑菌"
header-img: "img/post-bg.jpg"
catalog: true
tags:
    - JavaScript相等性判断
    - 判断相等
    - Set
    - 唯一性
---

# ES6中的新数据结构Set
Set可以说是Java中的老朋友了，去重非常好用，而且JavaScript中的Set用法和表现也很接近于Java中的set。

## 新建Set添加内容至Set
Set 函数可以接受一个数组（或者具有 iterable 接口的其他数据结构）作为参数，用来初始化。通过add方法向 Set 结构加入成员，结果表明 Set 结构不会添加重复的值。

```
    const set = new Set([1, 2, 3, 4, 4]);
    [...set]
    // [1, 2, 3, 4]
    
    // 例二
    const items = new Set([1, 2, 3, 4, 5, 5, 5, 5]);
    items.size // 5
    
    // 例三
    const set = new Set(document.querySelectorAll('div'));
    set.size // 56
    
    // 类似于
    const set = new Set();
    document
     .querySelectorAll('div')
     .forEach(div => set.add(div));
    set.size // 56

    const s = new Set();
    
    [2, 3, 5, 4, 5, 2, 2].forEach(x => s.add(x));
    
    for (let i of s) {
      console.log(i);
    }
```
## Set的属性和方法
Set 结构的实例有以下属性。

- Set.prototype.constructor：构造函数，默认就是Set函数。
- Set.prototype.size：返回Set实例的成员总数。

Set 实例的方法分为两大类：对象方法（用于对象本身操作数据）和遍历方法（用于遍历成员）。

对象方法

- add(value)：添加某个值，返回 Set 结构本身。
- delete(value)：删除某个值，返回一个布尔值，表示删除是否成功。
- has(value)：返回一个布尔值，表示该值是否为Set的成员。
- clear()：清除所有成员，没有返回值。

遍历方法

- keys()：返回键名的遍历器
- values()：返回键值的遍历器
- entries()：返回键值对的遍历器
- forEach()：使用回调函数遍历每个成员

## 如何判断重复元素
向 Set 加入值的时候，不会发生类型转换，所以5和"5"是两个不同的值。Set 内部判断两个值是否不同，使用的算法叫做“Same-value-zero equality”，它类似于精确相等运算符（===），主要的区别是NaN等于自身，而精确相等运算符认为NaN不等于自身。

```
    let set = new Set()
    set.add(5)
    set.add('5')
    set.size // 2
```

```
    let set = new Set();
    let a = NaN;
    let b = NaN;
    set.add(a);
    set.add(b);
    set.size // 1
```

# JavaScript中的四种相等判断
根据MDN文档描述，JavaScript中有四种相等性判断，分别是。
- 抽象相等比较 （==）
- 严格相等比较 （===）: 用于  `Array.prototype.indexOf`,`Array.prototype.lastIndexOf`, 和 `case-matching`（switch 中的case）
- 同值零（SameValueZero）: 用于 `%TypedArray%`（是一类类型化数组的总称，感觉越来越像Java了） 和 `ArrayBuffer` 的构造函数（然而并不知道有什么卵用）、以及`Map`和`Set`, 并将用于 ES2016/ES7 中的`String.prototype.includes`
- 同值（SameValue）: 用于除以上之外的所有其他地方，通过`Object.is`暴露出

总结一下
- ==执行类型转换后再比较
- ===比较时不进行类型转换
- Object.is对NaN和+0，-0做了特殊处理NaN等于NaN了，+0等于0，但是+0和0都不等于-0
- SameValueZero在SameValue的基础上去掉了绕人的-0，0，+0比较，它们现在都相等了。

参考表
![各类比较结果图](https://cl.ly/2b6a21adf12b/download/Image%202018-10-15%20at%2012.12.40%20AM.png)