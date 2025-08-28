---
layout:     post
title:      "探究下 vue 中的 expose"
subtitle:   ""
date:       2025-08-28
author:     "漆黑菌"
header-img: "img/post-bg.jpg"
catalog: true
tags:
    - vue expose
    - vue defineExpose
    - vue composition-api
    - vue2.7
    - vue3
---

## 缘起
在网络上发现了一种通过 expose 来实现组件封装的方法见[vue组件二次封装-究极版](https://www.bilibili.com/video/BV1bDe1z1Eyr/?buvid=XY5387C549AF1E2C83338AC1C32895E2A9239&from_spmid=dt.video-dt.video.0&is_story_h5=false&mid=lgxZ0wctTv%2F7uT7bDSAJyw%3D%3D&plat_id=114&share_from=ugc&share_medium=android&share_plat=android&share_session_id=a82a582b-d8d4-464d-89ee-fae3e0c5d9f3&share_source=COPY&share_tag=s_i&spmid=main.ugc-video-detail.0.0&timestamp=1756312647&unique_k=DdhzKKs&up_id=423876881&vd_source=cd8680a20c84d1e32fc4163ee20e8888)。例子是 vue3 的，想知道 vue2.7 中是否也可以使用。

## 总结
经过测试发现，透传 props events slots 和正确设置 type 是可以的，但是需要注意以下几点：
- vue2.7 中的动态组件不支持 is 直接传入 h 函数。并且vue3 中的 slots 对应的是 vue2.7的 scopedSlots。其实用 template 循环 slot 的老办法比较好
- 对 events 的处理 vue2.7 和 vue3 有所不同
- 导出方法比较困难。视频中利用 ref 可以传入一个 function 然后把组件实例通过 defineExpose 挂到当前上下文的方式来让新组件继承。 vue3 中的 defineExpose 会挂在 instance.exposed 上，vue2.7 是直接放在 instance 上的。vue2.7 比较难以确定哪些是真正想要暴露的属性。
- 如果不是 setup 写的老 vue 组件可以用 extends 继承试一下，能正常拿到属性（但是this 指向会变，比如 this.$refs会有问题）。用 setup 的就歇逼了，可以考虑用个 ref 暴露一下，也就用不到强行 as defineExpose 提供正确类型提示了

## vue 中的 expose
经过挖坟发现这个功能是在 vue3.0.3 加入的，见[https://github.com/vuejs/core/blob/main/changelogs/CHANGELOG-3.0.md#303-2020-11-25](https://github.com/vuejs/core/blob/main/changelogs/CHANGELOG-3.0.md#303-2020-11-25)，然后移植到了 vue2.7 和 vue composition-api 中。

vue composition-api 见[expose: (exposed?: Record<string, any>) => void](https://github.com/vuejs/composition-api/blob/2436ba2ca0ae804a3932924407f54e675073ea5c/src/runtimeContext.ts#L155)

vue2.7 见[expose](https://github.com/vuejs/vue/blob/13f4e7dc03e2caed900ac70ff8b8fe58dda45663/src/v3/apiSetup.ts#L116-L120) 直接往上下文上挂

vue3 见[instance.exposed = exposed || {}](https://github.com/vuejs/core/blob/24fccb4ee4139d41df0e395bce96ce7fbb6a50a9/packages/runtime-core/src/component.ts#L1149)
