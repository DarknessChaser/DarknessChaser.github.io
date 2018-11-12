---
layout:     post
title:      "JavaScript中的如何区别object和array"
subtitle:   "面试总结"
date:       2018-11-12
author:     "漆黑菌"
header-img: "img/post-bg.jpg"
catalog: true
tags:
    - JavaScript判断object和array
---

# JavaScript中如何区别object和array
首先这个问题其实是开放性的，答案多种多样，目前来看是个考察水平深度的好问题。

## 实用的方法
jquery和es5中其实是提供了isArray函数的，有就用自带，没有就自己实现。

jQuery实现版：相对比较复杂考虑了多种情况。
```
    var class2type = {};
    isArray: Array.isArray || function( obj ) {
    		return jQuery.type( obj ) === "array";
    },
    type: function( obj ) {
		if ( obj == null ) {
			return obj + "";
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ toString.call( obj ) ] || "object" :
			typeof obj;
	}
```

一种简单的实现：
```
function isArray(obj){
    if(Array.isArray){
        return Array.isArray(obj);
    }else{
     return Object.prototype.toString.call(obj)==="[object Array]";
    }
```


## 我的骚操作
array有一个属性length是非常特殊的。js中使用array[index]方式给数组赋值时，当index超过当前length-1时，length也会做出相应的变动，也就是说。
```
    let a = [];
    a[500] = 'a';
    console.log(a.length) // 501
```
而虚假的length想做到这一点是很不容易的，于是乎就可以利用这一特性来区别array和object了。

```
    var a = [];
    var b = {};
    b.length = 4;
    b[233] = '1'

    function isArry(obj) {
        var len = obj.length;
        var flag = false;
        if (len !== undefined) {
            obj[len] = '1';
            obj.length === len + 1 ? flag = true : flag = false;
            delete obj[len];
        } else {
            flag = false;
        }
        return flag;
    }
    console.log(isArry(a))
    console.log(isArry(b))
```
## 几种常见的操作

### 1.用typeof运算符来判断（及其不靠谱）
typeof是javascript原生提供的判断数据类型的运算符，它会返回一个表示参数的数据类型的字符串，例如：

```
    const s = 'hello';
    console.log(typeof(s))//String
```

数组被归到了Any other object当中，所以typeof返回的结果应该是Object，并没有办法区分数组，对象，null等原型链上都有Object的数据类型。

```
    const a = null;
    const b = {};
    const c= [];
    console.log(typeof(a)); //Object
    console.log(typeof(b)); //Object
    console.log(typeof(c)); //Object
```

运行上面的代码就会发现，在参数为数组，对象或者null时，typeof返回的结果都是object，可以使用这种方法并不能识别出数组，因此，在JavaScript项目中用typeof来判断一个位置类型的数据是否为数组，是非常不靠谱的。

### 2.用instanceof判断
既然typeof无法用于判断数组是否为数组，那么用instance运算符来判断是否可行呢？要回答这个问题，我们首先得了解instanceof运算法是干嘛用的。

instanceof运算符可以用来判断某个构造函数的prototype属性所指向的對象是否存在于另外一个要检测对象的原型链上。在使用的时候语法如下：
```
    object instanceof constructor
```

用我的理解来说，就是要判断一个Object是不是数组（这里不是口误，在JavaScript当中，数组实际上也是一种对象），如果这个Object的原型链上能够找到Array构造函数的话，那么这个Object应该及就是一个数组，如果这个Object的原型链上只能找到Object构造函数的话，那么它就不是一个数组。

```
    const a = [];
    const b = {};
    console.log(a instanceof Array);//true
    console.log(a instanceof Object);//true,在数组的原型链上也能找到Object构造函数
    console.log(b instanceof Array);//false
```

### 3.使用isPrototypeOf()函数
此方法基本上是instanceof方法的变种。原理：检测一个对象是否是Array的原型（或处于原型链中，不但可检测直接父对象，还可检测整个原型链上的所有父对象）

使用方法: parent.isPrototypeOf(child)来检测parent是否为child的原型.

具体代码：

```
    Array.prototype.isPrototypeOf(arr) //true表示是数组，false不是数组
```

### 4.用constructor判断（比较不靠谱）
实例化的数组拥有一个constructor属性，这个属性指向生成这个数组的方法。
```
    const a = [];
    console.log(a.constructor);//function Array(){ [native code] }
```

以上的代码说明，数组是有一个叫Array的函数实例化的。
如果被判断的对象是其他的数据类型的话，结果如下：

```
    const o = {};
    console.log(o.constructor);//function Object(){ [native code] }
    const r = /^[0-9]$/;
    console.log(r.constructor);//function RegExp() { [native code] }
    const n = null;
    console.log(n.constructor);//报错
```

看到这里，你可能会觉得这也是一种靠谱的判断数组的方法，我们可以用以下的方式来判断:

```
    const a = [];
    console.log(a.constructor == Array);//true
```

然而constructor属性是可以改写的……所以此方法也不靠谱。

```
    //定义一个数组
    const a = [];
    //作死将constructor属性改成了别的
    a.contrtuctor = Object;
    console.log(a.constructor == Array);//false (哭脸)
    console.log(a.constructor == Object);//true (哭脸)
    console.log(a instanceof Array);//true (instanceof火眼金睛)
```
可以看出，constructor属性被修改之后，就无法用这个方法判断数组是数组了，除非你能保证不会发生constructor属性被改写的情况，否则用这种方法来判断数组也是不靠谱的。