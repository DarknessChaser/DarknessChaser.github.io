---
layout:     post
title:      "JavaScript中判断是非为整数的小技巧"
subtitle:   
date:       2018-01-09
author:     "漆黑菌"
header-img: "img/post-bg.jpg"
catalog: true
tags:
    - JavaScript
    - 判断是非为整数
---

## 前言
众所周知JavaScript是一门弱类型语言，JavaScript中不区分整数和浮点数，所有数字内部都采用64位浮点格式表示好处是不用像Java一样疯狂写各种转换函数，坏处是当需要精确数据类型时有点头大。这次就记录下如何用JavaScript判断一个变量是否为整数。

### 一点技术原理
> 这篇看看如何判断为整数类型（Integer）,JavaScript中不区分整数和浮点数，所有数字内部都采用64位浮点格式表示，和Java的double类型一样。但实际操作中比如数组索引、位操作则是基于32位整数。

### 方式一、使用取余运算符判断
任何整数都会被1整除，即余数是0。利用这个规则来判断是否是整数。
```
function isInteger(obj) {
 return obj%1 === 0
}
isInteger(3) // true
isInteger(3.3) // false
isInteger('') // true
isInteger('3') // true
isInteger(true) // true
isInteger([]) // true
```

以上输出可以看出这个函数挺好用，但对于字符串和某些特殊值显得力不从心。
对于空字符串、字符串类型数字、布尔true、空数组都返回了true，真是难以接受。对这些类型的内部转换细节感兴趣的请参考：JavaScript中奇葩的假值
因此，需要先判断下对象是否是数字，比如加一个typeof。
```
function isInteger(obj) {
 return typeof obj === 'number' && obj%1 === 0
}
isInteger('') // false
isInteger('3') // false
isInteger(true) // false
isInteger([]) // false
```

### 方式二、使用Math.round、Math.ceil、Math.floor判断
整数取整后还是等于自己。利用这个特性来判断是否是整数，Math.floor示例，如下
```
function isInteger(obj) {
 return Math.floor(obj) === obj
}
isInteger(3) // true
isInteger(3.3) // false
isInteger('') // false
isInteger('3') // false
isInteger(true) // false
isInteger([]) // false
```

这个直接把字符串，true，[]屏蔽了，代码量比上一个函数还少。

### 方式三、通过parseInt判断
```
function isInteger(obj) {
 return parseInt(obj, 10) === obj
}
isInteger(3) // true
isInteger(3.3) // false
isInteger('') // false
isInteger('3') // false
isInteger(true) // false
isInteger([]) // false
```

但是这个有个bug。。。
```
isInteger(1000000000000000000000) // false
```

会返回false。。。。原因是parseInt在解析整数之前强迫将第一个参数解析成字符串。这种方法将数字转换成整型不是一个好的选择。

### 方式四、通过位运算判断
```
function isInteger(obj) {
 return (obj | 0) === obj
}
isInteger(3) // true
isInteger(3.3) // false
isInteger('') // false
isInteger('3') // false
isInteger(true) // false
isInteger([]) // false
```

这个函数很不错，效率还很高。但有个缺陷，上文提到过，位运算只能处理32位以内的数字，对于超过32位的无能为力，如
```
isInteger(Math.pow(2, 32)) // 32位以上的数字返回false了
```

不过，多数时候我们不会用到那么大的数字，一般也够用了。

### 方式五、ES6提供了原生Number.isInteger
```
Number.isInteger(3) // true
Number.isInteger(3.1) // false
Number.isInteger('') // false
Number.isInteger('3') // false
Number.isInteger(true) // false
Number.isInteger([]) // false
```

果然原生的还是厉害，不过如果要考虑老浏览器（例如IE8）兼容性的话就不能使用了。

## 结语
以上就是判断是否为整数类型的五种方式，这五种方式各有优缺点，可以进行仔细比较，选择最适合自己的进行使用。我这次的需求是输入的字符串为整数，所以就采用了先判断不是空字符串，再用不加`typeof`的第一种方式判断组合的方法来达到效果。
 