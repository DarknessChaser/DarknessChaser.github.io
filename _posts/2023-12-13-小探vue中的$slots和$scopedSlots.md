---
layout:     post
title:      "小探vue中的$slots和$scopedSlots"
subtitle:   ""
date:       2023-12-13
author:     "漆黑菌"
header-img: "img/post-bg.jpg"
catalog: true
tags:
    - vue $slots
    - vue $scopedSlots
    - vue2.6
    - vue2.7
    - vue3
---

## 缘起

vue2.6.11的项目代码中试图通过$slots.slotName判断是否传递了自定义slot发现行为不合预期。

## 总结

在vue2.6和vue2.7中使用$scopedSlots，在vue3中使用$slots。

## vue中的 useSlots
vue2.7 见[vm](https://github.com/vuejs/vue/blob/9e88707940088cb1f4cd7dd210c9168a50dc347c/src/v3/apiSetup.ts#L166)其实也是指向了$scopedSlots

vue3 见[slots: instance.slots,](https://github.com/vuejs/core/blob/24fccb4ee4139d41df0e395bce96ce7fbb6a50a9/packages/runtime-core/src/component.ts#L1175)指向了slots

## 历史

在vue2.6之前可以向slot传递参数的scopedSlot和普通的slot是两种东西，分别放在$scopedSlots和$slots中。在vue2.6中把两种slot都在$scopedSlots中暴露，见[https://github.com/vuejs/vue/releases/tag/v2.6.0-beta.1](https://github.com/vuejs/vue/releases/tag/v2.6.0-beta.1)。在vue2.6.2和vue2.7([2.7.0-alpha.5](https://github.com/vuejs/vue/blob/main/CHANGELOG.md#270-alpha5-2022-06-06)回滚)早期也都尝试统一到$slots中，但是都失败了。最终在vue3中才成功）。
