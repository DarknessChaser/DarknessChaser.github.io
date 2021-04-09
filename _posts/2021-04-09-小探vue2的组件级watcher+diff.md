---
layout:     post
title:      "小探vue2的组件级watcher+diff"
subtitle:   
date:       2021-04-09
author:     "漆黑菌"
header-img: "img/post-bg.jpg"
catalog: true
tags:
    - vue diff
    - vue vdom
    - vue watcher
---

## 缘起
在学习为什么vue要引入vdom的时候看到了一个说法
>在Vue1.0中采用了极高的细粒度，每一个绑定一个对应的watcher实例，进行观察状态的变化，但是当状态越多的节点被使用时，会有一些内存开销以及一些依赖追踪的开销。

>在Vue2.0以后，引入了虚拟DOM，为单个组件设置一个watcher实例，即使组件内有10个节点，里面状态发生变化时，只会通知到组件，然后组件内部通过虚拟DOM进行对比和渲染。

看了半天有点似懂非懂，于是今天起了个vue1的环境研究了一下。

## 尝试理解
vue1没有vdom，为了保证尽量少的dom变动（只有绑定数据更新的dom才更新）。每个和数据绑定的dom都需要有个watcher来监控。vue引入vdom后watcher只需要精确到组件级就可以了。组件发现变化后一波diff操作，在vdom层级上进行比较再更新需要更新的dom即可。看上去vue1的做法少了diff，理论上效率应该更高，但是缺点是watcher太多消耗内存。2的做法算是一种折衷。

## 总结
vdom的好处增加了！
1. 提供跨平台能力
2. 配合组件级diff在保证少更新dom的同时，减少watcher数量
